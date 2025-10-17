
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { CessionFormData, CessionFormErrors } from '../types';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RepairOrderSelectorProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
}

export const RepairOrderSelector = ({
  formData,
  errors,
  onFieldChange
}: RepairOrderSelectorProps) => {
  const { orders, isLoading: isLoadingOrders } = useRepairOrders();
  const { shouldShowCessionSelectOrderHelp, markHelpAsSeen } = useUserOnboardingProgress();
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Afficher la pop-up d'aide si pas encore vue
  useEffect(() => {
    if (shouldShowCessionSelectOrderHelp && !isLoadingOrders) {
      const timer = setTimeout(() => setShowHelpDialog(true), 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowCessionSelectOrderHelp, isLoadingOrders]);

  const formatRepairOrderDisplay = (order: any) => {
    const clientName = order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non assigné';
    
    // Utiliser d'abord les champs brand et model directs, puis fallback sur les relations
    let vehicleInfo = 'Véhicule non assigné';
    if (order.vehicles) {
      const brand = order.vehicles.brand || order.vehicles.car_brands?.name || 'Marque inconnue';
      const model = order.vehicles.model || order.vehicles.car_models?.name || 'Modèle inconnu';
      const licensePlate = order.vehicles.license_plate || '';
      vehicleInfo = `${brand} ${model} - ${licensePlate}`;
    }
    
    const orderDate = order.created_at ? format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr }) : '';
    
    return `Ordre n°${order.reference} du ${orderDate} - ${clientName} - ${vehicleInfo}`;
  };

  // Préparer les options pour SearchableSelect
  const repairOrderOptions = (orders || []).map(order => ({
    value: order.id,
    label: formatRepairOrderDisplay(order)
  }));

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="repair_order_id">
          Ordre de réparation <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={repairOrderOptions}
          value={formData.repair_order_id || ''}
          onValueChange={(value) => onFieldChange('repair_order_id', value)}
          placeholder={isLoadingOrders ? "Chargement..." : "Sélectionner un ordre de réparation"}
          searchPlaceholder="Rechercher un ordre de réparation..."
          disabled={isLoadingOrders}
        />
        {errors.repair_order_id && (
          <div className="text-sm text-red-600">{errors.repair_order_id}</div>
        )}
      </div>

      <AlertDialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">📋 Sélectionnez un ordre de réparation</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Pour créer une cession de créance, vous devez d'abord <strong>choisir l'ordre de réparation</strong> avec lequel vous souhaitez faire la cession de créance.
              <br /><br />
              La cession permettra à l'assurance de vous payer directement pour les réparations effectuées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowHelpDialog(false);
              markHelpAsSeen('cession_select_order_help_seen');
            }}>
              J'ai compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
