import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/services/supabase/invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export const prepareInvoiceDataForPDF = async (invoice: Invoice, companyData: any) => {
  try {
    let clientData = null;
    let vehicleData = null;
    let receiptsData = [];

    // Récupérer les données client - exactement comme dans InvoiceViewerModal
    if (invoice.client_id) {
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.client_id)
        .single();
      
      if (client) {
        clientData = client;
      }
    }

    // Récupérer les données véhicule avec les informations de marque et modèle - exactement comme dans InvoiceViewerModal
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
        vehicleData = vehicle;
      }
    }

    // Récupérer les encaissements liés à cette facture
    const { data: receipts } = await supabase
      .from('receipts')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('date', { ascending: true });
    
    if (receipts) {
      receiptsData = receipts;
    }

    // Récupérer les préférences d'entreprise pour le template
    let template = 'default';
    try {
      // D'abord récupérer l'ID de l'entreprise de l'utilisateur
      const companyId = invoice.company_id;

      if (companyId) {
        const { data: preferences } = await supabase
          .from('company_preferences')
          .select('invoice_template')
          .eq('company_id', companyId)
          .single();
        
        template = preferences?.invoice_template || 'default';
      }
    } catch (error) {
      console.error('Error fetching company preferences:', error);
    }

    // Fonction pour formater les dates au format français dd/mm/yyyy - exactement comme dans InvoiceViewerModal
    const formatDateFr = (dateString: string | null | undefined) => {
      if (!dateString) return undefined;
      try {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy', { locale: fr });
      } catch {
        return dateString;
      }
    };

    // Préparer les données pour les composants de template - exactement comme dans InvoiceViewerModal
    const invoiceData = {
      number: invoice.reference,
      claimNumber: invoice.claim_number || undefined,
      billingDate: formatDateFr(invoice.date),
      dueDate: formatDateFr(invoice.due_date),
      vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
      licensePlate: vehicleData?.license_plate || undefined,
      mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
      amountDue: `${invoice.amount.toFixed(2).replace('.', ',')} €`,
      date: formatDateFr(invoice.date)
    };

    // Préparer les données client pour le template - exactement comme dans InvoiceViewerModal
    const clientDataForTemplate = {
      name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : undefined,
      address: clientData?.address || undefined,
      city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : undefined,
      phone: clientData?.phone || undefined,
      email: clientData?.email || undefined,
      licensePlate: vehicleData?.license_plate || undefined,
      mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : undefined,
      vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : undefined,
      notes: invoice.notes || ''
    };

    // Convertir les données des items - exactement comme dans InvoiceViewerModal
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

    // Parser les remises globales - support string et array
    let discounts: any[] = [];
    let globalDiscountTotal = 0;
    try {
      if (typeof (invoice as any).discounts_data === 'string') {
        discounts = JSON.parse((invoice as any).discounts_data);
      } else if (Array.isArray((invoice as any).discounts_data)) {
        discounts = (invoice as any).discounts_data;
      }
      globalDiscountTotal = discounts.reduce((sum, d) => {
        const discountAmount = parseFloat(d.amount ?? d.finalAmount ?? 0);
        return sum + discountAmount;
      }, 0);
      console.log('Invoice discounts parsed:', discounts, 'Total:', globalDiscountTotal);
    } catch (error) {
      console.error('Error parsing invoice discounts:', error);
    }

    const totals = calculateInvoiceTotals(invoice.repairs_data, invoice.parts_data);
    
    // Calculer le montant total payé
    const totalPaidAmount = receiptsData.reduce((sum, receipt) => sum + receipt.amount, 0);
    const remainingAmount = invoice.amount - totalPaidAmount - globalDiscountTotal;
    
    // Vérifier si la facture est entièrement payée (via receipts OU statut "Payée")
    const isPaid = (remainingAmount <= 0 && totalPaidAmount > 0) || invoice.status === 'Payée';
    
    const totalsData = {
      subtotal: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
      vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
      globalDiscount: globalDiscountTotal > 0 ? `${globalDiscountTotal.toFixed(2).replace('.', ',')} €` : undefined,
      total: `${(totals.finalTotal - globalDiscountTotal).toFixed(2).replace('.', ',')} €`,
      totalHT: `${totals.subtotalAfterDiscount.toFixed(2).replace('.', ',')} €`,
      totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
      totalDiscount: `${totals.totalDiscount.toFixed(2).replace('.', ',')} €`,
      totalTTC: `${(totals.finalTotal - globalDiscountTotal).toFixed(2).replace('.', ',')} €`
    };

    return {
      template,
      companyData,
      invoiceData,
      clientData: clientDataForTemplate,
      items,
      totals: totalsData,
      receipts: receiptsData,
      totalPaidAmount,
      remainingAmount,
      isPaid
    };
  } catch (error) {
    console.error('Erreur lors de la préparation des données:', error);
    throw error;
  }
};

export const generateInvoicePDFBlob = async (invoice: Invoice, companyData: any) => {
  try {
    const data = await prepareInvoiceDataForPDF(invoice, companyData);
    
    // Adapter les données pour le composant PDF
    const pdfData = {
      ...data.clientData,
      number: data.invoiceData.number,
      billingDate: data.invoiceData.billingDate,
      dueDate: data.invoiceData.dueDate,
      claimNumber: data.invoiceData.claimNumber,
      vehicle: data.invoiceData.vehicle,
      licensePlate: data.invoiceData.licensePlate,
      mileage: data.invoiceData.mileage,
      notes: invoice.notes || '',
      items: data.items,
      totals: data.totals,
      amountDue: `${data.remainingAmount.toFixed(2).replace('.', ',')} €`
    };
    
    const doc = InvoicePDF({ 
      invoice, 
      companyData: data.companyData, 
      receipts: data.receipts,
      clientData: pdfData,
      vehicleData: null,
      template: data.template,
      isPaid: data.isPaid
    });
    
    // Générer et retourner le blob PDF
    const asPdf = pdf(doc);
    return await asPdf.toBlob();
  } catch (error) {
    console.error('Erreur lors de la génération du blob PDF:', error);
    throw error;
  }
};

export const generateInvoicePDFWithTemplate = async (invoice: Invoice, companyData: any) => {
  try {
    const data = await prepareInvoiceDataForPDF(invoice, companyData);
    
    // Adapter les données pour le composant PDF
    const pdfData = {
      ...data.clientData,
      number: data.invoiceData.number,
      billingDate: data.invoiceData.billingDate,
      dueDate: data.invoiceData.dueDate,
      claimNumber: data.invoiceData.claimNumber,
      vehicle: data.invoiceData.vehicle,
      licensePlate: data.invoiceData.licensePlate,
      mileage: data.invoiceData.mileage,
      notes: invoice.notes || '',
      items: data.items,
      totals: data.totals,
      amountDue: `${data.remainingAmount.toFixed(2).replace('.', ',')} €`
    };
    
    const doc = InvoicePDF({ 
      invoice, 
      companyData: data.companyData, 
      receipts: data.receipts,
      clientData: pdfData,
      vehicleData: null,
      template: data.template,
      isPaid: data.isPaid
    });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer un nom de fichier unique
    const filename = `Facture_${invoice.reference}.pdf`;
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
};

export const printInvoicePDFWithTemplate = async (invoice: Invoice, companyData: any) => {
  try {
    const data = await prepareInvoiceDataForPDF(invoice, companyData);
    
    // Adapter les données pour le composant PDF
    const pdfData = {
      ...data.clientData,
      number: data.invoiceData.number,
      billingDate: data.invoiceData.billingDate,
      dueDate: data.invoiceData.dueDate,
      claimNumber: data.invoiceData.claimNumber,
      vehicle: data.invoiceData.vehicle,
      licensePlate: data.invoiceData.licensePlate,
      mileage: data.invoiceData.mileage,
      notes: invoice.notes || '',
      items: data.items,
      totals: data.totals,
      amountDue: `${data.remainingAmount.toFixed(2).replace('.', ',')} €`
    };
    
    const doc = InvoicePDF({ 
      invoice, 
      companyData: data.companyData, 
      receipts: data.receipts,
      clientData: pdfData,
      vehicleData: null,
      template: data.template,
      isPaid: data.isPaid
    });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob);
    
    // Ouvrir le PDF dans un nouvel onglet pour impression
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        // Nettoyer l'URL après un délai
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'ouverture du PDF pour impression:', error);
    return { success: false, error: error.message };
  }
};