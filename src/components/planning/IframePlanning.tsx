import { useEffect, useRef, useState } from 'react';
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
  const { userRole, isLoading: roleLoading, isOwner, isCarrossier, isResponsable } = useUserRole();
  const { user, profile } = useAuth();
  const { companyData } = useCompany();
  const { isImpersonating, impersonationData } = useImpersonation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const baseUrl = 'https://karrosserie-planning.lovable.app/';
  
  // Construire l'URL avec les paramètres enrichis
  const getIframeUrl = () => {
    const params = new URLSearchParams();
    if (userRole) params.append('role', userRole);
    if (user?.id) params.append('userId', user.id);
    if (companyData?.id) params.append('companyId', companyData.id);
    if (isImpersonating) params.append('impersonating', 'true');
    return `${baseUrl}?${params.toString()}`;
  };

  // Envoyer toutes les données utilisateur via postMessage
  useEffect(() => {
    if (isIframeLoaded && user && profile && companyData && iframeRef.current) {
      const completeUserData = {
        type: 'USER_DATA_COMPLETE',
        timestamp: Date.now(),
        user: {
          id: user.id,
          email: user.email,
          profile: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            phoneNumber: profile.phone_number
          }
        },
        company: {
          id: companyData.id,
          name: companyData.name,
          email: companyData.email,
          address: companyData.address,
          city: companyData.city,
          zipcode: companyData.zipcode,
          phone: companyData.phone,
          siret: companyData.siret,
          siren: companyData.siren,
          tva: companyData.tva,
          logoUrl: companyData.logo_url
        },
        role: {
          current: userRole,
          permissions: {
            isOwner,
            isCarrossier,
            isResponsable,
            canManage: isOwner || isResponsable,
            viewOnly: isCarrossier,
            restrictedView: isCarrossier ? 'employee' : isResponsable ? 'manager' : null
          }
        },
        impersonation: {
          isActive: isImpersonating,
          originalUser: isImpersonating ? impersonationData?.original_user : null,
          companyName: isImpersonating ? impersonationData?.company_name : null
        },
        preferences: {
          notifications: {
            email: companyData.notifications?.email || false,
            push: companyData.notifications?.push || false,
            sms: companyData.notifications?.sms || false
          }
        }
      };
      
      try {
        const targetOrigin = baseUrl.replace(/\/$/, '');
        iframeRef.current.contentWindow?.postMessage(completeUserData, targetOrigin);
        console.log(`Données utilisateur envoyées à l'iframe avec origine ${targetOrigin}:`, completeUserData);
      } catch (error) {
        console.warn('Impossible d\'envoyer les données à l\'iframe:', error);
      }
    }
  }, [isIframeLoaded, user, profile, companyData, userRole, isOwner, isCarrossier, isResponsable, isImpersonating, impersonationData]);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIsIframeLoaded(false);
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
        ref={iframeRef}
        src={getIframeUrl()}
        className="w-full h-full border-0 rounded-lg"
        style={{ minHeight: '800px' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="Interface de Planning Carrosserie"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow="clipboard-write"
      />
    </div>
  );
}