import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { calculateOrderAmount } from './utils/orderCalculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DefaultRepairOrderPreview from './templates/DefaultRepairOrderPreview';
import AlternativeRepairOrderPreview from './templates/AlternativeRepairOrderPreview';

interface RepairOrderViewerModalProps {
  repairOrder: RepairOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RepairOrderViewerModal = ({ repairOrder, open, onOpenChange }: RepairOrderViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  
  // Récupérer les données client et véhicule depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!repairOrder) return;

      try {
        // Récupérer les données client
        if (repairOrder.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', repairOrder.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (repairOrder.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', repairOrder.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && repairOrder) {
      fetchRelatedData();
    }
  }, [repairOrder, open]);

  if (!repairOrder) return null;

  const template = preferences?.invoice_template || 'default';

  // Fonction pour formater les dates au format français dd/mm/yyyy
  const formatDateFr = (dateString: string | null | undefined) => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Parser les données JSON de l'ordre de réparation
  let repairs = [];
  let parts = [];
  let discounts = [];
  
  try {
    repairs = repairOrder.repairs_data ? 
      (Array.isArray(repairOrder.repairs_data) ? repairOrder.repairs_data : JSON.parse(repairOrder.repairs_data as string)) : [];
  } catch (e) {
    console.error('Error parsing repairs data:', e);
  }
  
  try {
    parts = repairOrder.parts_data ? 
      (Array.isArray(repairOrder.parts_data) ? repairOrder.parts_data : JSON.parse(repairOrder.parts_data as string)) : [];
  } catch (e) {
    console.error('Error parsing parts data:', e);
  }
  
  try {
    discounts = repairOrder.discounts_data ? 
      (Array.isArray(repairOrder.discounts_data) ? repairOrder.discounts_data : JSON.parse(repairOrder.discounts_data as string)) : [];
  } catch (e) {
    console.error('Error parsing discounts data:', e);
  }

  const totalAmount = calculateOrderAmount(repairOrder);

  // Préparer les données pour les composants de template
  const orderData = {
    number: repairOrder.reference,
    claimNumber: repairOrder.claim_number || undefined,
    orderDate: formatDateFr(repairOrder.order_date || repairOrder.created_at),
    signatureDate: formatDateFr(repairOrder.signature_date),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${totalAmount.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(repairOrder.created_at),
    reportNumber: repairOrder.report_number || undefined,
    policyNumber: repairOrder.policy_number || undefined,
    expertName: repairOrder.expert_name || undefined,
    incidentDate: formatDateFr(repairOrder.incident_date),
    reportDate: formatDateFr(repairOrder.report_date),
    status: repairOrder.status || 'En attente',
    notes: repairOrder.notes || undefined
  };

  // Préparer les données client pour le template
  const clientDataForTemplate = {
    name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : undefined,
    address: clientData?.address || undefined,
    city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : undefined,
    phone: clientData?.phone || undefined,
    email: clientData?.email || undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined
  };

  // Convertir les données des items
  const items = [];
  items.push(...repairs.map((repair: any) => ({
    ref: repair.ref || '',
    description: repair.description || repair.label || '',
    quantity: repair.quantity || 1,
    discount: repair.discount || 0,
    unitPrice: repair.unitCost || repair.price || 0,
    vat: repair.vat || 20,
    totalHT: (repair.unitCost || repair.price || 0) * (repair.quantity || 1) * (1 - (repair.discount || 0) / 100),
    totalTTC: (repair.unitCost || repair.price || 0) * (repair.quantity || 1) * (1 - (repair.discount || 0) / 100) * (1 + (repair.vat || 20) / 100)
  })));

  items.push(...parts.map((part: any) => ({
    ref: part.ref || '',
    description: part.description || part.label || '',
    quantity: part.quantity || 1,
    discount: part.discount || 0,
    unitPrice: part.unitCost || part.price || 0,
    vat: part.vat || 20,
    totalHT: (part.unitCost || part.price || 0) * (part.quantity || 1) * (1 - (part.discount || 0) / 100),
    totalTTC: (part.unitCost || part.price || 0) * (part.quantity || 1) * (1 - (part.discount || 0) / 100) * (1 + (part.vat || 20) / 100)
  })));

  // Calcul des totaux
  const subtotalHT = items.reduce((sum, item) => sum + item.totalHT, 0);
  const totalVAT = items.reduce((sum, item) => sum + (item.totalHT * item.vat / 100), 0);
  const totalTTC = subtotalHT + totalVAT;

  const totalsData = {
    subtotal: `${subtotalHT.toFixed(2).replace('.', ',')} €`,
    vat: `${totalVAT.toFixed(2).replace('.', ',')} €`,
    total: `${totalTTC.toFixed(2).replace('.', ',')} €`,
    totalHT: `${subtotalHT.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totalVAT.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totalTTC.toFixed(2).replace('.', ',')} €`
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="w-full h-full">
          {template === 'default' ? (
            <DefaultRepairOrderPreview 
              companyData={companyData}
              orderData={orderData}
              clientData={clientDataForTemplate}
              items={items}
              totals={totalsData}
            />
          ) : (
            <AlternativeRepairOrderPreview 
              companyData={companyData}
              orderData={orderData}
              clientData={clientDataForTemplate}
              items={items}
              totals={totalsData}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepairOrderViewerModal;