import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  fieldName: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, fieldName }) => {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechToText();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript) {
      console.log(`🎤 Transcription pour ${fieldName}:`, transcript);
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, fieldName, resetTranscript]);

  const handleClick = () => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast({
        title: "🎤 Microphone actif",
        description: "Parlez maintenant...",
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={handleClick}
      className={`flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
      title={isListening ? "Arrêter l'enregistrement" : "Dicter avec le microphone"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceInputButton;
