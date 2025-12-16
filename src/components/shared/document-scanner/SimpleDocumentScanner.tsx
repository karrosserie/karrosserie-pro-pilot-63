
import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { CornerPoints } from '@/lib/jscanify';
import { Button } from '@/components/ui/button';
import { X, Camera, Check, RotateCcw, Loader2, CameraOff } from 'lucide-react';
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

// Load OpenCV via CDN
const loadOpenCV = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.cv && window.cv.Mat) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
    script.async = true;

    script.onload = () => {
      const checkReady = () => {
        if (window.cv && window.cv.Mat) {
          resolve();
        } else if (window.cv) {
          window.cv.onRuntimeInitialized = () => {
            resolve();
          };
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      reject(new Error('Échec du chargement OpenCV'));
    };

    document.head.appendChild(script);
  });
};

// Detect mobile device
const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// OPTIMIZED: Adaptive constants for mobile vs desktop
const DETECTION_INTERVAL = isMobileDevice ? 200 : 80; // 5 FPS mobile, 12 FPS desktop
const SCANNER_TIMEOUT = isMobileDevice ? 25000 : 60000; // 25s mobile, 60s desktop
const GC_PAUSE_INTERVAL = isMobileDevice ? 2500 : 5000; // 2.5s mobile
const GC_PAUSE_DURATION = isMobileDevice ? 400 : 500; // 400ms mobile
const MAX_CONSECUTIVE_ERRORS = 3;
const NO_DETECTION_TIMEOUT = 5000; // Show manual capture after 5s without detection
// OPTIMIZED: Lower resolution for mobile
const VIDEO_WIDTH = isMobileDevice ? 960 : 1920;
const VIDEO_HEIGHT = isMobileDevice ? 540 : 1080;

// Calculate video object-cover transform for coordinate mapping
const getVideoCoverTransform = (video: HTMLVideoElement, containerWidth: number, containerHeight: number) => {
  const videoAspect = video.videoWidth / video.videoHeight;
  const containerAspect = containerWidth / containerHeight;
  
  let scale: number, offsetX: number, offsetY: number;
  
  if (videoAspect > containerAspect) {
    // Video is wider than container - crop horizontally
    scale = containerHeight / video.videoHeight;
    offsetX = (containerWidth - video.videoWidth * scale) / 2;
    offsetY = 0;
  } else {
    // Video is taller than container - crop vertically
    scale = containerWidth / video.videoWidth;
    offsetX = 0;
    offsetY = (containerHeight - video.videoHeight * scale) / 2;
  }
  
  return { scale, offsetX, offsetY };
};

export const SimpleDocumentScanner: React.FC<SimpleDocumentScannerProps> = ({
  onCapture,
  onClose,
  documentType,
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Container for dimensions
  const processingCanvasRef = useRef<HTMLCanvasElement>(null); // Hidden canvas for OpenCV
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null); // Visible overlay for contours
  const canvasRef = useRef<HTMLCanvasElement>(null); // For capture fallback
  const animationRef = useRef<number | null>(null);
  const scannerRef = useRef<Jscanify | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const scannerStartTimeRef = useRef<number>(0);
  const lastGCPauseRef = useRef<number>(0);
  const consecutiveErrorsRef = useRef<number>(0);
  const lastSuccessfulDetectionRef = useRef<number>(0);
  const pulsePhaseRef = useRef<number>(0);
  const lastDetectedPointsRef = useRef<CornerPoints | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Chargement...');
  const [showManualCapture, setShowManualCapture] = useState(false);
  const [hasDetectedDocument, setHasDetectedDocument] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Release canvas memory explicitly
  const releaseCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.width = 0;
      canvas.height = 0;
    } catch (e) {}
  }, []);

  // Draw contours on overlay canvas with pulsing effect - with coordinate transform
  const drawContours = useCallback((
    ctx: CanvasRenderingContext2D, 
    points: { topLeft: {x: number, y: number}, topRight: {x: number, y: number}, bottomLeft: {x: number, y: number}, bottomRight: {x: number, y: number} },
    canvasWidth: number,
    canvasHeight: number,
    transform: { scale: number, offsetX: number, offsetY: number }
  ) => {
    if (canvasWidth <= 0 || canvasHeight <= 0) return;

    // Clear overlay
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Transform point from video coordinates to display coordinates
    const transformPoint = (p: {x: number, y: number}) => ({
      x: p.x * transform.scale + transform.offsetX,
      y: p.y * transform.scale + transform.offsetY
    });
    
    const transformedPoints = {
      topLeft: transformPoint(points.topLeft),
      topRight: transformPoint(points.topRight),
      bottomLeft: transformPoint(points.bottomLeft),
      bottomRight: transformPoint(points.bottomRight)
    };
    
    // Pulsing effect
    pulsePhaseRef.current = (pulsePhaseRef.current + 0.15) % (Math.PI * 2);
    const pulseAlpha = 0.7 + Math.sin(pulsePhaseRef.current) * 0.3;
    const pulseGlow = 10 + Math.sin(pulsePhaseRef.current) * 8;
    
    ctx.save();
    
    // Glow effect
    ctx.shadowColor = 'lime';
    ctx.shadowBlur = pulseGlow;
    
    // Draw contour
    ctx.strokeStyle = `rgba(50, 255, 50, ${pulseAlpha})`;
    ctx.lineWidth = isMobileDevice ? 4 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(transformedPoints.topLeft.x, transformedPoints.topLeft.y);
    ctx.lineTo(transformedPoints.topRight.x, transformedPoints.topRight.y);
    ctx.lineTo(transformedPoints.bottomRight.x, transformedPoints.bottomRight.y);
    ctx.lineTo(transformedPoints.bottomLeft.x, transformedPoints.bottomLeft.y);
    ctx.closePath();
    ctx.stroke();
    
    // Draw corner markers
    const cornerSize = isMobileDevice ? 15 : 20;
    ctx.fillStyle = `rgba(50, 255, 50, ${pulseAlpha})`;
    
    [transformedPoints.topLeft, transformedPoints.topRight, transformedPoints.bottomLeft, transformedPoints.bottomRight].forEach(corner => {
      ctx.beginPath();
      ctx.arc(corner.x, corner.y, cornerSize / 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }, []);

  // Stop camera with cleanup
  const stopCamera = useCallback(() => {
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
    releaseCanvas(processingCanvasRef.current);
    releaseCanvas(overlayCanvasRef.current);
    releaseCanvas(canvasRef.current);
  }, [releaseCanvas]);

  // Start camera with optimized resolution for mobile
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUseFallbackMode(false);
      setShowManualCapture(false);
      setHasDetectedDocument(false);
      consecutiveErrorsRef.current = 0;
      lastSuccessfulDetectionRef.current = 0;
      setStatusMessage('Accès caméra...');

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
        
        try {
          await videoRef.current.play();
        } catch (playErr) {
          // Autoplay may fail, user interaction required
        }
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setIsLoading(false);
    }
  }, []);

  // Handle video play event
  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
    setIsLoading(false);
    setStatusMessage('Recherche du document...');

    // Ensure overlay canvas is sized immediately (before the first detection frame)
    const container = containerRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (container && overlayCanvas) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      overlayCanvas.width = width;
      overlayCanvas.height = height;
      setContainerDimensions({ width, height });
      console.log('[Scanner] handleVideoPlay - container dimensions:', { width, height });
    }
  }, []);

  // Initialize OpenCV and camera on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setStatusMessage('Chargement...');
        await loadOpenCV();
        
        if (!mounted) return;
        
        setIsOpenCVReady(true);
        await startCamera();
      } catch (err) {
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

  // Determine if this is a small format document
  const isSmallFormat = ['driver-license', 'insurance', 'violation', 'check', 'cheque'].includes(documentType || '');

  // Detection loop with overlay canvas for contours - with proper coordinate transform
  useEffect(() => {
    if (!isVideoPlaying || !isOpenCVReady) return;

    const video = videoRef.current;
    const container = containerRef.current;
    const processingCanvas = processingCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!video || !container || !processingCanvas || !overlayCanvas) return;

    const processingCtx = processingCanvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!processingCtx || !overlayCtx) return;

    const scanner = new Jscanify();
    scanner.resetStabilizer();
    scannerRef.current = scanner;
    scannerStartTimeRef.current = performance.now();
    lastSuccessfulDetectionRef.current = performance.now();

    const detectLoop = (timestamp: number) => {
      const elapsedTime = timestamp - scannerStartTimeRef.current;
      
      // Security timeout
      if (elapsedTime > SCANNER_TIMEOUT) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        setUseFallbackMode(true);
        toast({
          title: "Scanner arrêté",
          description: "Utilisez le bouton CAPTURER pour prendre la photo.",
        });
        return;
      }

      // Check if we should show manual capture button
      const timeSinceLastDetection = timestamp - lastSuccessfulDetectionRef.current;
      if (timeSinceLastDetection > NO_DETECTION_TIMEOUT && !showManualCapture && !hasDetectedDocument) {
        setShowManualCapture(true);
        setStatusMessage('Document non détecté');
      }

      // GC pause for mobile memory
      const timeSinceLastGCPause = timestamp - lastGCPauseRef.current;
      if (timeSinceLastGCPause >= GC_PAUSE_INTERVAL && timeSinceLastGCPause < GC_PAUSE_INTERVAL + GC_PAUSE_DURATION) {
        animationRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      if (timeSinceLastGCPause >= GC_PAUSE_INTERVAL + GC_PAUSE_DURATION) {
        lastGCPauseRef.current = timestamp;
      }

      // Throttled detection
      if (timestamp - lastDetectionTimeRef.current >= DETECTION_INTERVAL) {
        lastDetectionTimeRef.current = timestamp;
        
        if (video.readyState >= 2 && video.videoWidth > 0) {
          // Get current container dimensions
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          // Sync processing canvas with video resolution
          if (processingCanvas.width !== video.videoWidth || processingCanvas.height !== video.videoHeight) {
            processingCanvas.width = video.videoWidth;
            processingCanvas.height = video.videoHeight;
          }
          
          // Sync overlay canvas with CONTAINER dimensions (display size)
          if (overlayCanvas.width !== containerWidth || overlayCanvas.height !== containerHeight) {
            overlayCanvas.width = containerWidth;
            overlayCanvas.height = containerHeight;
          }

          // Draw video to hidden processing canvas
          processingCtx.drawImage(video, 0, 0);
          
          // Calculate transform from video coordinates to display coordinates
          const transform = getVideoCoverTransform(video, containerWidth, containerHeight);

          if (!useFallbackMode) {
            try {
              // Use detectPaper to get points in VIDEO coordinates
              const detectedPoints = scanner.detectPaper(processingCanvas, isSmallFormat);
              
              // DIAGNOSTIC LOGS
              console.log('[Scanner Debug]', {
                detected: !!detectedPoints,
                points: detectedPoints,
                canvasDims: { w: overlayCanvas.width, h: overlayCanvas.height },
                containerDims: { w: containerWidth, h: containerHeight },
                videoDims: { w: video.videoWidth, h: video.videoHeight },
                transform
              });
              
              if (detectedPoints) {
                // Store points for pulsing animation (avoids re-running OpenCV)
                lastDetectedPointsRef.current = detectedPoints;
                // Draw contours on overlay canvas with coordinate transform
                drawContours(overlayCtx, detectedPoints, overlayCanvas.width, overlayCanvas.height, transform);
                
                lastSuccessfulDetectionRef.current = timestamp;
                if (!hasDetectedDocument) {
                  setHasDetectedDocument(true);
                  setShowManualCapture(false);
                  setStatusMessage('Document détecté ✓');
                }
              } else {
                // Clear overlay when no detection
                overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
              }
              
              consecutiveErrorsRef.current = 0;
            } catch (err) {
              consecutiveErrorsRef.current++;
              overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
              
              if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
                setUseFallbackMode(true);
                toast({
                  title: "Mode simplifié",
                  description: "Cadrez manuellement le document.",
                });
              }
            }
          }
        }
      } else if (hasDetectedDocument && lastDetectedPointsRef.current && container && overlayCtx) {
        // Continue pulsing animation using STORED points - NO OpenCV call (critical for FPS)
        const transform = getVideoCoverTransform(video, container.clientWidth, container.clientHeight);
        drawContours(overlayCtx, lastDetectedPointsRef.current, overlayCanvas.width, overlayCanvas.height, transform);
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
  }, [isVideoPlaying, isOpenCVReady, isSmallFormat, useFallbackMode, toast, showManualCapture, hasDetectedDocument, drawContours]);
  
  // Resize handler for overlay canvas
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      if (container && overlayCanvas) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        overlayCanvas.width = width;
        overlayCanvas.height = height;
        setContainerDimensions({ width, height });
        console.log('[Scanner] resize - container dimensions:', { width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Capture with OpenCV extraction
  const handleCapture = useCallback(() => {
    if (isCapturing) return;
    
    const processingCanvas = processingCanvasRef.current;
    const scanner = scannerRef.current;
    const video = videoRef.current;

    if (!processingCanvas || !video) {
      toast({
        title: "Erreur",
        description: "Scanner non prêt",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);

    // Draw current frame to processing canvas for extraction
    const ctx = processingCanvas.getContext('2d');
    if (ctx && video.readyState >= 2) {
      processingCanvas.width = video.videoWidth;
      processingCanvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
    }

    const { width, height } = getExtractionDimensions(documentType);

    try {
      let extracted: HTMLCanvasElement | null = null;
      
      // Try OpenCV extraction if scanner is available
      if (scanner && !useFallbackMode) {
        extracted = scanner.extractPaper(processingCanvas, width, height, undefined, isSmallFormat);
      }

      if (extracted && extracted.width > 0) {
        const dataUrl = extracted.toDataURL('image/jpeg', 0.92);
        setPreviewDataUrl(dataUrl);
        setShowPreview(true);
      } else {
        // Fallback: raw capture
        const dataUrl = processingCanvas.toDataURL('image/jpeg', 0.92);
        setPreviewDataUrl(dataUrl);
        setShowPreview(true);
        
        if (!useFallbackMode) {
          toast({
            title: "Capture brute",
            description: "Document non détecté, image brute capturée.",
          });
        }
      }
    } catch (err) {
      const dataUrl = processingCanvas.toDataURL('image/jpeg', 0.92);
      setPreviewDataUrl(dataUrl);
      setShowPreview(true);
    } finally {
      setIsCapturing(false);
    }
  }, [toast, documentType, isSmallFormat, isCapturing, useFallbackMode]);

  // Manual capture without OpenCV
  const handleManualCapture = useCallback(() => {
    if (isCapturing) return;
    
    const processingCanvas = processingCanvasRef.current;
    const video = videoRef.current;
    if (!processingCanvas || !video) return;

    setIsCapturing(true);

    try {
      // Draw current frame
      const ctx = processingCanvas.getContext('2d');
      if (ctx && video.readyState >= 2) {
        processingCanvas.width = video.videoWidth;
        processingCanvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
      }
      
      const dataUrl = processingCanvas.toDataURL('image/jpeg', 0.92);
      setPreviewDataUrl(dataUrl);
      setShowPreview(true);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  // Validate captured document
  const handleValidate = useCallback(() => {
    if (!previewDataUrl) return;
    
    fetch(previewDataUrl)
      .then(res => res.blob())
      .then(blob => {
        stopCamera();
        onCapture(blob);
      })
      .catch(err => {
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
    setShowManualCapture(false);
    setHasDetectedDocument(false);
    
    if (scannerRef.current) {
      scannerRef.current.resetStabilizer();
    }
    
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
        <div className="flex items-center justify-between p-4 bg-black/80">
          <h2 className="text-white font-medium">Aperçu du document</h2>
          <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img
            src={previewDataUrl}
            alt="Document scanné"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

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
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {/* Native video stream - always visible */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onPlay={handleVideoPlay}
        />

        {/* Hidden processing canvas for OpenCV */}
        <canvas
          ref={processingCanvasRef}
          className="hidden"
        />

        {/* Transparent overlay canvas for green contours - explicit dimensions, no CSS scaling */}
        <canvas
          ref={overlayCanvasRef}
          width={containerDimensions.width || undefined}
          height={containerDimensions.height || undefined}
          className="absolute top-0 left-0 pointer-events-none z-10"
          style={{
            width: containerDimensions.width > 0 ? `${containerDimensions.width}px` : '100%',
            height: containerDimensions.height > 0 ? `${containerDimensions.height}px` : '100%'
          }}
        />

        {/* Legacy canvas for fallback capture */}
        <canvas
          ref={canvasRef}
          className="hidden"
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
            <div className={`w-2 h-2 rounded-full ${hasDetectedDocument ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            <span className="text-white text-sm">{statusMessage}</span>
          </div>
        )}

        {/* Static guide when no detection */}
        {showManualCapture && !hasDetectedDocument && isVideoPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="border-2 border-dashed border-white/50 rounded-lg" 
                 style={{ 
                   width: isSmallFormat ? '70%' : '80%', 
                   height: isSmallFormat ? '45%' : '60%',
                   maxWidth: '400px',
                   maxHeight: isSmallFormat ? '250px' : '500px'
                 }} 
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      {isVideoPlaying && !isLoading && (
        <div className="bg-black/80 px-4 py-2 text-center">
          <p className="text-white/80 text-sm">
            {hasDetectedDocument 
              ? 'Document détecté • Appuyez sur SCANNER' 
              : showManualCapture 
                ? 'Cadrez manuellement le document' 
                : 'Cadrez le document • Contours verts = détecté'
            }
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="p-4 bg-black/80 flex gap-3">
        {/* Manual capture button (shown when no detection) */}
        {showManualCapture && !hasDetectedDocument && (
          <Button
            type="button"
            onClick={handleManualCapture}
            disabled={!isVideoPlaying || isLoading}
            variant="outline"
            className="flex-1 h-14 text-base border-white/30 text-white hover:bg-white/10"
          >
            <CameraOff className="mr-2 h-5 w-5" />
            CAPTURER
          </Button>
        )}
        
        {/* Main scanner button */}
        <Button
          type="button"
          onClick={handleCapture}
          disabled={!isVideoPlaying || isLoading}
          className={`${showManualCapture && !hasDetectedDocument ? 'flex-1' : 'w-full'} h-14 text-xl bg-white text-black hover:bg-white/90 disabled:opacity-50`}
        >
          <Camera className="mr-3 h-6 w-6" />
          SCANNER
        </Button>
      </div>
    </div>
  );
};

export default SimpleDocumentScanner;
