import React from 'react';
import { useDocumentRequests } from '@/hooks/useDocumentRequests';
import { useCompanyId } from '@/hooks/use-company-id';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AlertCard from '@/components/mission-control/AlertCard';

const DocumentRequestAlerts = () => {
  const { companyId } = useCompanyId();
  const { data: requests, isLoading } = useDocumentRequests(companyId);

  if (isLoading || !requests || requests.length === 0) {
    return null;
  }

  return (
    <>
      {requests.map((request) => {
        const hoursElapsed = Math.ceil(
          (Date.now() - new Date(request.created_at).getTime()) / (1000 * 60 * 60)
        );
        
        return (
          <AlertCard
            key={request.id}
            type="critical"
            icon="administration"
            title="Demande de document"
            subtitle={`📄 Client ID: ${request.client_id}`}
            description={request.probleme}
            impact="Document manquant - Impact sur le traitement du dossier client"
            suggestion="Contacter le client pour obtenir le document manquant et finaliser le dossier"
            metrics={[
              { 
                value: formatDistanceToNow(new Date(request.created_at), { locale: fr }), 
                label: 'Créé', 
                unit: '' 
              },
              { 
                value: new Date(request.created_at).toLocaleDateString('fr-FR'), 
                label: 'Date demande', 
                unit: '' 
              },
              { 
                value: hoursElapsed.toString(), 
                label: 'Heures écoulées', 
                unit: 'h' 
              }
            ]}
            actions={[
              { 
                label: 'Contacter client', 
                variant: 'primary',
                modalType: 'contact_client',
                modalData: { 
                  title: 'Contacter le client',
                  clientId: request.client_id,
                  problem: request.probleme
                }
              },
              { 
                label: 'Voir détails', 
                variant: 'outline',
                modalType: 'document_request_details',
                modalData: { 
                  title: 'Détails de la demande',
                  clientId: request.client_id,
                  companyId: request.company_id,
                  problem: request.probleme,
                  createdAt: request.created_at
                }
              }
            ]}
          />
        );
      })}
    </>
  );
};

export default DocumentRequestAlerts;
