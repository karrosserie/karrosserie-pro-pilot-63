import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, Check, Loader2 } from 'lucide-react';

interface SimpleCaptureModeProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
  documentType?: string;
}

// Document aspect ratios for visual guides
const getGuideRatio = (documentType?: string): { width: number; height: number; label: string } => {
  switch (documentType) {
    case 'cheque':
    case 'payment-proof':
      return { width: 175, height: 80, label: 'Chèque' }; // ~2.19:1
    case 'driver-license':
    case 'insurance':
      return { width: 160, height: 100, label: 'Carte' }; // ~1.6:1
    case 'violation':
      return { width: 148, height: 105, label: 'PV' }; // A5 horizontal
    default:
      return { width: 140, height: 200, label: 'Document' }; // A4-ish
  }
};

const SimpleCaptureMode: React.FC<SimpleCaptureModeProps> = ({
  onCapture,
  onClose,
  documentType
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);

  const guide = getGuideRatio(documentType);

  // Start camera - ultra simple, no OpenCV
  const startCamera = useCallback(async () => {
    console.log('[SimpleCaptureMode] Starting camera...');
    setIsStarting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          // Low resolution to prevent memory issues
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          console.log('[SimpleCaptureMode] Video playing');
          setIsVideoReady(true);
        } catch (playError) {
          console.warn('[SimpleCaptureMode] Autoplay blocked, waiting for user interaction');
        }
      }
    } catch (err) {
      console.error('[SimpleCaptureMode] Camera error:', err);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    } finally {
      setIsStarting(false);
    }
  }, []);

  // Stop camera and release memory
  const stopCamera = useCallback(() => {
    console.log('[SimpleCaptureMode] Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Capture photo - direct screenshot, no OpenCV
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isVideoReady) return;

    console.log('[SimpleCaptureMode] Capturing...');

    // Create temporary canvas for capture
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Erreur lors de la capture');
      return;
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Convert to blob and preview
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        setCapturedBlob(blob);
        stopCamera(); // Stop camera to save resources
      } else {
        setError('Erreur lors de la capture');
      }
      
      // Release canvas memory immediately
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

  // Manual play for mobile autoplay restrictions
  const handleManualPlay = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsVideoReady(true);
      } catch (err) {
        console.error('[SimpleCaptureMode] Manual play failed:', err);
      }
    }
  }, []);

  // Start camera on mount
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
        {/* Preview image */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          <img 
            src={capturedImage} 
            alt="Capture" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Action buttons */}
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

  // Camera mode
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

      {/* Video container */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={() => setIsVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Visual guide overlay */}
        {isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Semi-transparent overlay with cutout */}
            <div 
              className="relative border-4 border-white/80 rounded-lg shadow-2xl"
              style={{
                width: `${guide.width}px`,
                height: `${guide.height}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
            </div>
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

        {/* Manual play button for autoplay restrictions */}
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
        Alignez le {guide.label.toLowerCase()} dans le cadre
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

export default SimpleCaptureMode;
