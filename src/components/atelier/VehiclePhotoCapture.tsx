import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, Check, Loader2 } from 'lucide-react';

interface VehiclePhotoCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

const VehiclePhotoCapture: React.FC<VehiclePhotoCaptureProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Trigger refocus
  const triggerRefocus = useCallback(async () => {
    if (!streamRef.current) return;
    
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { focusMode?: string[] };
      if (!capabilities?.focusMode?.includes('single-shot')) {
        return;
      }

      await track.applyConstraints({
        advanced: [{ focusMode: 'single-shot' } as any]
      });

      setTimeout(async () => {
        try {
          if (capabilities.focusMode?.includes('continuous')) {
            await track.applyConstraints({
              advanced: [{ focusMode: 'continuous' } as any]
            });
          }
        } catch (e) {
          // Ignore
        }
      }, 500);
    } catch (err) {
      // Ignore refocus errors
    }
  }, []);

  // Handle tap-to-refocus
  const handleTapToFocus = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVideoReady || isCapturing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFocusPoint({ x, y });
    setTimeout(() => setFocusPoint(null), 800);

    triggerRefocus();
  }, [isVideoReady, isCapturing, triggerRefocus]);

  // Start camera with autofocus
  const startCamera = useCallback(async () => {
    setIsStarting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { focusMode?: string[] };
          if (capabilities?.focusMode?.includes('continuous')) {
            await track.applyConstraints({
              advanced: [{ focusMode: 'continuous' } as any]
            });
          }
        } catch (focusErr) {
          // Ignore
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          setIsVideoReady(true);
        } catch (playError) {
          // Autoplay blocked
        }
      }
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    } finally {
      setIsStarting(false);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Capture photo
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isVideoReady) return;

    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Erreur lors de la capture');
      return;
    }

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        setCapturedBlob(blob);
        stopCamera();
      } else {
        setError('Erreur lors de la capture');
      }
      
      canvas.width = 0;
      canvas.height = 0;
    }, 'image/jpeg', 0.92);
  }, [isVideoReady, stopCamera]);

  // Validate capture
  const handleValidate = useCallback(() => {
    if (capturedBlob) {
      onCapture(capturedBlob);
    }
  }, [capturedBlob, onCapture]);

  // Retake photo
  const handleRetake = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setCapturedBlob(null);
    setIsCapturing(false);
    startCamera();
  }, [capturedImage, startCamera]);

  // Close handler
  const handleClose = useCallback(() => {
    stopCamera();
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    onClose();
  }, [stopCamera, capturedImage, onClose]);

  // Manual play for mobile
  const handleManualPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsVideoReady(true);
      } catch (err) {
        // Ignore
      }
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Preview mode
  if (capturedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex-1 relative flex items-center justify-center p-4">
          <img 
            src={capturedImage} 
            alt="Capture" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        <div className="p-4 flex gap-4 justify-center bg-black/80">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleRetake}
            className="flex-1 max-w-[150px] bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reprendre
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleValidate}
            className="flex-1 max-w-[150px] bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-5 w-5 mr-2" />
            Valider
          </Button>
        </div>
      </div>
    );
  }

  // Camera mode - full screen, no guides
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="bg-black/50 text-white hover:bg-black/70 rounded-full h-10 w-10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Video container - tap to refocus */}
      <div 
        className="flex-1 relative flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={handleTapToFocus}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={() => setIsVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Focus point animation */}
        {focusPoint && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              left: focusPoint.x - 30,
              top: focusPoint.y - 30,
            }}
          >
            <div className="w-[60px] h-[60px] border-2 border-yellow-400 rounded-full animate-ping" />
            <div className="absolute inset-0 w-[60px] h-[60px] border-2 border-yellow-400 rounded-full" />
          </div>
        )}

        {/* Loading state */}
        {isStarting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p>Démarrage de la caméra...</p>
            </div>
          </div>
        )}

        {/* Manual play button */}
        {!isStarting && !isVideoReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <Button
              type="button"
              size="lg"
              onClick={handleManualPlay}
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="h-5 w-5 mr-2" />
              Démarrer la caméra
            </Button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white p-4">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                type="button"
                onClick={startCamera}
                className="bg-primary hover:bg-primary/90"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 text-center text-white/80 text-sm bg-black/60">
        Prenez une photo du véhicule
      </div>

      {/* Capture button */}
      <div className="p-4 flex justify-center bg-black/80">
        <Button
          type="button"
          size="lg"
          onClick={handleCapture}
          disabled={!isVideoReady}
          className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 text-black disabled:opacity-50"
        >
          <Camera className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default VehiclePhotoCapture;
