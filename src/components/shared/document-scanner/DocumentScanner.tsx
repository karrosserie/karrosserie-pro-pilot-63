
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
    startCamera,
    stopCamera,
    detectDocument,
    extractDocument
  } = useDocumentScanner();

  const [isDetected, setIsDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const detectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Start camera when ready
  useEffect(() => {
    if (status === 'ready') {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [status, startCamera, stopCamera]);

  // Detection loop
  useEffect(() => {
    if (status !== 'searching' && status !== 'found') {
      return;
    }

    const detectLoop = () => {
      const resultCanvas = detectDocument();
      
      if (resultCanvas && detectionCanvasRef.current) {
        const ctx = detectionCanvasRef.current.getContext('2d');
        if (ctx) {
          detectionCanvasRef.current.width = resultCanvas.width;
          detectionCanvasRef.current.height = resultCanvas.height;
          ctx.drawImage(resultCanvas, 0, 0);
          
          // Check if document is detected (jscanify adds green borders when detected)
          setIsDetected(true);
        }
      } else {
        setIsDetected(false);
      }

      animationFrameRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, detectDocument]);

  const handleCapture = async () => {
    setIsCapturing(true);

    try {
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
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for detection */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Detection overlay */}
      <canvas
        ref={detectionCanvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay UI */}
      <ScannerOverlay isDetected={isDetected} status={status} />

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
            disabled={!isDetected || isCapturing}
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
            {isDetected ? (
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
