
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2, AlertCircle } from 'lucide-react';
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
  const animationFrameRef = useRef<number | null>(null);

  // Start camera when ready
  useEffect(() => {
    if (status === 'ready') {
      console.log('📸 Status ready, starting camera...');
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [status, startCamera, stopCamera]);

  // Fallback timeout if OpenCV fails to load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === 'loading') {
        console.warn('⚠️ OpenCV timeout, switching to fallback mode');
        setFallbackMode(true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [status]);

  // Video metadata handler
  const handleVideoMetadata = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      console.log('📹 Video metadata loaded:', {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
      setVideoWidth(videoRef.current.videoWidth);
      setVideoHeight(videoRef.current.videoHeight);
    }
  };

  const handleVideoCanPlay = () => {
    console.log('▶️ Video can play');
  };

  // Detection loop
  useEffect(() => {
    if (status !== 'searching' && status !== 'found') {
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
  }, [status, detectDocument, detectedCorners]);

  const handleCapture = async () => {
    setIsCapturing(true);

    try {
      // Fallback mode: simple photo capture
      if (fallbackMode) {
        console.log('📷 Fallback capture mode');
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
      console.error('Capture error:', err);
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

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement du scanner...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erreur</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={handleVideoMetadata}
        onCanPlay={handleVideoCanPlay}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for detection */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <ScannerOverlay 
        isDetected={isDetected} 
        status={status}
        detectedCorners={detectedCorners}
        videoWidth={videoWidth}
        videoHeight={videoHeight}
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
            {isCapturing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Capture...
              </>
            ) : (
              <>
                <Camera className="h-5 w-5 mr-2" />
                Capturer
              </>
            )}
          </Button>
        </div>

        {/* Status message */}
        <div className="text-center mt-4">
          <p className="text-white text-sm">
            {fallbackMode ? (
              <span className="text-yellow-400">Mode photo simple</span>
            ) : isDetected ? (
              <span className="text-green-400">✓ Document détecté</span>
            ) : (
              <span>Positionnez le document dans le cadre</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
