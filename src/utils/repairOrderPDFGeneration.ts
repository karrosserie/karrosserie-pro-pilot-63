import { pdf } from '@react-pdf/renderer';
import { RepairOrder } from '@/services/supabase/repair-orders';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { supabase } from '@/integrations/supabase/client';
import { clientsService } from '@/services/supabase/clients';

export const prepareRepairOrderDataForPDF = async (repairOrder: RepairOrder, companyData: any) => {
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

    // Récupérer les données du client
    let clientData = null;
    if (repairOrder.client_id) {
      try {
        const client = await clientsService.getById(repairOrder.client_id);
        clientData = {
          clientName: `${client.first_name} ${client.last_name}`,
          address: client.address || '',
          postalCode: client.postal_code || '',
          city: client.city || '',
          email: client.email || '',
          phone: client.phone || ''
        };
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    }

    // Récupérer les données du véhicule
    let vehicleData = null;
    if (repairOrder.vehicle_id) {
      try {
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
          vehicleData = {
            vehicle: `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim(),
            licensePlate: vehicle.license_plate || '',
            mileage: vehicle.mileage ? vehicle.mileage.toLocaleString() + ' km' : '',
            start_date: repairOrder.start_date,
            end_date: repairOrder.end_date
          };
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
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
    const repairOrderData = {
      ...repairOrder,
      date: repairOrder.created_at ? new Date(repairOrder.created_at).toLocaleDateString('fr-FR') : '',
      orderDate: repairOrder.order_date ? new Date(repairOrder.order_date).toLocaleDateString('fr-FR') : ''
    };

    // Parser les données des items
    let items: any[] = [];
    try {
      const repairs = repairOrder.repairs_data ? JSON.parse(repairOrder.repairs_data as string) : [];
      const parts = repairOrder.parts_data ? JSON.parse(repairOrder.parts_data as string) : [];
      items = [...repairs, ...parts];
      console.log('Repair order items parsed:', items);
    } catch (error) {
      console.error('Error parsing repair order items:', error);
    }

    // Parser les remises globales - support string et array
    let discounts: any[] = [];
    try {
      if (typeof (repairOrder as any).discounts_data === 'string') {
        discounts = JSON.parse((repairOrder as any).discounts_data);
      } else if (Array.isArray((repairOrder as any).discounts_data)) {
        discounts = (repairOrder as any).discounts_data;
      }
      console.log('Repair order discounts parsed:', discounts);
    } catch (error) {
      console.error('Error parsing repair order discounts:', error);
    }

    // Calculer le total des remises globales
    const globalDiscountTotal = discounts.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    // Calculer les totaux - utiliser directement le total calculé de chaque item
    const totals = items.reduce((acc, item) => {
      const itemTotal = parseFloat(item.total) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const unitCost = parseFloat(item.unitCost) || 0;
      const vat = parseFloat(item.vat) || 20;
      
      console.log('Processing repair order item:', item, { itemTotal, quantity, unitCost, vat });
      
      // Utiliser le total déjà calculé
      const totalTTC = itemTotal;
      const totalHT = totalTTC / (1 + vat / 100);
      const vatAmount = totalTTC - totalHT;

      acc.subtotalHT += totalHT;
      acc.totalVAT += vatAmount;
      acc.total += totalTTC;

      return acc;
    }, { subtotalHT: 0, totalVAT: 0, total: 0 });

    // Appliquer les remises globales au total
    totals.total = totals.total - globalDiscountTotal;
    
    console.log('Repair order totals calculated:', totals, 'Global discounts:', globalDiscountTotal);

    return {
      repairOrder: {
        ...repairOrder,
        clients: clientData ? {
          first_name: clientData.clientName.split(' ')[0] || '',
          last_name: clientData.clientName.split(' ').slice(1).join(' ') || '',
          address: clientData.address,
          postal_code: clientData.postalCode,
          city: clientData.city
        } : null,
        vehicles: vehicleData ? {
          car_brands: { name: vehicleData.vehicle.split(' ')[0] || '' },
          car_models: { name: vehicleData.vehicle.split(' ').slice(1).join(' ') || '' },
          license_plate: vehicleData.licensePlate
        } : null
      },
      companyData: finalCompanyData,
      template,
      repairOrderData,
      signatureData: {
        signature: repairOrder.client_signature || null,
        clientName: repairOrder.client_name_signature || '',
        signatureDate: repairOrder.signature_date || null
      },
      clientData: {
        number: repairOrder.reference,
        name: clientData?.clientName || '',
        phone: clientData?.phone || '',
        email: clientData?.email || '',
        address: clientData?.address || '',
        city: `${clientData?.postalCode || ''} ${clientData?.city || ''}`.trim(),
        licensePlate: vehicleData?.licensePlate || '',
        mileage: vehicleData?.mileage || '',
        vehicle: vehicleData?.vehicle || '',
        billingDate: repairOrder.created_at ? new Date(repairOrder.created_at).toLocaleDateString('fr-FR') : '',
        notes: repairOrder.notes || '',
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
          globalDiscount: globalDiscountTotal > 0 ? `${globalDiscountTotal.toFixed(2).replace('.', ',')} €` : undefined,
          totalTTC: `${totals.total.toFixed(2).replace('.', ',')} €`,
          subtotal: `${totals.subtotalHT.toFixed(2).replace('.', ',')} €`,
          vat: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
          total: `${totals.total.toFixed(2).replace('.', ',')} €`
        }
      },
      vehicleData,
      items,
      totals
    };
  } catch (error) {
    console.error('Error preparing repair order data for PDF:', error);
    throw error;
  }
};

export const generateRepairOrderPDFBlob = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    const data = await prepareRepairOrderDataForPDF(repairOrder, companyData);
    
    // Adapter l'ordre de réparation au format Invoice pour le PDF
    const invoiceData = {
      ...data.repairOrder,
      amount: data.totals.total,
      date: data.repairOrder.created_at,
      due_date: data.repairOrder.created_at,
      repairs_data: Array.isArray(data.repairOrder.repairs_data) ? data.repairOrder.repairs_data : [],
      parts_data: Array.isArray(data.repairOrder.parts_data) ? data.repairOrder.parts_data : []
    } as any;

    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      receipts: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
      signatureData: data.signatureData,
      template: data.template,
      documentType: 'repair_order'
    });
    
    // Générer et retourner le blob PDF
    const asPdf = pdf(doc);
    return await asPdf.toBlob();
  } catch (error) {
    console.error('Erreur lors de la génération du blob PDF ordre de réparation:', error);
    throw error;
  }
};

export const generateRepairOrderPDFWithTemplate = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    const data = await prepareRepairOrderDataForPDF(repairOrder, companyData);
    
    // Adapter l'ordre de réparation au format Invoice pour le PDF
    const invoiceData = {
      ...data.repairOrder,
      amount: data.totals.total,
      date: data.repairOrder.created_at,
      due_date: data.repairOrder.created_at,
      repairs_data: Array.isArray(data.repairOrder.repairs_data) ? data.repairOrder.repairs_data : [],
      parts_data: Array.isArray(data.repairOrder.parts_data) ? data.repairOrder.parts_data : []
    } as any;

    console.log('Creating PDF with documentType: repair_order');
    console.log('Company data for PDF:', data.companyData);
    console.log('Client data for PDF:', data.clientData);

    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      receipts: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
      signatureData: data.signatureData,
      template: data.template,
      documentType: 'repair_order'
    });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer un nom de fichier unique
    const filename = `Ordre_reparation_${repairOrder.reference}_${new Date().toISOString().split('T')[0]}.pdf`;
    
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

export const printRepairOrderPDFWithTemplate = async (repairOrder: RepairOrder, companyData: any) => {
  try {
    const data = await prepareRepairOrderDataForPDF(repairOrder, companyData);
    
    // Adapter l'ordre de réparation au format Invoice pour le PDF
    const invoiceData = {
      ...data.repairOrder,
      amount: data.totals.total,
      date: data.repairOrder.created_at,
      due_date: data.repairOrder.created_at,
      repairs_data: Array.isArray(data.repairOrder.repairs_data) ? data.repairOrder.repairs_data : [],
      parts_data: Array.isArray(data.repairOrder.parts_data) ? data.repairOrder.parts_data : []
    } as any;

    console.log('Creating PDF for print with documentType: repair_order');
    
    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      receipts: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
      signatureData: data.signatureData,
      template: data.template,
      documentType: 'repair_order'
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