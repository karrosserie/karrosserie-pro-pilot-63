
import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useDocumentScanner } from './hooks/useDocumentScanner';
import { ScannerOverlay } from './ScannerOverlay';
import { useToast } from '@/hooks/use-toast';

interface DocumentScannerProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onCapture,
  onClose
}) => {
  const { toast } = useToast();
  const {
    status,
    error,
    videoRef,
    canvasRef,
    detectedCorners,
    startCamera,
    stopCamera,
    detectDocument,
    extractDocument
  } = useDocumentScanner();

  const [isDetected, setIsDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showManualPlayButton, setShowManualPlayButton] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const isVideoPlayingRef = useRef(false);
  const isCameraInitialized = useRef(false);

  // Sync ref with state
  useLayoutEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  // Start camera IMMEDIATELY when component mounts (independent of OpenCV)
  const initializeCamera = useCallback(async () => {
    if (isCameraInitialized.current) {
      console.log('[Camera] Already initialized, skipping');
      return;
    }

    console.log('[Camera] Initializing...');
    setIsLoading(true);
    setShowManualPlayButton(false);
    
    // Retry mechanism if videoRef not ready
    const attemptStart = async (attempts = 0): Promise<void> => {
      if (attempts > 10) {
        console.error('[Camera] Failed after 10 attempts');
        setCameraError(true);
        setIsLoading(false);
        return;
      }
      
      if (!videoRef.current) {
        console.log(`[Camera] VideoRef not ready, retrying... (${attempts + 1})`);
        await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
        return attemptStart(attempts + 1);
      }
      
      try {
        isCameraInitialized.current = true;
        await startCamera();
        console.log('[Camera] ✓ Started');
        
        // Set timeout to check if video actually plays (1.5s pour détecter autoplay bloqué)
        retryTimeoutRef.current = setTimeout(() => {
          console.log('[Camera] Timeout check - isVideoPlaying:', isVideoPlayingRef.current);
          if (!isVideoPlayingRef.current) {
            console.warn('[Camera] No video playing after 1.5s - showing manual play button');
            setShowManualPlayButton(true);
          }
        }, 1500);
      } catch (err) {
        console.error('[Camera] Start error:', err);
        setCameraError(true);
        setIsLoading(false);
      }
    };
    
    await attemptStart();
  }, [startCamera]);

  useLayoutEffect(() => {
    console.log('[Scanner] useLayoutEffect running');
    initializeCamera();
    
    // Fallback mode if OpenCV doesn't load within 5 seconds
    const fallbackTimeout = setTimeout(() => {
      if (status === 'loading') {
        console.log('[OpenCV] Timeout, activating fallback mode');
        setFallbackMode(true);
      }
    }, 5000);

    return () => {
      console.log('[Scanner] useLayoutEffect cleanup');
      clearTimeout(fallbackTimeout);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopCamera();
      isCameraInitialized.current = false;
    };
  }, [initializeCamera, stopCamera, status]);

  // Video event handlers
  const handleVideoMetadata = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      console.log('[Video] Metadata loaded:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
      setVideoWidth(videoRef.current.videoWidth);
      setVideoHeight(videoRef.current.videoHeight);
    }
  };

  const handleVideoPlay = () => {
    console.log('[Video] ✓ onPlay event fired');
    setIsVideoPlaying(true);
    setIsLoading(false);
    setShowManualPlayButton(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  };

  const handleVideoLoadedData = () => {
    console.log('[Video] ✓ onLoadedData - Video has data (readyState:', videoRef.current?.readyState, ')');
    // Ne PAS setter isVideoPlaying ici - attendre onPlay ou onTimeUpdate
    // qui confirment que la vidéo joue vraiment
  };

  const handleVideoTimeUpdate = () => {
    // Vérifier que la vidéo joue vraiment (currentTime > 0 ET pas en pause)
    if (!isVideoPlayingRef.current && videoRef.current && 
        videoRef.current.currentTime > 0 && !videoRef.current.paused) {
      console.log('[Video] ✓ onTimeUpdate - Video actually playing (currentTime:', videoRef.current.currentTime, ')');
      setIsVideoPlaying(true);
      setIsLoading(false);
      setShowManualPlayButton(false);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    }
  };

  const handleVideoCanPlay = () => {
    console.log('[Video] Can play');
  };

  const handleManualPlayClick = async () => {
    console.log('[Video] Manual play button clicked');
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        console.log('[Video] ✓ Manual play successful');
        setIsVideoPlaying(true);
        setIsLoading(false);
        setShowManualPlayButton(false);
      } catch (err) {
        console.error('[Video] Manual play failed:', err);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la vidéo",
          variant: "destructive"
        });
      }
    }
  };

  // Detection loop (only if OpenCV is ready)
  useLayoutEffect(() => {
    if (status !== 'searching' && status !== 'found') {
      return;
    }

    if (fallbackMode) {
      return;
    }

    const detectLoop = () => {
      detectDocument();
      
      // Update video dimensions
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        setVideoWidth(videoRef.current.videoWidth);
        setVideoHeight(videoRef.current.videoHeight);
      }
      
      // Check if document corners are detected
      setIsDetected(!!detectedCorners);

      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, detectDocument, detectedCorners, fallbackMode]);

  const handleCapture = async () => {
    setIsCapturing(true);

    try {
      // Fallback mode: simple photo capture
      if (fallbackMode) {
        console.log('[Capture] Fallback mode');
        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                stopCamera();
                onCapture(blob);
                toast({
                  title: "Photo capturée",
                  description: "La photo a été prise avec succès"
                });
              }
            }, 'image/jpeg', 0.95);
            return;
          }
        }
      }

      const blob = await extractDocument();
      
      if (blob) {
        stopCamera();
        onCapture(blob);
        toast({
          title: "Document scanné",
          description: "Le document a été scanné avec succès"
        });
      } else {
        throw new Error('Extraction failed');
      }
    } catch (err) {
      console.error('[Capture] Error:', err);
      toast({
        title: "Erreur",
        description: "Impossible de scanner le document",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Camera error state with retry
  if (cameraError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-white text-lg mb-2">
            Impossible d'accéder à la caméra
          </p>
          <p className="text-white/70 text-sm mb-6">
            Vérifiez les permissions de la caméra dans les paramètres de votre navigateur
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => {
                setCameraError(false);
                initializeCamera();
              }} 
              variant="outline"
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </Button>
            <Button onClick={handleClose} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generic error state
  if (status === 'error' || error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center p-6">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-white text-lg mb-4">
            {error || 'Erreur lors de l\'initialisation'}
          </p>
          <Button onClick={handleClose} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video feed - toujours visible */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        // @ts-ignore - iOS Safari specific attributes
        webkit-playsinline="true"
        x5-playsinline="true"
        onLoadedMetadata={handleVideoMetadata}
        onCanPlay={handleVideoCanPlay}
        onPlay={handleVideoPlay}
        onLoadedData={handleVideoLoadedData}
        onTimeUpdate={handleVideoTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Loading indicator - semi-transparent pour laisser voir la vidéo */}
      {isLoading && !isVideoPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 rounded-lg p-6 text-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-sm">Démarrage...</p>
          </div>
        </div>
      )}

      {/* Manual play button if autoplay is blocked - sans fond opaque */}
      {showManualPlayButton && !isVideoPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/70 rounded-xl p-6 text-center">
            <Camera className="w-12 h-12 mx-auto mb-3 text-white" />
            <p className="text-white text-base mb-4">Appuyez pour démarrer</p>
            <Button 
              onClick={handleManualPlayClick}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="h-5 w-5 mr-2" />
              Démarrer
            </Button>
          </div>
        </div>
      )}

      {/* Hidden canvas for detection */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <ScannerOverlay 
        isDetected={isDetected} 
        status={status}
        detectedCorners={detectedCorners}
        videoWidth={videoWidth}
        videoHeight={videoHeight}
        isVideoPlaying={isVideoPlaying}
      />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleClose}
            variant="outline"
            size="lg"
            className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30"
          >
            <X className="h-5 w-5 mr-2" />
            Annuler
          </Button>

          <Button
            onClick={handleCapture}
            disabled={(!isDetected && !fallbackMode) || isCapturing}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Camera className="h-5 w-5 mr-2" />
            Capturer
          </Button>
        </div>

        {/* Status message */}
        <div className="text-center mt-4">
          <p className="text-white text-sm bg-black/70 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
            {!fallbackMode && status === 'searching' && 'Recherche automatique...'}
            {!fallbackMode && status === 'found' && '✓ Document détecté'}
            {!fallbackMode && isDetected && '✓ Document détecté'}
            {fallbackMode && 'Mode photo - Cadrez et capturez'}
          </p>
        </div>
      </div>
    </div>
  );
};
