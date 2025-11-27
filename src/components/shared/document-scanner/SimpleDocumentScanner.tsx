import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
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

// Core OpenCV functions used by jscanify (simplified list)
const REQUIRED_CV_FUNCTIONS = [
  'Mat', 'MatVector', 'Size',
  'imread', 'imshow',
  'Canny', 'GaussianBlur', 'threshold', 
  'findContours', 'contourArea', 'minAreaRect',
  'BORDER_DEFAULT', 'THRESH_OTSU', 'RETR_CCOMP', 'CHAIN_APPROX_SIMPLE'
];

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
  
  const isVideoReadyRef = useRef(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [showManualStart, setShowManualStart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerStatus, setScannerStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    isVideoReadyRef.current = isVideoReady;
  }, [isVideoReady]);

  // Check if critical OpenCV functions are available
  const checkCVFunctions = useCallback((): boolean => {
    if (!window.cv) {
      console.log('[OpenCV] window.cv not available yet');
      return false;
    }

    // Check core functions that jscanify needs
    const criticalFns = ['Mat', 'imread', 'findContours', 'Canny'];
    for (const fn of criticalFns) {
      if (window.cv[fn] === undefined) {
        console.log('[OpenCV] Missing critical function:', fn);
        return false;
      }
    }

    console.log('[OpenCV] ✓ Critical functions available');
    return true;
  }, []);

  // Test jscanify by checking cv.imread works (no synthetic document test)
  const testJscanify = useCallback((scanner: any): boolean => {
    console.log('[Scanner] Testing jscanify functionality...');
    
    try {
      // Check jscanify methods exist
      if (typeof scanner.highlightPaper !== 'function') {
        console.error('[Scanner] ✗ highlightPaper is not a function');
        return false;
      }
      if (typeof scanner.extractPaper !== 'function') {
        console.error('[Scanner] ✗ extractPaper is not a function');
        return false;
      }
      console.log('[Scanner] ✓ jscanify methods available');

      // Test cv.imread works with a minimal canvas
      const testCanvas = document.createElement('canvas');
      testCanvas.width = 10;
      testCanvas.height = 10;
      const testCtx = testCanvas.getContext('2d');
      if (testCtx) {
        testCtx.fillStyle = 'black';
        testCtx.fillRect(0, 0, 10, 10);
      }

      const mat = window.cv.imread(testCanvas);
      if (mat && mat.rows > 0) {
        console.log('[Scanner] ✓ cv.imread test passed:', mat.rows, 'x', mat.cols);
        mat.delete(); // Clean up
        return true;
      } else {
        console.error('[Scanner] ✗ cv.imread returned invalid mat');
        return false;
      }
    } catch (testError) {
      console.error('[Scanner] ✗ Test failed with exception:', testError);
      return false;
    }
  }, []);

  // Load OpenCV.js then jscanify with improved loading
  useEffect(() => {
    console.log('[Scanner] Starting dependency loading...');
    setScannerStatus('loading');
    
    const loadOpenCV = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded and ready
        if (window.cv && window.cv.Mat && checkCVFunctions()) {
          console.log('[OpenCV] Already loaded and ready');
          resolve();
          return;
        }

        // Load script if not present
        if (!document.querySelector('script[src*="opencv.js"]')) {
          console.log('[OpenCV] Loading script from CDN...');
          const script = document.createElement('script');
          script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
          script.async = true;
          script.onerror = () => {
            console.error('[OpenCV] Script load error');
            reject(new Error('Failed to load OpenCV script'));
          };
          document.head.appendChild(script);
        } else {
          console.log('[OpenCV] Script already in DOM');
        }

        let attempts = 0;
        const maxAttempts = 150; // 15 seconds max
        
        const checkReady = () => {
          attempts++;
          
          // Check if cv is ready with Mat function
          if (window.cv && window.cv.Mat && window.cv.imread) {
            console.log('[OpenCV] ✓ Ready after', attempts, 'attempts');
            resolve();
            return;
          }
          
          // Handle OpenCV promise-based initialization (OpenCV 4.x)
          if (window.cv && typeof window.cv.then === 'function') {
            console.log('[OpenCV] Waiting via Promise...');
            window.cv.then(() => {
              console.log('[OpenCV] ✓ Ready via Promise');
              resolve();
            }).catch((e: Error) => {
              console.error('[OpenCV] Promise rejected:', e);
              reject(e);
            });
            return;
          }
          
          // Handle onRuntimeInitialized callback
          if (window.cv && !window.cv.Mat && window.cv.onRuntimeInitialized === undefined) {
            // cv exists but not fully initialized - set callback
            console.log('[OpenCV] Setting onRuntimeInitialized callback...');
            window.cv.onRuntimeInitialized = () => {
              console.log('[OpenCV] ✓ Runtime initialized via callback');
              resolve();
            };
            return;
          }
          
          if (attempts < maxAttempts) {
            setTimeout(checkReady, 100);
          } else {
            console.error('[OpenCV] Timeout after', maxAttempts * 100, 'ms');
            reject(new Error('OpenCV load timeout'));
          }
        };

        checkReady();
      });
    };

    loadOpenCV()
      .then(() => {
        console.log('[Scanner] OpenCV loaded, importing jscanify...');
        return import('jscanify');
      })
      .then(module => {
        console.log('[Scanner] jscanify module loaded:', module);
        console.log('[Scanner] jscanify default export:', module.default);
        
        const scanner = new module.default();
        scannerRef.current = scanner;
        
        console.log('[Scanner] jscanify instance:', scanner);
        console.log('[Scanner] Available methods:', Object.keys(scanner));
        console.log('[Scanner] highlightPaper:', typeof scanner.highlightPaper);
        console.log('[Scanner] extractPaper:', typeof scanner.extractPaper);

        // Test jscanify immediately
        const testPassed = testJscanify(scanner);
        
        if (testPassed) {
          setScannerStatus('ready');
          console.log('[Scanner] ✓ Scanner fully operational');
        } else {
          setScannerStatus('error');
          console.warn('[Scanner] ✗ Scanner test failed - contours may not work');
        }
        
        setIsScannerReady(true);
      })
      .catch(err => {
        console.error('[Scanner] Failed to load dependencies:', err);
        setScannerStatus('error');
        setIsScannerReady(true); // Allow raw capture mode
      });
  }, [checkCVFunctions, testJscanify]);

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

  // Start camera
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
      console.log('[Camera] Stream obtained');

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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

  const handleManualStart = useCallback(async () => {
    if (!videoRef.current) return;

    if (!streamRef.current || !streamRef.current.active) {
      startCamera();
      return;
    }

    try {
      await videoRef.current.play();
    } catch (err) {
      console.error('[Manual] Play failed:', err);
      setError("Impossible de démarrer la caméra. Rechargez la page.");
      setShowManualStart(false);
    }
  }, [startCamera]);

  const handleVideoCanPlay = useCallback(() => {
    console.log('[Video] canplay event');
    setIsVideoReady(true);
    setIsLoading(false);
    setShowManualStart(false);
  }, []);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('[Video] error:', e);
    setError("Erreur vidéo. Vérifiez les permissions caméra.");
    setIsLoading(false);
  }, []);

  // Real-time detection loop - ALWAYS LOG ERRORS
  useEffect(() => {
    if (!isVideoReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!video || !canvas || !displayCanvas) return;

    const ctx = canvas.getContext('2d');
    const displayCtx = displayCanvas.getContext('2d');

    if (!ctx || !displayCtx) return;

    console.log('[Loop] Starting detection loop');
    console.log('[Loop] Scanner ref:', !!scannerRef.current);
    console.log('[Loop] window.cv:', !!window.cv);
    console.log('[Loop] Scanner status:', scannerStatus);

    let frameCount = 0;
    
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

          // Try to use jscanify for contour detection
          if (scannerRef.current && window.cv) {
            try {
              const highlighted = scannerRef.current.highlightPaper(canvas, {
                color: 'lime',
                thickness: 8
              });

              if (highlighted && highlighted.width > 0) {
                displayCtx.drawImage(highlighted, 0, 0);
                
                // Log success occasionally
                if (frameCount % 120 === 0) {
                  console.log('[Loop] ✓ Frame', frameCount, '- Contours rendered');
                }
              } else {
                // No document detected - just show raw video
                displayCtx.drawImage(canvas, 0, 0);
                
                if (frameCount % 120 === 0) {
                  console.log('[Loop] Frame', frameCount, '- No document detected');
                }
              }
            } catch (e) {
              // ALWAYS LOG ERRORS - no throttling!
              console.error('[Loop] highlightPaper ERROR at frame', frameCount, ':', e);
              displayCtx.drawImage(canvas, 0, 0);
            }
          } else {
            // Scanner not ready - show raw video
            displayCtx.drawImage(canvas, 0, 0);
            
            if (frameCount % 180 === 0) {
              console.log('[Loop] Frame', frameCount, '- Scanner not ready. scanner:', !!scannerRef.current, 'cv:', !!window.cv);
            }
          }
        }
      }

      frameCount++;
      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoReady, scannerStatus]);

  // Initialize on mount
  useEffect(() => {
    startCamera();
    
    const timeout = setTimeout(() => {
      if (!isVideoReadyRef.current && !showManualStart && !error) {
        console.log('[Timeout] Video not ready after 5s');
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

    if (!canvas || canvas.width === 0) {
      toast({
        title: "Erreur",
        description: "Caméra non prête",
        variant: "destructive"
      });
      return;
    }

    if (scannerRef.current && window.cv) {
      try {
        const resultCanvas = scannerRef.current.extractPaper(canvas, canvas.width, canvas.height);

        if (resultCanvas && resultCanvas.width > 0) {
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
        console.log('[Capture] extractPaper failed:', err);
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

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
        />

        <canvas ref={canvasRef} className="hidden" />

        <canvas
          ref={displayCanvasRef}
          className="w-full h-full object-contain"
          style={{ display: isVideoReady ? 'block' : 'none' }}
        />

        {/* Scanner status indicator */}
        {isVideoReady && (
          <div className="absolute top-4 left-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              scannerStatus === 'ready' 
                ? 'bg-green-500/80 text-white' 
                : scannerStatus === 'error'
                ? 'bg-red-500/80 text-white'
                : 'bg-yellow-500/80 text-black'
            }`}>
              {scannerStatus === 'ready' ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Détection active
                </>
              ) : scannerStatus === 'error' ? (
                <>
                  <XCircle className="h-3 w-3" />
                  Mode simple (OpenCV non dispo)
                </>
              ) : (
                <>
                  <div className="animate-spin h-3 w-3 border border-black border-t-transparent rounded-full" />
                  Chargement OpenCV...
                </>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {isVideoReady && (
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              {scannerStatus === 'ready' 
                ? 'Cadrez le document • Les contours verts indiquent la détection'
                : 'Cadrez le document • Capturez quand prêt'
              }
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
