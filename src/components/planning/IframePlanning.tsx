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

  const baseUrl = 'https://karrosserie-planning.lovable.app/';

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

      const { data, error } = await supabase.functions.invoke('generate-iframe-token', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.success && data?.token) {
        setIframeToken(data.token);
      } else {
        throw new Error('Failed to generate token');
      }
    } catch (error) {
      console.error('Error generating iframe token:', error);
      setIframeError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Construire l'URL avec le token sécurisé
  const getIframeUrl = () => {
    if (!iframeToken) return baseUrl;
    const params = new URLSearchParams();
    params.append('token', iframeToken);
    params.append('app_context', 'embedded');
    return `${baseUrl}?${params.toString()}`;
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(baseUrl, '_blank')}
            className="ml-4"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ouvrir
          </Button>
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
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow="clipboard-write; geolocation"
      />
    </div>
  );
}