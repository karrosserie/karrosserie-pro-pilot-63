
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, Check, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Jscanify } from '@/lib/jscanify';
import SimpleCaptureMode from './SimpleCaptureMode';

interface SimpleDocumentScannerProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  documentType?: string;
}

// Dimensions d'extraction selon le type de document
const getExtractionDimensions = (documentType?: string): { width: number; height: number } => {
  switch (documentType) {
    case 'driver-license':
      return { width: 856, height: 540 };
    case 'registration':
      return { width: 595, height: 842 };
    case 'insurance':
      return { width: 800, height: 600 };
    case 'payment-proof':
    case 'expense-proof':
      return { width: 600, height: 800 };
    case 'violation':
      return { width: 595, height: 420 };
    case 'check':
    case 'cheque':
      return { width: 875, height: 400 };
    default:
      return { width: 595, height: 842 };
  }
};

declare global {
  interface Window {
    cv: any;
  }
}

// Load OpenCV via CDN (more reliable than npm)
const loadOpenCV = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.cv && window.cv.Mat) {
      console.log('[OpenCV] Already loaded');
      resolve();
      return;
    }

    console.log('[OpenCV] Loading from CDN...');
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
    script.async = true;

    script.onload = () => {
      console.log('[OpenCV] Script loaded, waiting for runtime...');
      
      const checkReady = () => {
        if (window.cv && window.cv.Mat) {
          console.log('[OpenCV] Runtime ready');
          resolve();
        } else if (window.cv) {
          window.cv.onRuntimeInitialized = () => {
            console.log('[OpenCV] Runtime initialized');
            resolve();
          };
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      console.error('[OpenCV] Failed to load from CDN');
      reject(new Error('Échec du chargement OpenCV'));
    };

    document.head.appendChild(script);
  });
};

// Detect mobile device
const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Adaptive constants for mobile vs desktop
const DETECTION_INTERVAL = isMobileDevice ? 120 : 66; // 8 FPS mobile, 15 FPS desktop
const SCANNER_TIMEOUT = isMobileDevice ? 30000 : 60000; // 30s mobile, 60s desktop
const GC_PAUSE_INTERVAL = isMobileDevice ? 3000 : 5000; // 3s mobile, 5s desktop
const GC_PAUSE_DURATION = isMobileDevice ? 300 : 500; // 300ms mobile, 500ms desktop
const MAX_CONSECUTIVE_ERRORS = 5;
const VIDEO_WIDTH = isMobileDevice ? 1280 : 1920;
const VIDEO_HEIGHT = isMobileDevice ? 720 : 1080;

export const SimpleDocumentScanner: React.FC<SimpleDocumentScannerProps> = ({
  onCapture,
  onClose,
  documentType,
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const scannerRef = useRef<Jscanify | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const scannerStartTimeRef = useRef<number>(0);
  const lastGCPauseRef = useRef<number>(0);
  const consecutiveErrorsRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Chargement...');

  // Release canvas memory explicitly (critical for iOS Safari)
  const releaseCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      // Setting dimensions to 0 forces memory release on iOS
      canvas.width = 0;
      canvas.height = 0;
      console.log('[Memory] Canvas released');
    } catch (e) {
      console.warn('[Memory] Canvas release error:', e);
    }
  }, []);

  // Stop camera with explicit memory cleanup
  const stopCamera = useCallback(() => {
    console.log('[Camera] Stopping with memory cleanup...');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Release canvas memory
    releaseCanvas(canvasRef.current);
  }, [releaseCanvas]);

  // Start camera with adaptive resolution for mobile
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUseFallbackMode(false);
      consecutiveErrorsRef.current = 0;
      setStatusMessage('Accès caméra...');

      console.log('[Camera] Requesting getUserMedia, isMobile:', isMobileDevice);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: VIDEO_WIDTH },
          height: { ideal: VIDEO_HEIGHT },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('[Camera] Stream attached to video');
        
        try {
          await videoRef.current.play();
          console.log('[Camera] Video playing');
        } catch (playErr) {
          console.warn('[Camera] Autoplay failed:', playErr);
        }
      }
    } catch (err) {
      console.error('[Camera] Error:', err);
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setIsLoading(false);
    }
  }, []);

  // Handle video play event
  const handleVideoPlay = useCallback(() => {
    console.log('[Video] Playing');
    setIsVideoPlaying(true);
    setIsLoading(false);
    setStatusMessage('Détection active');
  }, []);

  // Initialize OpenCV and camera on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Load OpenCV first
        setStatusMessage('Chargement OpenCV...');
        await loadOpenCV();
        
        if (!mounted) return;
        
        setIsOpenCVReady(true);
        console.log('[Init] OpenCV ready');

        // Then start camera
        await startCamera();
      } catch (err) {
        console.error('[Init] Error:', err);
        if (mounted) {
          setError('Erreur initialisation. Réessayez.');
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Determine if this is a small format document (license, card, etc.)
  const isSmallFormat = ['driver-license', 'insurance', 'violation', 'check'].includes(documentType || '');

  // Detection loop with throttling and timeout
  useEffect(() => {
    if (!isVideoPlaying || !isOpenCVReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize scanner and reset stabilizer for fresh detection
    const scanner = new Jscanify();
    scanner.resetStabilizer();
    scannerRef.current = scanner;
    scannerStartTimeRef.current = performance.now();
    console.log('[Detection] Starting loop, isSmallFormat:', isSmallFormat);

    const detectLoop = (timestamp: number) => {
      const elapsedTime = timestamp - scannerStartTimeRef.current;
      
      // Security timeout - stop detection to prevent memory leaks
      if (elapsedTime > SCANNER_TIMEOUT) {
        console.warn('[Detection] Timeout reached, stopping detection loop');
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        toast({
          title: "Scanner arrêté",
          description: `Le scanner s'est arrêté après ${SCANNER_TIMEOUT / 1000}s. Appuyez sur SCANNER pour capturer.`,
        });
        return;
      }

      // Periodic GC pause - skip detection every 5 seconds for 500ms to let garbage collector work
      const timeSinceLastGCPause = timestamp - lastGCPauseRef.current;
      if (timeSinceLastGCPause >= GC_PAUSE_INTERVAL && timeSinceLastGCPause < GC_PAUSE_INTERVAL + GC_PAUSE_DURATION) {
        // In GC pause window - skip detection
        animationRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      if (timeSinceLastGCPause >= GC_PAUSE_INTERVAL + GC_PAUSE_DURATION) {
        lastGCPauseRef.current = timestamp;
      }

      // Throttle detection - 8 FPS on mobile, 15 FPS on desktop
      if (timestamp - lastDetectionTimeRef.current >= DETECTION_INTERVAL) {
        lastDetectionTimeRef.current = timestamp;
        
        if (video.readyState >= 2 && video.videoWidth > 0) {
          // Match canvas size to video
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          // Draw video frame
          ctx.drawImage(video, 0, 0);

          // Highlight detected document (green contours) with adaptive detection
          // Skip OpenCV detection in fallback mode
          if (!useFallbackMode) {
            try {
              scanner.highlightPaper(canvas, { 
                color: 'lime', 
                thickness: 6,
                isSmallFormat 
              });
              consecutiveErrorsRef.current = 0; // Reset on success
            } catch (err) {
              consecutiveErrorsRef.current++;
              console.warn('[Detection] Error count:', consecutiveErrorsRef.current);
              
              // Switch to fallback mode after too many errors
              if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
                console.warn('[Detection] Switching to fallback mode (no OpenCV)');
                setUseFallbackMode(true);
                toast({
                  title: "Mode simplifié activé",
                  description: "Détection désactivée. Cadrez manuellement le document.",
                });
              }
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(detectLoop);
    };

    animationRef.current = requestAnimationFrame(detectLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isVideoPlaying, isOpenCVReady, isSmallFormat, useFallbackMode, toast]);

  // Capture document with double-click protection
  const handleCapture = useCallback(() => {
    // Double-click protection
    if (isCapturing) {
      console.log('[Capture] Already capturing, ignoring');
      return;
    }
    
    const canvas = canvasRef.current;
    const scanner = scannerRef.current;

    if (!canvas || !scanner) {
      toast({
        title: "Erreur",
        description: "Scanner non prêt",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);

    // Get dimensions based on document type
    const { width, height } = getExtractionDimensions(documentType);
    console.log('[Capture] Extracting paper with dimensions:', width, 'x', height, 'for type:', documentType, 'isSmallFormat:', isSmallFormat);

    try {
      // Pass isSmallFormat for adaptive extraction
      const extracted = scanner.extractPaper(canvas, width, height, undefined, isSmallFormat);

      if (extracted && extracted.width > 0) {
        console.log('[Capture] Extraction successful:', extracted.width, 'x', extracted.height);
        const dataUrl = extracted.toDataURL('image/jpeg', 0.92);
        setPreviewDataUrl(dataUrl);
        setShowPreview(true);
      } else {
        console.warn('[Capture] No document detected, using raw capture');
        // Fallback: capture raw canvas
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setPreviewDataUrl(dataUrl);
        setShowPreview(true);
        toast({
          title: "Aucun document détecté",
          description: "Image brute capturée. Assurez-vous que le document est visible avec un fond contrasté.",
        });
      }
    } catch (err) {
      console.error('[Capture] Error:', err);
      // Fallback: capture raw canvas
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPreviewDataUrl(dataUrl);
      setShowPreview(true);
    } finally {
      setIsCapturing(false);
    }
  }, [toast, documentType, isSmallFormat, isCapturing]);

  // Validate captured document
  const handleValidate = useCallback(() => {
    if (!previewDataUrl) return;

    console.log('[Validate] Converting to blob...');
    
    fetch(previewDataUrl)
      .then(res => res.blob())
      .then(blob => {
        console.log('[Validate] Blob created:', blob.size, 'bytes');
        stopCamera();
        onCapture(blob);
      })
      .catch(err => {
        console.error('[Validate] Error:', err);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder l'image",
          variant: "destructive"
        });
      });
  }, [previewDataUrl, stopCamera, onCapture, toast]);

  // Retake photo
  const handleRetake = useCallback(async () => {
    setShowPreview(false);
    setPreviewDataUrl(null);
    setIsVideoPlaying(false);
    
    // Reset stabilizer for fresh detection on retake
    if (scannerRef.current) {
      scannerRef.current.resetStabilizer();
    }
    
    // Restart camera to reconnect stream
    await startCamera();
  }, [startCamera]);

  // Handle close
  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Preview screen
  if (showPreview && previewDataUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/80">
          <h2 className="text-white font-medium">Aperçu du document</h2>
          <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Preview image */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img
            src={previewDataUrl}
            alt="Document scanné"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Action buttons */}
        <div className="p-4 bg-black/80 flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleRetake}
            className="flex-1 h-14 text-lg border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reprendre
          </Button>
          <Button
            type="button"
            onClick={handleValidate}
            className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="mr-2 h-5 w-5" />
            Valider
          </Button>
        </div>
      </div>
    );
  }

  // Main scanner view
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 z-10">
        <h2 className="text-white font-medium">Scanner un document</h2>
        <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="text-white">
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        {/* Video element - visible */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onPlay={handleVideoPlay}
        />

        {/* Canvas overlay for detection contours */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
            <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
            <p className="text-white text-lg">{statusMessage}</p>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-6">
            <p className="text-red-400 text-lg text-center mb-4">{error}</p>
            <Button type="button" onClick={startCamera} variant="outline" className="text-white border-white">
              Réessayer
            </Button>
          </div>
        )}

        {/* Status indicator */}
        {isVideoPlaying && !isLoading && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white text-sm">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      {isVideoPlaying && !isLoading && (
        <div className="bg-black/80 px-4 py-2 text-center">
          <p className="text-white/80 text-sm">
            Cadrez le document • Les contours verts s'affichent quand détecté
          </p>
        </div>
      )}

      {/* Capture button */}
      <div className="p-4 bg-black/80">
        <Button
          type="button"
          onClick={handleCapture}
          disabled={!isVideoPlaying || isLoading}
          className="w-full h-16 text-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
        >
          <Camera className="mr-3 h-6 w-6" />
          SCANNER
        </Button>
      </div>
    </div>
  );
};

export default SimpleDocumentScanner;
