import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IframePlanningProps {
  className?: string;
}

export function IframePlanning({ className = "" }: IframePlanningProps) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_PLANNING_IFRAME_URL || 'https://karrosserie-planning.lovable.app/';

  useEffect(() => {
    generateIframeToken();
  }, []);

  const generateIframeToken = async (retryCount = 0) => {
    const maxRetries = 3;
    const timeout = 10000; // 10 secondes
    
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      console.log('IframePlanning - Attempting to call generate-iframe-token edge function...', { retryCount });

      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const { data, error } = await supabase.functions.invoke('generate-iframe-token', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {}, // Body vide pour forcer POST
        });

        clearTimeout(timeoutId);
        console.log('IframePlanning - Edge function response:', { data, error });

        if (error) {
          console.error('IframePlanning - Edge function error:', error);
          throw error;
        }

        if (data?.success && data?.token) {
          console.log('IframePlanning - Token generated successfully:', data.token.substring(0, 50) + '...');
          setIframeToken(data.token);
          setIframeError(false); // Reset error state on success
          return; // Succès, on sort
        } else {
          console.error('IframePlanning - Failed to generate token, response:', data);
          throw new Error('Failed to generate token');
        }
      } catch (invokeError) {
        clearTimeout(timeoutId);
        throw invokeError;
      }
      
    } catch (error) {
      console.error('IframePlanning - Error on attempt', retryCount + 1, ':', {
        message: error.message,
        name: error.name,
        context: error.context,
        stack: error.stack
      });

      // Retry logic
      if (retryCount < maxRetries && (
        error.message?.includes('Failed to fetch') || 
        error.message?.includes('network') ||
        error.name === 'AbortError'
      )) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`IframePlanning - Retrying in ${delay}ms... (${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          generateIframeToken(retryCount + 1);
        }, delay);
        return;
      }
      
      // Si on arrive ici, toutes les tentatives ont échoué
      setIframeError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Construire l'URL avec le token sécurisé
  const getIframeUrl = () => {
    console.log('IframePlanning - getIframeUrl called, iframeToken:', iframeToken);
    
    if (!iframeToken) {
      console.log('IframePlanning - No token, returning base URL:', baseUrl);
      return baseUrl;
    }
    
    const params = new URLSearchParams();
    params.append('token', iframeToken);
    params.append('app_context', 'embedded');
    
    const finalUrl = `${baseUrl}?${params.toString()}`;
    console.log('IframePlanning - Final iframe URL with token:', finalUrl);
    
    return finalUrl;
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  // Afficher un loader pendant le chargement du token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/10 rounded-lg">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Génération du token sécurisé...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si l'iframe ne peut pas se charger
  if (iframeError) {
    return (
      <Alert className="mx-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Impossible de charger l'interface de planning. Essayez d'ouvrir l'application dans un nouvel onglet.</span>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIframeError(false);
                generateIframeToken();
              }}
            >
              Réessayer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(baseUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        src={getIframeUrl()}
        className="w-full h-full border-0 rounded-lg"
        style={{ minHeight: '800px' }}
        onError={handleIframeError}
        title="Interface de Planning Carrosserie"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-geolocation"
        allow="clipboard-write; geolocation; camera; microphone"
      />
    </div>
  );
}