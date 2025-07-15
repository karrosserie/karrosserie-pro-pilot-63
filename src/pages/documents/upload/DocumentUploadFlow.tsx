import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import DocumentUploadWorkflow from "@/components/documents/upload/DocumentUploadWorkflow";

export default function DocumentUploadFlow() {
  const [showWorkflow, setShowWorkflow] = useState(false);

  const handleStart = () => {
    setShowWorkflow(true);
  };

  const handleBackToStart = () => {
    setShowWorkflow(false);
  };

  const handleComplete = (documents: { [key: string]: File }) => {
    console.log("Documents uploaded:", documents);
    // TODO: Handle document submission
    // For now, redirect back to start
    setShowWorkflow(false);
  };

  if (showWorkflow) {
    return (
      <DocumentUploadWorkflow
        onBack={handleBackToStart}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Header with icon and title */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-karrosserie-orange rounded-full flex items-center justify-center mx-auto shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Carrosserie Liguori
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            Téléversement de documents
          </h2>
        </div>

        {/* Start button */}
        <Button 
          onClick={handleStart}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          Commencer
        </Button>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Afin de traiter votre dossier rapidement,<br />
          nous avons besoin de quelques documents.
        </p>

        {/* Document list */}
        <div className="space-y-4 text-left">
          <h3 className="font-semibold text-foreground">
            Veuillez préparer :
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm">
                1
              </span>
              <span className="text-muted-foreground">
                Votre permis de conduire (recto-verso)
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm">
                2
              </span>
              <span className="text-muted-foreground">
                Votre carte grise (recto-verso)
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-muted-foreground text-sm italic">
          Assurez-vous d'être dans un endroit bien éclairé pour prendre des photos nettes.
        </p>
      </div>
    </div>
  );
}