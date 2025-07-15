import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  onNext: (file: File) => void;
  onBack: () => void;
  onImageUpload: (file: File) => void;
}

export default function DocumentUploadStep({
  step,
  totalSteps,
  title,
  description,
  onNext,
  onBack,
  onImageUpload
}: DocumentUploadStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageUpload(file);
    }
  };

  const handleNext = () => {
    if (selectedFile) {
      onNext(selectedFile);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-karrosserie-orange hover:text-karrosserie-orange/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <span className="text-sm text-muted-foreground">
            {step} sur {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="text-right text-sm text-muted-foreground mt-1">
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
          onClick={handleNext}
          disabled={!selectedFile}
          className="w-full mb-6 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Suivant
        </Button>

        {/* Image Preview Area */}
        <div className="bg-gray-50 rounded-lg p-8 mb-6 min-h-[200px] flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Document preview"
              className="max-w-full max-h-[200px] object-contain rounded"
            />
          ) : (
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                Aucune image sélectionnée
              </p>
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="space-y-3">
          <label htmlFor="camera-input">
            <Button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              asChild
            >
              <span className="flex items-center justify-center gap-2 cursor-pointer">
                <Camera className="w-4 h-4" />
                Prendre une photo
              </span>
            </Button>
          </label>
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <label htmlFor="gallery-input">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-blue-600 hover:text-blue-700"
              asChild
            >
              <span className="flex items-center justify-center gap-2 cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                Choisir depuis la galerie
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
    </div>
  );
}