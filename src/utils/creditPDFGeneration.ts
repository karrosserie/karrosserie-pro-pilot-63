import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export const prepareCreditDataForPDF = async (credit: any, companyData: any) => {
  try {
    // Récupérer les données de l'entreprise si nécessaire
    let finalCompanyData = companyData;
    if (!finalCompanyData || Object.keys(finalCompanyData).length === 0) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get company through user_companies relationship
        const { data: userCompany } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .eq('active', true)
          .single();

        let company = null;
        if (userCompany) {
          const { data } = await supabase
            .from('company_info')
            .select('*')
            .eq('id', userCompany.company_id)
            .single();
          company = data;
        }
        
        finalCompanyData = company || {};
      }
    }

    // Récupérer la facture associée si elle existe
    let invoiceData = null;
    let clientData = null;
    let vehicleData = null;

    if (credit.invoice_id) {
      try {
        const { data: invoice } = await supabase
          .from('invoices')
          .select(`
            *,
            clients(*),
            vehicles(
              *,
              car_brands(name),
              car_models(name)
            )
          `)
          .eq('id', credit.invoice_id)
          .single();

        if (invoice) {
          invoiceData = invoice;
          clientData = invoice.clients;
          vehicleData = invoice.vehicles;
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    }

    // Récupérer les préférences d'entreprise pour le template
    let template = 'default';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // D'abord récupérer l'ID de l'entreprise de l'utilisateur
        const { data: userCompany } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .eq('active', true)
          .single();

        if (userCompany?.company_id) {
          const { data: preferences } = await supabase
            .from('company_preferences')
            .select('invoice_template')
            .eq('company_id', userCompany.company_id)
            .single();
          
          template = preferences?.invoice_template || 'default';
        }
      }
    } catch (error) {
      console.error('Error fetching company preferences:', error);
    }

    // Formater les dates
    const creditData = {
      ...credit,
      date: credit.created_at ? new Date(credit.created_at).toLocaleDateString('fr-FR') : ''
    };

    // Parser les données des items
    let items: any[] = [];
    try {
      if (credit.items_data) {
        items = Array.isArray(credit.items_data) ? credit.items_data : JSON.parse(credit.items_data as string);
      }
    } catch (error) {
      console.error('Error parsing credit items:', error);
    }

    // Calculer les totaux - utiliser directement le total calculé de chaque item
    const totals = items.reduce((acc, item) => {
      const itemTotal = parseFloat(item.total) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const unitCost = parseFloat(item.unitCost) || 0;
      const vat = parseFloat(item.vat) || 20;
      
      console.log('Processing credit item:', item, { itemTotal, quantity, unitCost, vat });
      
      // Utiliser le total déjà calculé
      const totalTTC = itemTotal;
      const totalHT = totalTTC / (1 + vat / 100);
      const vatAmount = totalTTC - totalHT;

      acc.subtotalHT += totalHT;
      acc.totalVAT += vatAmount;
      acc.total += totalTTC;

      return acc;
    }, { subtotalHT: 0, totalVAT: 0, total: 0 });
    
    console.log('Credit totals calculated:', totals);

    return {
      credit: {
        ...credit,
        clients: clientData,
        vehicles: vehicleData,
        invoice: invoiceData
      },
      companyData: finalCompanyData,
      template,
      creditData,
      clientData: {
        number: credit.reference,
        name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : '',
        phone: clientData?.phone || '',
        email: clientData?.email || '',
        address: clientData?.address || '',
        city: clientData ? `${clientData.postal_code || ''} ${clientData.city || ''}`.trim() : '',
        licensePlate: vehicleData?.license_plate || '',
        mileage: vehicleData?.mileage ? `${vehicleData.mileage.toLocaleString('fr-FR')} km` : '',
        vehicle: vehicleData ? `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim() : '',
        billingDate: credit.created_at ? new Date(credit.created_at).toLocaleDateString('fr-FR') : '',
        invoiceReference: invoiceData?.reference || 'N/A',
        notes: credit.notes || '',
        items: items.map(item => {
          const unitPrice = parseFloat(item.unitCost) || 0;
          const quantity = parseFloat(item.quantity) || 1;
          const discount = parseFloat(item.discount) || 0;
          const vat = parseFloat(item.vat) || 20;
          const totalTTC = parseFloat(item.total) || 0;
          const totalHT = totalTTC / (1 + vat / 100);
          
          return {
            ref: item.ref || '',
            description: item.description || '',
            quantity: quantity,
            discount: discount,
            unitPrice: unitPrice,
            vat: vat,
            totalHT: totalHT,
            totalTTC: totalTTC
          };
        }),
        totals: {
          totalHT: `${totals.subtotalHT.toFixed(2).replace('.', ',')} €`,
          totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
          totalDiscount: `${items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0).toFixed(2).replace('.', ',')} €`,
          totalTTC: `${totals.total.toFixed(2).replace('.', ',')} €`,
          subtotal: `${totals.subtotalHT.toFixed(2).replace('.', ',')} €`,
          vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
          total: `${totals.total.toFixed(2).replace('.', ',')} €`
        }
      },
      vehicleData: vehicleData ? {
        vehicle: `${vehicleData.car_brands?.name || ''} ${vehicleData.car_models?.name || ''}`.trim(),
        licensePlate: vehicleData.license_plate || '',
        mileage: vehicleData.mileage ? vehicleData.mileage.toLocaleString() + ' km' : ''
      } : null,
      items,
      totals
    };
  } catch (error) {
    console.error('Error preparing credit data for PDF:', error);
    throw error;
  }
};

export const generateCreditPDFWithTemplate = async (credit: any, companyData: any) => {
  try {
    const data = await prepareCreditDataForPDF(credit, companyData);
    
    // Adapter l'avoir au format Invoice pour le PDF
    const invoiceData = {
      ...data.credit,
      amount: data.credit.amount || data.totals.total,
      date: data.credit.created_at,
      due_date: data.credit.created_at,
      repairs_data: [],
      parts_data: [],
      reference: data.credit.reference
    } as any;

    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      payments: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
      template: data.template,
      documentType: 'credit'
    });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer un nom de fichier unique
    const filename = `Avoir_${credit.reference}_${new Date().toISOString().split('T')[0]}.pdf`;
    
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

export const printCreditPDFWithTemplate = async (credit: any, companyData: any) => {
  try {
    const data = await prepareCreditDataForPDF(credit, companyData);
    
    // Adapter l'avoir au format Invoice pour le PDF
    const invoiceData = {
      ...data.credit,
      amount: data.credit.amount || data.totals.total,
      date: data.credit.created_at,
      due_date: data.credit.created_at,
      repairs_data: [],
      parts_data: [],
      reference: data.credit.reference
    } as any;

    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      payments: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
      template: data.template,
      documentType: 'credit'
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
    console.error("Erreur lors de l'ouverture du PDF pour impression:", error);
    return { success: false, error: error.message };
  }
};