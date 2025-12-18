
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { CessionFormData, CessionFormErrors } from '../types';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface RepairOrderSelectorProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
  filterByClientType?: 'particulier' | 'entreprise';
}

export const RepairOrderSelector = ({
  formData,
  errors,
  onFieldChange,
  filterByClientType
}: RepairOrderSelectorProps) => {
  const { orders, isLoading: isLoadingOrders } = useRepairOrders();
  const { shouldShowCessionSelectOrderHelp, markHelpAsSeen } = useUserOnboardingProgress();
  const [runTour, setRunTour] = useState(false);

  // Afficher le guide si pas encore vu
  useEffect(() => {
    if (shouldShowCessionSelectOrderHelp && !isLoadingOrders) {
      const timer = setTimeout(() => setRunTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowCessionSelectOrderHelp, isLoadingOrders]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      markHelpAsSeen('cession_select_order_help_seen');
    }
  };

  const steps: Step[] = [
    {
      target: '#repair-order-selector',
      content: 'Choisissez l\'ordre de réparation pour créer la cession de créance.',
      disableBeacon: true,
      placement: 'bottom',
    },
  ];

  const formatRepairOrderDisplay = (order: any) => {
    const clientName = order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non assigné';
    
    // Utiliser uniquement les relations car_brands / car_models (pas de colonnes vehicles.brand/model)
    let vehicleInfo = 'Véhicule non assigné';
    if (order.vehicles) {
      const brand = order.vehicles.car_brands?.name || 'Marque inconnue';
      const model = order.vehicles.car_models?.name || 'Modèle inconnu';
      const licensePlate = order.vehicles.license_plate || '';
      vehicleInfo = `${brand} ${model} - ${licensePlate}`;
    }
    
    const orderDate = order.created_at ? format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr }) : '';
    
    return `Ordre n°${order.reference} du ${orderDate} - ${clientName} - ${vehicleInfo}`;
  };

  // Filtrer les ordres par type de client si spécifié
  const filteredOrders = filterByClientType 
    ? (orders || []).filter(order => order.clients?.client_type === filterByClientType)
    : orders || [];

  // Préparer les options pour SearchableSelect
  const repairOrderOptions = filteredOrders.map(order => ({
    value: order.id,
    label: formatRepairOrderDisplay(order)
  }));

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            zIndex: 10000,
          },
        }}
        locale={{
          back: 'Retour',
          close: 'Fermer',
          last: 'Terminer',
          next: 'Suivant',
          skip: 'Passer',
        }}
      />
      
      <div id="repair-order-selector" className="space-y-2">
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
    </>
  );
};
