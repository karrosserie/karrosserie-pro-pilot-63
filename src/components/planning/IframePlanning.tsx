import { useState } from 'react';
import { useUserRole } from '@/hooks/use-user-role';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/use-company';
import { useImpersonation } from '@/hooks/use-impersonation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IframePlanningProps {
  className?: string;
}

export function IframePlanning({ className = "" }: IframePlanningProps) {
  const { userRole, isLoading: roleLoading } = useUserRole();
  const { user } = useAuth();
  const { companyData } = useCompany();
  const { isImpersonating } = useImpersonation();
  const [iframeError, setIframeError] = useState(false);

  const baseUrl = 'https://karrosserie-planning.lovable.app/';
  
  // Construire l'URL avec les paramètres essentiels seulement
  const getIframeUrl = () => {
    const params = new URLSearchParams();
    if (userRole) params.append('role', userRole);
    if (user?.id) params.append('userId', user.id);
    if (companyData?.id) params.append('companyId', companyData.id);
    if (isImpersonating) params.append('impersonating', 'true');
    return `${baseUrl}?${params.toString()}`;
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  // Afficher un loader pendant le chargement du rôle
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/10 rounded-lg">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Chargement de l'interface de planning...</p>
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
        allow="clipboard-write"
      />
    </div>
  );
}