import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Download, Eye, Pencil, Trash, Play } from 'lucide-react';
import { Cession } from '@/services/supabase/cessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { validateRepairOrderData } from '@/components/cessions/form/utils/dataValidation';

interface CessionsTableProps {
  cessions: Cession[];
  isLoading: boolean;
  onEditCession: (cession: Cession) => void;
  onDeleteCession: (id: string) => void;
}

export const CessionsTable = ({
  cessions,
  isLoading,
  onEditCession,
  onDeleteCession
}: CessionsTableProps) => {
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
    
    return `Ordre n°${order.reference} du ${orderDate} - ${clientName} - ${vehicleInfo}`;
  };

  const handleInitializeProcedure = async (cession: Cession) => {
    console.log('Initializing procedure for cession:', cession.id);
    
    // Vérifier qu'il y a un repair_order_id
    if (!cession.repair_order_id) {
      toast({
        title: "Erreur",
        description: "Aucun ordre de réparation n'est associé à cette cession.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Récupérer les données complètes de l'ordre de réparation avec client et véhicule
      const repairOrderData = await repairOrdersService.getById(cession.repair_order_id);
      
      // Valider que toutes les photos sont présentes
      const validationError = validateRepairOrderData(
        repairOrderData,
        repairOrderData.clients,
        repairOrderData.vehicles
      );
      
      if (validationError) {
        toast({
          title: "Documents manquants",
          description: validationError,
          variant: "destructive",
        });
        return;
      }
      
      // Si toutes les validations passent, procéder à l'initialisation
      toast({
        title: "Validation réussie",
        description: "Tous les documents requis sont présents. Procédure en cours d'initialisation...",
      });
      
      // TODO: Implement procedure initialization logic
      console.log('All validations passed, proceeding with initialization...');
      
    } catch (error) {
      console.error('Error validating repair order data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données de l'ordre de réparation.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="card-container">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
        </div>
      </div>
    );
  }

  console.log('Rendering table with cessions:', cessions);

  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Ordre de réparation</TableHead>
            <TableHead>Assurance</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cessions.length > 0 ? (
            cessions.map((cession) => (
              <TableRow key={cession.id}>
                <TableCell>
                  {format(new Date(cession.created_at), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  {formatRepairOrderDisplay(cession)}
                </TableCell>
                <TableCell>
                  {cession.insurance_companies ? 
                    cession.insurance_companies.name 
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(cession.status || '')}`}>
                    {getStatusLabel(cession.status || '')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditCession(cession)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteCession(cession.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleInitializeProcedure(cession)}
                      title="Initialiser la procédure"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                  <p className="text-gray-500 mt-1">
                    Aucune cession de créance correspondant à votre recherche n'a été trouvée.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
