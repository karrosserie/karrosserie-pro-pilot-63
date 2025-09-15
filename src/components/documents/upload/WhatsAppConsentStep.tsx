import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WhatsAppConsentStepProps {
  step: number;
  totalSteps: number;
  onNext: (consent: boolean) => void;
  onBack: () => void;
}

export default function WhatsAppConsentStep({
  step,
  totalSteps,
  onNext,
  onBack
}: WhatsAppConsentStepProps) {
  const [consent, setConsent] = useState<boolean | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (consent !== null) {
      onNext(consent);
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
          <div className="w-16 h-16 bg-karrosserie-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Communication WhatsApp
          </h1>
          <p className="text-muted-foreground text-sm">
            Acceptez-vous de recevoir des communications via WhatsApp pour le suivi de votre dossier ?
          </p>
        </div>

        {/* Consent Options */}
        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={() => setConsent(true)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              consent === true
                ? 'border-karrosserie-orange bg-karrosserie-orange/10'
                : 'border-muted hover:border-karrosserie-orange/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  consent === true
                    ? 'border-karrosserie-orange bg-karrosserie-orange'
                    : 'border-muted-foreground'
                }`}>
                  {consent === true && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Oui, j'accepte</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setConsent(false)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              consent === false
                ? 'border-karrosserie-orange bg-karrosserie-orange/10'
                : 'border-muted hover:border-karrosserie-orange/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  consent === false
                    ? 'border-karrosserie-orange bg-karrosserie-orange'
                    : 'border-muted-foreground'
                }`}>
                  {consent === false && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Non, merci</p>
                  <p className="text-sm text-muted-foreground">
                    Utiliser uniquement les autres moyens de communication
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Next Button */}
        <Button
          type="button"
          onClick={handleNext}
          disabled={consent === null}
          className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white disabled:bg-muted disabled:text-muted-foreground"
        >
          Terminer
        </Button>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Vous pourrez modifier ce choix à tout moment en nous contactant directement.
        </p>
      </div>
    </div>
  );
}