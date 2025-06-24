
import { useState, useCallback } from 'react';

interface UseAIDocumentProcessingProps {
  onComplete?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAIDocumentProcessing({ onComplete, onError }: UseAIDocumentProcessingProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  const simulateAIProcessing = useCallback(async () => {
    setIsProcessing(true);
    setProgress(0);
    
    const steps = [
      { progress: 10, message: "Téléchargement du document..." },
      { progress: 25, message: "Analyse de la structure..." },
      { progress: 45, message: "Reconnaissance de texte..." },
      { progress: 65, message: "Extraction des données..." },
      { progress: 80, message: "Validation des informations..." },
      { progress: 95, message: "Finalisation..." },
      { progress: 100, message: "Traitement terminé" }
    ];

    try {
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(step.progress);
        setCurrentMessage(step.message);
      }
      
      if (onComplete) {
        onComplete({ success: true });
      }
    } catch (error) {
      if (onError) {
        onError('Erreur lors du traitement IA');
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentMessage('');
    }
  }, [onComplete, onError]);

  return {
    isProcessing,
    progress,
    currentMessage,
    startProcessing: simulateAIProcessing
  };
}
