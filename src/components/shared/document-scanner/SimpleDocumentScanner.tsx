import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import cvModule from '@techstark/opencv-js';

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

// Initialize OpenCV according to official @techstark/opencv-js README pattern
const initializeOpenCV = async (): Promise<any> => {
  console.log('[OpenCV] Starting initialization...');
  console.log('[OpenCV] cvModule type:', typeof cvModule);
  console.log('[OpenCV] cvModule instanceof Promise:', cvModule instanceof Promise);
  
  // If already initialized on window
  if (window.cv && typeof window.cv.Mat === 'function') {
    console.log('[OpenCV] Already initialized on window.cv');
    return window.cv;
  }

  let cv: any;

  try {
    // Pattern from official README: handle both Promise and callback cases
    if (cvModule instanceof Promise) {
      // Case 1: Module is a Promise (common with Vite/Webpack bundlers)
      console.log('[OpenCV] Module is a Promise, awaiting...');
      cv = await cvModule;
      console.log('[OpenCV] Promise resolved');
    } else {
      // Case 2: Module needs onRuntimeInitialized callback
      console.log('[OpenCV] Checking if module is ready...');
      
      if (cvModule.Mat && typeof cvModule.Mat === 'function') {
        console.log('[OpenCV] Module already ready');
        cv = cvModule;
      } else {
        console.log('[OpenCV] Waiting for onRuntimeInitialized...');
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('OpenCV onRuntimeInitialized timeout (15s)'));
          }, 15000);
          
          cvModule.onRuntimeInitialized = () => {
            clearTimeout(timeout);
            console.log('[OpenCV] onRuntimeInitialized fired');
            resolve();
          };
        });
        cv = cvModule;
      }
    }

    // Final verification
    if (!cv || typeof cv.Mat !== 'function') {
      throw new Error('OpenCV loaded but cv.Mat is not a function');
    }

    // Assign to window BEFORE importing jscanify
    window.cv = cv;
    console.log('[OpenCV] ✓ Assigned to window.cv');
    console.log('[OpenCV] cv.Mat:', typeof cv.Mat);
    console.log('[OpenCV] cv.imread:', typeof cv.imread);
    
    return cv;
  } catch (error) {
    console.error('[OpenCV] Initialization FAILED:', error);
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

        // STEP 2: Import BROWSER version of jscanify
        // CRITICAL: jscanify/src/jscanify.js uses global cv (window.cv)
        // jscanify (default) = jscanify-node.js which does NOT work in browser
        console.log('[Scanner] Step 2: Importing jscanify browser version...');
        const jscanifyModule = await import('jscanify/src/jscanify.js');
        if (!mounted) return;
        
        const JscanifyClass = jscanifyModule.default || jscanifyModule;
        console.log('[Scanner] Step 2: ✓ jscanify loaded:', typeof JscanifyClass);

        // STEP 3: Create scanner instance
        const scanner = new JscanifyClass();
        scannerRef.current = scanner;
        console.log('[Scanner] Step 3: ✓ Scanner instance created');
        console.log('[Scanner] Methods:', {
          highlightPaper: typeof scanner.highlightPaper,
          extractPaper: typeof scanner.extractPaper
        });

        // STEP 4: Test cv.imread to confirm everything works
        console.log('[Scanner] Step 4: Testing cv.imread...');
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
        console.log('[Scanner] Step 4: ✓ cv.imread works:', testMat.rows, 'x', testMat.cols);
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
