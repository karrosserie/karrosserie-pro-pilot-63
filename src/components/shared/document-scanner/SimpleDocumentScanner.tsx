import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Declare OpenCV on window
declare global {
  interface Window {
    cv: any;
  }
}

interface SimpleDocumentScannerProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const SimpleDocumentScanner: React.FC<SimpleDocumentScannerProps> = ({
  onCapture,
  onClose
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Ref to track isVideoReady for timeout closure fix
  const isVideoReadyRef = useRef(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [showManualStart, setShowManualStart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    isVideoReadyRef.current = isVideoReady;
  }, [isVideoReady]);

  // Load OpenCV.js then jscanify
  useEffect(() => {
    console.log('[Scanner] Loading OpenCV.js...');
    
    const loadOpenCV = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.cv && window.cv.Mat) {
          console.log('[OpenCV] Already loaded');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
        script.async = true;

        script.onload = () => {
          console.log('[OpenCV] Script loaded, waiting for runtime...');
          
          // OpenCV needs time to initialize
          const checkCV = () => {
            if (window.cv && window.cv.Mat) {
              console.log('[OpenCV] Runtime ready');
              resolve();
            } else if (window.cv) {
              // cv exists but not fully initialized
              window.cv.onRuntimeInitialized = () => {
                console.log('[OpenCV] onRuntimeInitialized fired');
                resolve();
              };
            } else {
              // Retry check
              setTimeout(checkCV, 100);
            }
          };
          
          checkCV();
        };

        script.onerror = (err) => {
          console.error('[OpenCV] Failed to load script:', err);
          reject(err);
        };

        document.head.appendChild(script);
      });
    };

    loadOpenCV()
      .then(() => {
        console.log('[Scanner] OpenCV loaded, now loading jscanify...');
        return import('jscanify');
      })
      .then(module => {
        scannerRef.current = new module.default();
        setIsScannerReady(true);
        console.log('[Scanner] jscanify ready with OpenCV support');
      })
      .catch(err => {
        console.error('[Scanner] Failed to load dependencies:', err);
        setIsScannerReady(true); // Allow raw capture mode
      });
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    console.log('[Camera] Stopping...');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsVideoReady(false);
  }, []);

  // Start camera - simplified, relies on video events
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowManualStart(false);
      setIsVideoReady(false);

      console.log('[Camera] Requesting getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      console.log('[Camera] Stream obtained, active:', stream.active);

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('[Camera] srcObject assigned');
        
        // Try to play - don't await, let video events handle state
        videoRef.current.play().catch((playError) => {
          console.warn('[Camera] Autoplay blocked:', playError);
          setIsLoading(false);
          setShowManualStart(true);
        });
      }
    } catch (err) {
      console.error('[Camera] Error:', err);
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setIsLoading(false);
    }
  }, []);

  // Manual start for autoplay-blocked cases
  const handleManualStart = useCallback(async () => {
    console.log('[Manual] Button pressed');
    
    if (!videoRef.current) {
      console.error('[Manual] No video ref');
      return;
    }

    // Check if stream is still active
    if (!streamRef.current || !streamRef.current.active) {
      console.log('[Manual] Stream inactive, restarting camera');
      startCamera();
      return;
    }

    try {
      await videoRef.current.play();
      console.log('[Manual] Play succeeded');
      // onCanPlay event will handle the rest
    } catch (err) {
      console.error('[Manual] Play failed:', err);
      setError("Impossible de démarrer la caméra. Rechargez la page.");
      setShowManualStart(false);
    }
  }, [startCamera]);

  // Video event handlers
  const handleVideoCanPlay = useCallback(() => {
    console.log('[Video Event] canplay - video ready to play');
    setIsVideoReady(true);
    setIsLoading(false);
    setShowManualStart(false);
  }, []);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('[Video Event] error:', e);
    setError("Erreur vidéo. Vérifiez les permissions caméra.");
    setIsLoading(false);
  }, []);

  // Real-time detection loop
  useEffect(() => {
    if (!isVideoReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!video || !canvas || !displayCanvas) return;

    const ctx = canvas.getContext('2d');
    const displayCtx = displayCanvas.getContext('2d');

    if (!ctx || !displayCtx) return;

    console.log('[Loop] Starting detection loop, OpenCV available:', !!window.cv);

    const detectLoop = () => {
      if (!video.paused && !video.ended && video.readyState >= 2) {
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          displayCanvas.width = width;
          displayCanvas.height = height;

          ctx.drawImage(video, 0, 0, width, height);

          if (scannerRef.current && window.cv) {
            try {
              const highlighted = scannerRef.current.highlightPaper(canvas);
              displayCtx.drawImage(highlighted, 0, 0);
            } catch (e) {
              // Fallback to raw video
              displayCtx.drawImage(canvas, 0, 0);
            }
          } else {
            displayCtx.drawImage(canvas, 0, 0);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoReady]);

  // Initialize on mount - NO dependencies to prevent re-runs
  useEffect(() => {
    startCamera();
    
    // Safety timeout: use ref to check current value (fixes closure issue)
    const timeout = setTimeout(() => {
      if (!isVideoReadyRef.current && !showManualStart && !error) {
        console.log('[Timeout] Video not ready after 5s, showing manual start');
        setIsLoading(false);
        setShowManualStart(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Capture document
  const handleCapture = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      toast({
        title: "Erreur",
        description: "Caméra non prête, veuillez patienter",
        variant: "destructive"
      });
      return;
    }

    if (scannerRef.current && window.cv) {
      try {
        const resultCanvas = scannerRef.current.extractPaper(canvas, canvas.width, canvas.height);

        if (resultCanvas && resultCanvas.width > 0 && resultCanvas.height > 0) {
          resultCanvas.toBlob((blob: Blob | null) => {
            if (blob) {
              stopCamera();
              onCapture(blob);
            } else {
              captureRaw();
            }
          }, 'image/jpeg', 0.9);
          return;
        }
      } catch (err) {
        console.log('[Capture] extractPaper failed, using raw:', err);
      }
    }

    captureRaw();
  }, [onCapture, stopCamera, toast]);

  const captureRaw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        stopCamera();
        onCapture(blob);
      }
    }, 'image/jpeg', 0.9);
  }, [onCapture, stopCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <h2 className="text-white text-lg font-semibold">Scanner un document</h2>
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p>Initialisation de la caméra...</p>
            </div>
          </div>
        )}

        {showManualStart && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center">
              <p className="text-white mb-4">Appuyez pour démarrer la caméra</p>
              <Button 
                onClick={handleManualStart} 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200"
              >
                <Camera className="h-6 w-6 mr-2" />
                Démarrer la caméra
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black p-6">
            <div className="text-center text-white">
              <p className="mb-4">{error}</p>
              <Button onClick={startCamera} variant="outline" className="text-white border-white">
                <RotateCcw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Video element with event handlers */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
          onCanPlay={handleVideoCanPlay}
          onLoadedMetadata={() => console.log('[Video Event] loadedmetadata')}
          onPlay={() => console.log('[Video Event] play')}
          onError={handleVideoError}
        />

        {/* Hidden processing canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Display canvas */}
        <canvas
          ref={displayCanvasRef}
          className="w-full h-full object-contain"
          style={{ display: isVideoReady ? 'block' : 'none' }}
        />

        {/* Scanner loading indicator */}
        {isVideoReady && !isScannerReady && (
          <div className="absolute top-20 left-4 right-4 text-center">
            <p className="text-yellow-400 text-xs bg-black/50 rounded px-2 py-1 inline-block">
              Chargement de la détection...
            </p>
          </div>
        )}

        {/* Instructions */}
        {isVideoReady && (
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              Cadrez le document • Les contours verts indiquent la détection
            </p>
          </div>
        )}
      </div>

      {/* Capture button */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex justify-center">
          <Button
            onClick={handleCapture}
            disabled={!isVideoReady}
            size="lg"
            className="h-16 w-16 rounded-full bg-white hover:bg-gray-200 text-black"
          >
            <Camera className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};
