import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import cvModule from '@techstark/opencv-js';
import { Jscanify } from '@/lib/jscanify';
// Declare OpenCV on window for jscanify compatibility
declare global {
  interface Window {
    cv: any;
  }
}

interface SimpleDocumentScannerProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

// Initialize OpenCV with robust polling fallback and multi-scope assignment
const initializeOpenCV = async (): Promise<any> => {
  console.log('[OpenCV] ========== INIT START ==========');
  console.log('[OpenCV] cvModule:', cvModule);
  console.log('[OpenCV] typeof cvModule:', typeof cvModule);
  console.log('[OpenCV] cvModule instanceof Promise:', cvModule instanceof Promise);
  console.log('[OpenCV] cvModule.Mat:', (cvModule as any)?.Mat);
  console.log('[OpenCV] cvModule.onRuntimeInitialized:', (cvModule as any)?.onRuntimeInitialized);
  
  // Check if already initialized on window
  if (window.cv && typeof window.cv.Mat === 'function') {
    console.log('[OpenCV] Already initialized on window.cv');
    return window.cv;
  }

  let cv: any;

  try {
    // CASE 1: Module is a Promise
    if (cvModule instanceof Promise) {
      console.log('[OpenCV] Case 1: Module is Promise, awaiting...');
      cv = await cvModule;
      console.log('[OpenCV] Promise resolved, cv:', cv);
      console.log('[OpenCV] cv.Mat after resolve:', typeof cv?.Mat);
    }
    // CASE 2: Module is already ready (has Mat function)
    else if (cvModule && typeof (cvModule as any).Mat === 'function') {
      console.log('[OpenCV] Case 2: Module already ready');
      cv = cvModule;
    }
    // CASE 3: Module needs onRuntimeInitialized - with polling fallback
    else {
      console.log('[OpenCV] Case 3: Waiting for runtime initialization...');
      
      cv = await new Promise<any>((resolve, reject) => {
        const startTime = Date.now();
        const timeout = 10000; // 10 seconds max
        
        // Polling check every 100ms as fallback
        const pollInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          
          if (cvModule && typeof (cvModule as any).Mat === 'function') {
            console.log('[OpenCV] Polling: Mat became available after', elapsed, 'ms');
            clearInterval(pollInterval);
            resolve(cvModule);
          } else if (elapsed > timeout) {
            console.error('[OpenCV] Polling timeout after', timeout, 'ms');
            clearInterval(pollInterval);
            reject(new Error(`OpenCV timeout after ${timeout}ms`));
          } else if (elapsed % 1000 < 100) {
            console.log('[OpenCV] Polling...', elapsed, 'ms elapsed');
          }
        }, 100);
        
        // Also listen for onRuntimeInitialized callback
        if (cvModule && typeof (cvModule as any).onRuntimeInitialized !== 'undefined') {
          const originalCallback = (cvModule as any).onRuntimeInitialized;
          (cvModule as any).onRuntimeInitialized = () => {
            console.log('[OpenCV] onRuntimeInitialized fired!');
            clearInterval(pollInterval);
            if (originalCallback && typeof originalCallback === 'function') {
              originalCallback();
            }
            resolve(cvModule);
          };
        }
      });
    }

    // Final verification
    if (!cv || typeof cv.Mat !== 'function') {
      console.error('[OpenCV] FAILED: cv.Mat is not a function after init');
      console.error('[OpenCV] cv:', cv);
      console.error('[OpenCV] cv.Mat:', cv?.Mat);
      throw new Error('OpenCV loaded but cv.Mat is not available');
    }

    // Assign to ALL global scopes for maximum compatibility with jscanify
    window.cv = cv;
    if (typeof globalThis !== 'undefined') (globalThis as any).cv = cv;
    if (typeof self !== 'undefined') (self as any).cv = cv;
    
    console.log('[OpenCV] ========== INIT SUCCESS ==========');
    console.log('[OpenCV] cv.Mat:', typeof cv.Mat);
    console.log('[OpenCV] cv.imread:', typeof cv.imread);
    console.log('[OpenCV] cv.Canny:', typeof cv.Canny);
    console.log('[OpenCV] cv.findContours:', typeof cv.findContours);
    console.log('[OpenCV] window.cv === cv:', window.cv === cv);
    
    return cv;
  } catch (error) {
    console.error('[OpenCV] ========== INIT FAILED ==========');
    console.error('[OpenCV] Error:', error);
    throw error;
  }
};

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

  // Load OpenCV then jscanify (browser version)
  useEffect(() => {
    let mounted = true;

    const initScanner = async () => {
      console.log('[Scanner] ========== INITIALIZATION START ==========');
      setScannerStatus('loading');

      try {
        // STEP 1: Initialize OpenCV (MUST be done BEFORE jscanify)
        console.log('[Scanner] Step 1: Initializing OpenCV...');
        await initializeOpenCV();
        if (!mounted) return;
        console.log('[Scanner] Step 1: ✓ OpenCV ready');

        // STEP 2: Create scanner instance using our ES module
        console.log('[Scanner] Step 2: Creating Jscanify instance...');
        const scanner = new Jscanify();
        scannerRef.current = scanner;
        if (!mounted) return;
        console.log('[Scanner] Step 2: ✓ Scanner instance created');
        console.log('[Scanner] Methods:', {
          highlightPaper: typeof scanner.highlightPaper,
          extractPaper: typeof scanner.extractPaper
        });

        // STEP 3: Test cv.imread to confirm everything works
        console.log('[Scanner] Step 3: Testing cv.imread...');
        const testCanvas = document.createElement('canvas');
        testCanvas.width = 10;
        testCanvas.height = 10;
        const testCtx = testCanvas.getContext('2d');
        if (testCtx) {
          testCtx.fillStyle = '#000000';
          testCtx.fillRect(0, 0, 10, 10);
        }
        
        const testMat = window.cv.imread(testCanvas);
        if (!testMat || testMat.rows === 0) {
          throw new Error('cv.imread test failed - returned empty mat');
        }
        console.log('[Scanner] Step 3: ✓ cv.imread works:', testMat.rows, 'x', testMat.cols);
        testMat.delete();

        if (!mounted) return;

        // SUCCESS
        setScannerStatus('ready');
        setIsScannerReady(true);
        console.log('[Scanner] ========== INITIALIZATION SUCCESS ==========');

      } catch (err) {
        console.error('[Scanner] ========== INITIALIZATION FAILED ==========');
        console.error('[Scanner] Error:', err);
        if (!mounted) return;
        setScannerStatus('error');
        setIsScannerReady(true); // Allow raw capture mode
      }
    };

    initScanner();

    return () => {
      mounted = false;
    };
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

    console.log('[Loop] Starting detection loop');
    console.log('[Loop] Scanner ref:', !!scannerRef.current);
    console.log('[Loop] window.cv:', !!window.cv);
    console.log('[Loop] cv.imread:', window.cv ? typeof window.cv.imread : 'N/A');
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
          if (scannerRef.current && window.cv && typeof window.cv.imread === 'function') {
            try {
              const highlighted = scannerRef.current.highlightPaper(canvas, {
                color: 'lime',
                thickness: 8
              });

              if (highlighted && highlighted.width > 0) {
                displayCtx.drawImage(highlighted, 0, 0);
                
                if (frameCount % 120 === 0) {
                  console.log('[Loop] ✓ Frame', frameCount, '- Contours rendered');
                }
              } else {
                displayCtx.drawImage(canvas, 0, 0);
                
                if (frameCount % 120 === 0) {
                  console.log('[Loop] Frame', frameCount, '- No document detected');
                }
              }
            } catch (e) {
              console.error('[Loop] highlightPaper ERROR at frame', frameCount, ':', e);
              displayCtx.drawImage(canvas, 0, 0);
            }
          } else {
            displayCtx.drawImage(canvas, 0, 0);
            
            if (frameCount % 180 === 0) {
              console.log('[Loop] Frame', frameCount, '- Scanner not ready:',
                'scanner:', !!scannerRef.current,
                'cv:', !!window.cv,
                'imread:', window.cv ? typeof window.cv.imread : 'N/A'
              );
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

    if (scannerRef.current && window.cv && typeof window.cv.imread === 'function') {
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
          className="absolute overflow-hidden pointer-events-none"
          style={{ 
            width: '1px',
            height: '1px',
            opacity: 0,
            zIndex: -1
          }}
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
                  Mode simple
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
          <div className="absolute bottom-32 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
              {scannerStatus === 'ready' 
                ? "Cadrez le document - contours verts = détecté"
                : "Cadrez le document et appuyez sur le bouton"
              }
            </p>
          </div>
        )}
      </div>

      {/* Capture button */}
      <div className="p-6 flex justify-center bg-black/50 backdrop-blur-sm">
        <Button
          onClick={handleCapture}
          size="lg"
          className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 text-black"
          disabled={!isVideoReady}
        >
          <Camera className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};
