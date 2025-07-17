import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Invoice } from '@/services/supabase/invoices';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DefaultInvoicePreview from './templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from './templates/AlternativeInvoicePreview';

interface InvoiceViewerModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceViewerModal = ({ invoice, open, onOpenChange }: InvoiceViewerModalProps) => {
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  
  // Récupérer les données client et véhicule depuis la base de données
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!invoice) return;

      try {
        // Récupérer les données client
        if (invoice.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', invoice.client_id)
            .single();
          
          if (client) {
            setClientData(client);
          }
        }

        // Récupérer les données véhicule avec les informations de marque et modèle
        if (invoice.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              *,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', invoice.vehicle_id)
            .single();
          
          if (vehicle) {
            setVehicleData(vehicle);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (open && invoice) {
      fetchRelatedData();
    }
  }, [invoice, open]);

  if (!invoice) return null;

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

  // Préparer les données pour les composants de template
  const invoiceData = {
    number: invoice.reference,
    claimNumber: invoice.claim_number || undefined,
    billingDate: formatDateFr(invoice.date),
    dueDate: formatDateFr(invoice.due_date),
    vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
    licensePlate: vehicleData?.license_plate || undefined,
    mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
    amountDue: `${invoice.amount.toFixed(2).replace('.', ',')} €`,
    date: formatDateFr(invoice.date),
    notes: invoice.notes || undefined,
    payment_details: invoice.payment_details || undefined
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
  if (invoice.repairs_data) {
    const repairs = Array.isArray(invoice.repairs_data) ? invoice.repairs_data : [];
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
  }

  if (invoice.parts_data) {
    const parts = Array.isArray(invoice.parts_data) ? invoice.parts_data : [];
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
  }

  const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
  const totalsData = {
    subtotal: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
    vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
    total: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`,
    totalHT: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
    totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
    totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`,
    totalTTC: `${totals.finalTotal.toFixed(2).replace('.', ',')} €`
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="w-full h-full">
          {template === 'default' ? (
            <DefaultInvoicePreview 
              companyData={companyData}
              invoiceData={invoiceData}
              clientData={clientDataForTemplate}
              items={items}
              totals={totalsData}
            />
          ) : (
            <AlternativeInvoicePreview 
              companyData={companyData}
              invoiceData={invoiceData}
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

export default InvoiceViewerModal;