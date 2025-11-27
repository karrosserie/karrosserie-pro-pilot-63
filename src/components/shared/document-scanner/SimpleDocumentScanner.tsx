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

// ALL OpenCV functions required by jscanify
const REQUIRED_CV_FUNCTIONS = [
  'Mat', 'MatVector', 'Size', 'Scalar',
  'imread', 'imshow',
  'cvtColor', 'GaussianBlur', 'Canny', 'threshold', 'dilate',
  'findContours', 'contourArea', 'arcLength', 'approxPolyDP', 'minAreaRect', 'boxPoints',
  'getPerspectiveTransform', 'warpPerspective',
  'COLOR_RGBA2GRAY', 'THRESH_BINARY', 'THRESH_OTSU',
  'RETR_CCOMP', 'CHAIN_APPROX_SIMPLE',
  'CV_32FC2', 'INTER_LINEAR', 'BORDER_CONSTANT'
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

  // Check if ALL required OpenCV functions are available
  const checkAllCVFunctions = useCallback((): { allReady: boolean; missing: string[] } => {
    const missing: string[] = [];
    
    if (!window.cv) {
      console.error('[OpenCV] window.cv is not available');
      return { allReady: false, missing: ['cv (global object)'] };
    }

    for (const fn of REQUIRED_CV_FUNCTIONS) {
      if (window.cv[fn] === undefined) {
        missing.push(fn);
      }
    }

    if (missing.length > 0) {
      console.warn('[OpenCV] Missing functions:', missing.join(', '));
    } else {
      console.log('[OpenCV] All', REQUIRED_CV_FUNCTIONS.length, 'required functions are available');
    }

    return { allReady: missing.length === 0, missing };
  }, []);

  // Test jscanify with a simple test canvas
  const testJscanify = useCallback((scanner: any): boolean => {
    console.log('[Scanner] Testing jscanify with test canvas...');
    
    try {
      // Create a test canvas with a simple rectangle (simulating a document)
      const testCanvas = document.createElement('canvas');
      testCanvas.width = 200;
      testCanvas.height = 200;
      const testCtx = testCanvas.getContext('2d');
      
      if (!testCtx) {
        console.error('[Scanner] Could not get test canvas context');
        return false;
      }

      // Draw white background
      testCtx.fillStyle = 'white';
      testCtx.fillRect(0, 0, 200, 200);
      
      // Draw a black rectangle (simulating document edges)
      testCtx.strokeStyle = 'black';
      testCtx.lineWidth = 5;
      testCtx.strokeRect(30, 30, 140, 140);

      // Try highlightPaper
      console.log('[Scanner] Calling highlightPaper on test canvas...');
      const result = scanner.highlightPaper(testCanvas, {
        color: 'lime',
        thickness: 4
      });

      if (result && result.width > 0) {
        console.log('[Scanner] ✓ highlightPaper TEST PASSED - returned canvas:', result.width, 'x', result.height);
        return true;
      } else {
        console.warn('[Scanner] ✗ highlightPaper TEST FAILED - returned:', result);
        return false;
      }
    } catch (testError) {
      console.error('[Scanner] ✗ highlightPaper TEST EXCEPTION:', testError);
      return false;
    }
  }, []);

  // Load OpenCV.js then jscanify with comprehensive checks
  useEffect(() => {
    console.log('[Scanner] Starting dependency loading...');
    setScannerStatus('loading');
    
    const loadOpenCV = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded with all functions
        const { allReady } = checkAllCVFunctions();
        if (allReady) {
          console.log('[OpenCV] Already fully loaded');
          resolve();
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="opencv.js"]');
        if (existingScript) {
          console.log('[OpenCV] Script tag exists, waiting for functions...');
        } else {
          console.log('[OpenCV] Loading script from CDN...');
          const script = document.createElement('script');
          script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
          script.async = true;
          script.onerror = (err) => {
            console.error('[OpenCV] Script load error:', err);
            reject(new Error('Failed to load OpenCV script'));
          };
          document.head.appendChild(script);
        }

        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max

        const waitForCV = () => {
          attempts++;

          if (window.cv) {
            // Check if runtime is initialized
            if (typeof window.cv.onRuntimeInitialized === 'function') {
              // Not yet initialized
              console.log('[OpenCV] Waiting for onRuntimeInitialized...');
              const originalCallback = window.cv.onRuntimeInitialized;
              window.cv.onRuntimeInitialized = () => {
                if (originalCallback) originalCallback();
                console.log('[OpenCV] Runtime initialized callback fired');
                setTimeout(() => {
                  const { allReady, missing } = checkAllCVFunctions();
                  if (allReady) {
                    resolve();
                  } else {
                    console.warn('[OpenCV] Still missing after init:', missing);
                    // Continue anyway, some functions might work
                    resolve();
                  }
                }, 500);
              };
            } else {
              // Check functions directly
              const { allReady, missing } = checkAllCVFunctions();
              if (allReady) {
                resolve();
              } else if (attempts < maxAttempts) {
                console.log('[OpenCV] Attempt', attempts, '- waiting for functions. Missing:', missing.length);
                setTimeout(waitForCV, 100);
              } else {
                console.warn('[OpenCV] Timeout - proceeding with available functions');
                resolve();
              }
            }
          } else if (attempts < maxAttempts) {
            setTimeout(waitForCV, 100);
          } else {
            reject(new Error('OpenCV load timeout - cv object never appeared'));
          }
        };

        waitForCV();
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
  }, [checkAllCVFunctions, testJscanify]);

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
                  Scanner OK
                </>
              ) : scannerStatus === 'error' ? (
                <>
                  <XCircle className="h-3 w-3" />
                  Mode simple
                </>
              ) : (
                <>
                  <div className="animate-spin h-3 w-3 border border-black border-t-transparent rounded-full" />
                  Chargement...
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
