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

  const generateIframeToken = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      console.log('IframePlanning - Attempting to call generate-iframe-token edge function...');

      const { data, error } = await supabase.functions.invoke('generate-iframe-token', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {}, // Ajout d'un body vide pour forcer POST
      });

      console.log('IframePlanning - Edge function response:', { data, error });

      if (error) {
        console.error('IframePlanning - Edge function error:', error);
        throw error;
      }

      if (data?.success && data?.token) {
        console.log('IframePlanning - Token generated successfully:', data.token.substring(0, 50) + '...');
        setIframeToken(data.token);
        setIframeError(false); // Reset error state on success
      } else {
        console.error('IframePlanning - Failed to generate token, response:', data);
        throw new Error('Failed to generate token');
      }
    } catch (error) {
      console.error('IframePlanning - Full error details:', {
        message: error.message,
        name: error.name,
        context: error.context,
        stack: error.stack
      });
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
        allow="clipboard-write; geolocation"
      />
    </div>
  );
}