import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Quote } from '@/services/supabase/quotes';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { calculateGlobalTotals } from '@/components/quotes/form/utils/calculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DefaultQuotePreview from './templates/DefaultQuotePreview';
import AlternativeQuotePreview from './templates/AlternativeQuotePreview';

interface QuoteViewerModalProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteViewerModal = ({ quote, open, onOpenChange }: QuoteViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!quote) return;

      try {
        // Récupérer les données client
        if (quote.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', quote.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (quote.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', quote.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && quote) {
      fetchRelatedData();
    }
  }, [quote, open]);

  if (!quote) return null;

  const template = preferences?.invoice_template || 'default';

  const formatDateFr = (dateString: string | null | undefined) => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  let repairs = [];
  let parts = [];
  let discounts = [];
  
  try {
    repairs = quote.repairs_data ? JSON.parse(quote.repairs_data as string) : [];
  } catch (e) {
    console.error('Error parsing repairs data:', e);
  }
  
  try {
    parts = quote.parts_data ? JSON.parse(quote.parts_data as string) : [];
  } catch (e) {
    console.error('Error parsing parts data:', e);
  }
  
  try {
    discounts = quote.discounts_data ? JSON.parse(quote.discounts_data as string) : [];
  } catch (e) {
    console.error('Error parsing discounts data:', e);
  }

  const totals = calculateGlobalTotals(repairs, parts, discounts);

  const quoteData = {
    number: quote.reference,
    claimNumber: quote.claim_number || undefined,
    billingDate: formatDateFr(quote.created_at),
    validUntil: formatDateFr(quote.valid_until),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${totals.total.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(quote.created_at),
    reportNumber: quote.report_number || undefined,
    policyNumber: quote.policy_number || undefined,
    expertName: quote.expert_name || undefined,
    incidentDate: formatDateFr(quote.incident_date),
    reportDate: formatDateFr(quote.report_date)
  };

  const clientDataForTemplate = {
    name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : undefined,
    address: clientData?.address || undefined,
    city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : undefined,
    phone: clientData?.phone || undefined,
    email: clientData?.email || undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    notes: quote.notes || undefined
  };

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

  const totalsData = {
    subtotal: `${totals.subTotal.toFixed(2).replace('.', ',')} €`,
    vat: `${totals.totalVat.toFixed(2).replace('.', ',')} €`,
    total: `${totals.total.toFixed(2).replace('.', ',')} €`,
    totalHT: `${totals.subTotal.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totals.totalVat.toFixed(2).replace('.', ',')} €`,
    totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totals.total.toFixed(2).replace('.', ',')} €`
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="w-full h-full">
          {template === 'default' ? (
            <DefaultQuotePreview 
              companyData={companyData}
              quoteData={quoteData}
              clientData={clientDataForTemplate}
              items={items}
              totals={totalsData}
            />
          ) : (
            <AlternativeQuotePreview 
              companyData={companyData}
              quoteData={quoteData}
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

export default QuoteViewerModal;
