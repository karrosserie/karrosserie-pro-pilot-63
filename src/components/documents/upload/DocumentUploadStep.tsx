import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ImageCropper } from "@/components/shared/ImageCropper";
import { useImageCropping } from "@/components/shared/document-uploader/hooks/useImageCropping";
import { SimpleDocumentScanner } from "@/components/shared/document-scanner/SimpleDocumentScanner";

interface DocumentUploadStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  documentType: string;
  onNext: (file: File) => void;
  onBack: () => void;
  onImageUpload: (file: File) => void;
}

export default function DocumentUploadStep({
  step,
  totalSteps,
  title,
  description,
  documentType,
  onNext,
  onBack,
  onImageUpload
}: DocumentUploadStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Hook pour gérer le système de crop (uniquement pour galerie)
  const {
    imageToProcess,
    cropDialogOpen,
    isDriverLicense,
    handleFileUpload,
    handleCropComplete,
    handleCropCancel
  } = useImageCropping({
    documentType,
    onFileUpload: async (file: File) => {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file); // Passe par le cropper pour la galerie
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedFile) {
      onImageUpload(selectedFile);
      onNext(selectedFile);
    }
  };

  // Capture depuis le scanner - bypass le cropper (déjà fait par le scanner)
  const handleScanCapture = (blob: Blob) => {
    setShowScanner(false);
    
    const file = new File([blob], `scan-client-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    // Mise à jour directe sans passer par le cropper
    setSelectedFile(file);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const progress = (step / totalSteps) * 100;

  // Affichage plein écran du scanner
  if (showScanner) {
    return (
      <SimpleDocumentScanner 
        onCapture={handleScanCapture} 
        onClose={() => setShowScanner(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-karrosserie-orange hover:text-karrosserie-orange/80 hover:bg-karrosserie-orange/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <span className="text-sm text-foreground font-medium">
            {step} sur {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="text-right text-sm text-foreground font-medium mt-1">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Next Button */}
        <Button
          type="button"
          onClick={handleNext}
          disabled={!selectedFile}
          className="w-full mb-6 bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white disabled:bg-muted disabled:text-muted-foreground"
        >
          Suivant
        </Button>

        {/* Image Preview Area */}
        <div className="bg-muted/30 rounded-lg p-8 mb-6 min-h-[200px] flex items-center justify-center border-2 border-dashed border-muted">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Document preview"
              className="max-w-full max-h-[200px] object-contain rounded"
            />
          ) : (
            <div className="text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                Aucune image sélectionnée
              </p>
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="space-y-4">
          {/* Bouton principal - ouvre le scanner intelligent */}
          <Button
            type="button"
            variant={selectedFile ? "ghost" : "default"}
            onClick={() => setShowScanner(true)}
            className={`w-full ${
              selectedFile 
                ? "text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                : "bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
            }`}
          >
            <Camera className="w-4 h-4 mr-2" />
            {selectedFile ? "Reprendre une photo" : "Prendre une photo"}
          </Button>

          {/* Bouton secondaire - galerie (passe par le cropper) */}
          <div>
            <label htmlFor="gallery-input">
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                asChild
              >
                <span className="flex items-center justify-center gap-2 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  {selectedFile ? "Choisir une autre image" : "Choisir depuis la galerie"}
                </span>
              </Button>
            </label>
            <input
              id="gallery-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Image Cropper Dialog - uniquement pour galerie */}
        {imageToProcess && (
          <ImageCropper
            open={cropDialogOpen}
            onClose={handleCropCancel}
            imageUrl={imageToProcess.tempUrl}
            onCropComplete={handleCropComplete}
            aspectRatio={4 / 3}
            allowHorizontalExpansion={isDriverLicense}
          />
        )}
      </div>
    </div>
  );
}
