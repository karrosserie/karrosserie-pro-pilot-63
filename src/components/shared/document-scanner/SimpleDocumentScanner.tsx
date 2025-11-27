import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showManualStart, setShowManualStart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize jscanify
  useEffect(() => {
    import('jscanify').then(module => {
      scannerRef.current = new module.default();
      console.log('[Scanner] jscanify loaded');
    }).catch(err => {
      console.error('[Scanner] Failed to load jscanify:', err);
    });
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowManualStart(false);

      console.log('[Camera] Requesting getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      console.log('[Camera] Stream obtained:', stream.active);

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('[Camera] srcObject assigned, attempting play...');
        
        try {
          await videoRef.current.play();
          console.log('[Camera] Play succeeded');
          setIsVideoReady(true);
          setIsLoading(false);
        } catch (playError) {
          console.warn('[Camera] Autoplay blocked, showing manual button:', playError);
          setIsLoading(false);
          setShowManualStart(true);
        }
      }
    } catch (err) {
      console.error('[Camera] Error:', err);
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setIsLoading(false);
    }
  }, []);

  // Manual start for autoplay-blocked cases
  const handleManualStart = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        console.log('[Camera] Manual play succeeded');
        setIsVideoReady(true);
        setShowManualStart(false);
      } catch (err) {
        console.error('[Camera] Manual play failed:', err);
        setError("Impossible de démarrer la caméra.");
        setShowManualStart(false);
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
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

  // Real-time detection loop
  useEffect(() => {
    if (!isVideoReady || !scannerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;

    if (!video || !canvas || !displayCanvas) return;

    const ctx = canvas.getContext('2d');
    const displayCtx = displayCanvas.getContext('2d');

    if (!ctx || !displayCtx) return;

    const detectLoop = () => {
      if (!video.paused && !video.ended && video.readyState >= 2) {
        // Set canvas dimensions to match video
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          displayCanvas.width = width;
          displayCanvas.height = height;

          // Draw video frame to hidden canvas
          ctx.drawImage(video, 0, 0, width, height);

          try {
            // Apply highlightPaper for visual feedback
            const highlighted = scannerRef.current.highlightPaper(canvas);
            displayCtx.drawImage(highlighted, 0, 0);
          } catch (e) {
            // If highlighting fails, just show the video frame
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

  // Initialize on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Capture document
  const handleCapture = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !scannerRef.current) {
      toast({
        title: "Erreur",
        description: "Scanner non prêt",
        variant: "destructive"
      });
      return;
    }

    try {
      // Try to extract the document
      const resultCanvas = scannerRef.current.extractPaper(canvas, canvas.width, canvas.height);

      if (resultCanvas && resultCanvas.width > 0 && resultCanvas.height > 0) {
        resultCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            stopCamera();
            onCapture(blob);
          } else {
            throw new Error('Failed to create blob');
          }
        }, 'image/jpeg', 0.9);
      } else {
        // Fallback: capture raw frame if no document detected
        canvas.toBlob((blob) => {
          if (blob) {
            stopCamera();
            onCapture(blob);
            toast({
              title: "Photo capturée",
              description: "Aucun document détecté, image brute utilisée."
            });
          }
        }, 'image/jpeg', 0.9);
      }
    } catch (err) {
      console.error('Extract error:', err);
      // Fallback to raw capture
      canvas.toBlob((blob) => {
        if (blob) {
          stopCamera();
          onCapture(blob);
        }
      }, 'image/jpeg', 0.9);
    }
  }, [onCapture, stopCamera, toast]);

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

        {/* Hidden video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
        />

        {/* Hidden processing canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Display canvas with highlighted document */}
        <canvas
          ref={displayCanvasRef}
          className="w-full h-full object-contain"
          style={{ display: isVideoReady ? 'block' : 'none' }}
        />

        {/* Instructions overlay */}
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
