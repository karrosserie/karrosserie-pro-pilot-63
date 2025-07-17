import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Credit } from '@/services/supabase/credits';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DefaultCreditPreview from './templates/DefaultCreditPreview';
import AlternativeCreditPreview from './templates/AlternativeCreditPreview';

interface CreditViewerModalProps {
  credit: Credit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreditViewerModal = ({ credit, open, onOpenChange }: CreditViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  // Récupérer les données client, véhicule et facture depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!credit) return;

      try {
        // Récupérer les données de la facture associée si elle existe
        if (credit.invoice_id) {
          const { data: invoice } = await supabase
            .from('invoices')
            .select(`
              *,
              clients(*),
              vehicles(*,
                car_brands(name),
                car_models(name)
              )
            `)
            .eq('id', credit.invoice_id)
            .single();
          
          if (invoice) {
            setInvoiceData(invoice);
            setClientData(invoice.clients);
            setVehicleData(invoice.vehicles);
          }
        }

        // Si pas de facture associée, récupérer les données via les credits joints
        if (!credit.invoice_id && credit.clients) {
          setClientData(credit.clients);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && credit) {
      fetchRelatedData();
    }
  }, [credit, open]);

  if (!credit) return null;

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

  // Parser les données des items de l'avoir
  let items = [];
  try {
    if (credit.items_data) {
      const parsedItems = typeof credit.items_data === 'string' 
        ? JSON.parse(credit.items_data) 
        : credit.items_data;
      items = Array.isArray(parsedItems) ? parsedItems : [];
    }
  } catch (e) {
    console.error('Error parsing items data:', e);
  }

  // Préparer les données pour les composants de template
  const creditData = {
    number: credit.reference,
    invoiceNumber: invoiceData?.reference || undefined,
    billingDate: formatDateFr(credit.created_at),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${(credit.amount || 0).toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(credit.created_at),
    status: credit.status || 'En attente',
    notes: credit.notes || undefined
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
  const processedItems = items.map((item: any) => ({
    ref: item.ref || '',
    description: item.description || item.label || '',
    quantity: item.quantity || 1,
    discount: item.discount || 0,
    unitPrice: item.unit_price || item.unitCost || item.price || 0,
    vat: item.vat || 20,
    totalHT: (item.unit_price || item.unitCost || item.price || 0) * (item.quantity || 1) * (1 - (item.discount || 0) / 100),
    totalTTC: (item.unit_price || item.unitCost || item.price || 0) * (item.quantity || 1) * (1 - (item.discount || 0) / 100) * (1 + (item.vat || 20) / 100)
  }));

  // Calcul des totaux
  const subtotalHT = processedItems.reduce((sum, item) => sum + item.totalHT, 0);
  const totalVAT = processedItems.reduce((sum, item) => sum + (item.totalHT * item.vat / 100), 0);
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
            <DefaultCreditPreview 
              companyData={companyData}
              creditData={creditData}
              clientData={clientDataForTemplate}
              items={processedItems}
              totals={totalsData}
            />
          ) : (
            <AlternativeCreditPreview 
              companyData={companyData}
              creditData={creditData}
              clientData={clientDataForTemplate}
              items={processedItems}
              totals={totalsData}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditViewerModal;