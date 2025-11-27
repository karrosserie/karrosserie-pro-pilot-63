import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Check, X, Crop, Image as ImageIcon } from 'lucide-react';
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useProcessed, setUseProcessed] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setCapturedImage(imageUrl);
      setProcessedImage(null);
      processImage(imageUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    
    try {
      // Dynamically import jscanify
      const jscanify = (await import('jscanify')).default;
      const scanner = new jscanify();

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Try to extract the document
          const resultCanvas = scanner.extractPaper(img, img.naturalWidth, img.naturalHeight);
          
          if (resultCanvas && resultCanvas.width > 0 && resultCanvas.height > 0) {
            const processedUrl = resultCanvas.toDataURL('image/jpeg', 0.9);
            setProcessedImage(processedUrl);
            toast({
              title: "Document détecté",
              description: "Le document a été automatiquement recadré."
            });
          } else {
            // No document detected, use original
            setProcessedImage(null);
            toast({
              title: "Aucun document détecté",
              description: "Utilisez l'image originale ou reprenez la photo."
            });
          }
        } catch (error) {
          console.error('jscanify processing error:', error);
          setProcessedImage(null);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        console.error('Failed to load image for processing');
        setProcessedImage(null);
        setIsProcessing(false);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Error loading jscanify:', error);
      setProcessedImage(null);
      setIsProcessing(false);
    }
  };

  const handleConfirm = useCallback(async () => {
    const imageToUse = useProcessed && processedImage ? processedImage : capturedImage;
    if (!imageToUse) return;

    try {
      // Convert data URL to blob
      const response = await fetch(imageToUse);
      const blob = await response.blob();
      onCapture(blob);
    } catch (error) {
      console.error('Error converting image to blob:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'image.",
        variant: "destructive"
      });
    }
  }, [capturedImage, processedImage, useProcessed, onCapture, toast]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setProcessedImage(null);
    setUseProcessed(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const openCamera = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Initial state - show capture button
  if (!capturedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Scanner un document</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="text-center space-y-2">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Prenez une photo du document à scanner
            </p>
          </div>

          <Button size="lg" className="h-16 px-8 text-lg" onClick={openCamera}>
            <Camera className="h-6 w-6 mr-3" />
            Prendre une photo
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  // Preview state - show captured/processed image
  const displayImage = useProcessed && processedImage ? processedImage : capturedImage;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Aperçu du document</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isProcessing ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-muted-foreground">Détection du document...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border bg-muted">
              <img
                src={displayImage}
                alt="Document capturé"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Toggle between original and processed */}
            {processedImage && (
              <div className="flex gap-2">
                <Button
                  variant={useProcessed ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUseProcessed(true)}
                >
                  <Crop className="h-4 w-4 mr-2" />
                  Recadré
                </Button>
                <Button
                  variant={!useProcessed ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUseProcessed(false)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Original
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleRetake}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reprendre
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
};
