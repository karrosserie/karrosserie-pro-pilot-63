
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, Check, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Jscanify } from '@/lib/jscanify';

interface SimpleDocumentScannerProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  documentType?: string;
}

// Dimensions d'extraction selon le type de document
const getExtractionDimensions = (documentType?: string): { width: number; height: number } => {
  switch (documentType) {
    case 'driver-license':
      // Format carte de crédit (CR80) : 85.6mm × 54mm → ratio ~1.59:1
      return { width: 856, height: 540 };
    case 'registration':
      // Carte grise française - format A4 ou proche
      return { width: 595, height: 842 };
    case 'insurance':
      // Carte d'assurance - souvent format carte ou petit document
      return { width: 800, height: 600 };
    case 'payment-proof':
    case 'expense-proof':
      // Tickets, reçus - format variable, ratio plus carré
      return { width: 600, height: 800 };
    case 'violation':
      // PV/contravention - format A5 horizontal
      return { width: 595, height: 420 };
    default:
      // Par défaut : A4
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
    // Check if already loaded
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

  const [isLoading, setIsLoading] = useState(true);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Chargement...');

  // Stop camera
  const stopCamera = useCallback(() => {
    console.log('[Camera] Stopping...');
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
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatusMessage('Accès caméra...');

      console.log('[Camera] Requesting getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
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

  // Detection loop
  useEffect(() => {
    if (!isVideoPlaying || !isOpenCVReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize scanner
    const scanner = new Jscanify();
    scannerRef.current = scanner;
    console.log('[Detection] Starting loop');

    const detectLoop = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Match canvas size to video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Draw video frame
        ctx.drawImage(video, 0, 0);

        // Highlight detected document (green contours)
        try {
          scanner.highlightPaper(canvas, { color: 'lime', thickness: 6 });
        } catch (err) {
          // Silent fail - detection continues
        }
      }

      animationRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isVideoPlaying, isOpenCVReady]);

  // Capture document
  const handleCapture = useCallback(() => {
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

    // Get dimensions based on document type
    const { width, height } = getExtractionDimensions(documentType);
    console.log('[Capture] Extracting paper with dimensions:', width, 'x', height, 'for type:', documentType);

    try {
      const extracted = scanner.extractPaper(canvas, width, height);

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
    }
  }, [toast, documentType]);

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
  const handleRetake = useCallback(() => {
    setShowPreview(false);
    setPreviewDataUrl(null);
  }, []);

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
