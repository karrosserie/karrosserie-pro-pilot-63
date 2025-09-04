import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Pencil, Trash, Play, Loader2, Building, Car, Calendar } from 'lucide-react';
import { Cession } from '@/services/supabase/cessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CessionMobileCardProps {
  cession: Cession;
  onEditCession: (cession: Cession) => void;
  onDeleteCession: (id: string) => void;
  onViewPreview: (cession: Cession) => void;
  onDownloadPDF: (cession: Cession) => void;
  onInitializeProcedure: (cession: Cession) => void;
  isGeneratingPDF: boolean;
}

export const CessionMobileCard = ({
  cession,
  onEditCession,
  onDeleteCession,
  onViewPreview,
  onDownloadPDF,
  onInitializeProcedure,
  isGeneratingPDF
}: CessionMobileCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-gray-100 text-gray-800';
      case 'en_attente_signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'signee':
        return 'bg-green-100 text-green-800';
      case 'signature_refusee':
        return 'bg-red-100 text-red-800';
      case 'lettre_recommandee_envoyee':
        return 'bg-blue-100 text-blue-800';
      case 'lettre_recommandee_recue':
        return 'bg-indigo-100 text-indigo-800';
      case 'lettre_recommandee_non_recuperee':
        return 'bg-orange-100 text-orange-800';
      case 'lettre_recommandee_refusee':
        return 'bg-red-100 text-red-800';
      case 'lettre_recommandee_presentee':
        return 'bg-purple-100 text-purple-800';
      case 'payee':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'en_attente_signature':
        return 'En attente de signature';
      case 'signee':
        return 'Signée';
      case 'signature_refusee':
        return 'Signature refusée';
      case 'lettre_recommandee_envoyee':
        return 'Lettre recommandée envoyée';
      case 'lettre_recommandee_recue':
        return 'Lettre recommandée reçue';
      case 'lettre_recommandee_non_recuperee':
        return 'Lettre recommandée non récupérée';
      case 'lettre_recommandee_refusee':
        return 'Lettre recommandée refusée';
      case 'lettre_recommandee_presentee':
        return 'Lettre recommandée présentée';
      case 'payee':
        return 'Payée';
      default:
        return status;
    }
  };

  const formatRepairOrderDisplay = (cession: Cession) => {
    if (!cession.repair_orders) {
      return cession.repair_order_id ? `Ordre lié (ID: ${cession.repair_order_id})` : '-';
    }
    
    const order = cession.repair_orders;
    const clientName = order.clients ? 
      `${order.clients.first_name} ${order.clients.last_name}` : 
      'Client non assigné';
    
    const vehicleInfo = order.vehicles ? 
      `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}` : 
      'Véhicule non assigné';
    
    const orderDate = order.created_at ? 
      format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr }) : '';
    
    return { reference: order.reference, orderDate, clientName, vehicleInfo };
  };

  const orderData = formatRepairOrderDisplay(cession);
  
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-card-foreground">
              Cession du {format(new Date(cession.created_at), 'dd/MM/yyyy', { locale: fr })}
            </h3>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(cession.status || '')}`}>
          {getStatusLabel(cession.status || '')}
        </span>
      </div>

      {typeof orderData === 'object' && orderData.reference && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Ordre n°{orderData.reference}</span>
            <span className="text-muted-foreground">du {orderData.orderDate}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>{orderData.vehicleInfo}</span>
          </div>

          <div className="text-sm text-muted-foreground ml-6">
            Client: {orderData.clientName}
          </div>
        </div>
      )}

      {cession.insurance_companies && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{cession.insurance_companies.name}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        {cession.status === 'en_attente' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewPreview(cession)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
        )}
        
        {cession.status !== 'en_attente' && cession.status !== 'en_attente_signature' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownloadPDF(cession)}
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEditCession(cession)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={() => onDeleteCession(cession.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
        
        {cession.status === 'en_attente' && (
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
            onClick={() => onInitializeProcedure(cession)}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Initialiser
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};