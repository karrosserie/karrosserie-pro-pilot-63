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
        const { data: company } = await supabase
          .from('company_info')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
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
            start_date: vehicle.start_date,
            end_date: vehicle.end_date
          };
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    }

    // Récupérer les préférences utilisateur pour le template
    let template = 'default';
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('invoice_template')
          .eq('user_id', user.id)
          .single();
        
        template = preferences?.invoice_template || 'default';
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
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
    } catch (error) {
      console.error('Error parsing repair order items:', error);
    }

    // Calculer les totaux
    const totals = items.reduce((acc, item) => {
      const unitCost = parseFloat(item.unitCost) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const discount = parseFloat(item.discount) || 0;
      const vat = parseFloat(item.vat) || 0;
      
      const subtotal = unitCost * quantity;
      const afterDiscount = subtotal - discount;
      const vatAmount = (afterDiscount * vat) / 100;
      const total = afterDiscount + vatAmount;

      acc.subtotalHT += afterDiscount;
      acc.totalVAT += vatAmount;
      acc.total += total;

      return acc;
    }, { subtotalHT: 0, totalVAT: 0, total: 0 });

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
        items: items.map(item => ({
          ref: item.ref || '',
          description: item.description || '',
          quantity: item.quantity || 0,
          discount: item.discount || 0,
          unitPrice: parseFloat(item.unitCost) || 0,
          vat: item.vat || 20,
          totalHT: ((parseFloat(item.unitCost) || 0) * (item.quantity || 0)) - (item.discount || 0),
          totalTTC: ((parseFloat(item.unitCost) || 0) * (item.quantity || 0)) - (item.discount || 0) + (((parseFloat(item.unitCost) || 0) * (item.quantity || 0) - (item.discount || 0)) * (item.vat || 20) / 100)
        })),
        totals: {
          totalHT: `${totals.subtotalHT.toFixed(2).replace('.', ',')} €`,
          totalVAT: `${totals.totalVAT.toFixed(2).replace('.', ',')} €`,
          totalDiscount: `${items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0).toFixed(2).replace('.', ',')} €`,
          totalTTC: `${totals.total.toFixed(2).replace('.', ',')} €`
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

    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      receipts: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
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

    const doc = InvoicePDF({ 
      invoice: invoiceData, 
      companyData: data.companyData, 
      receipts: [],
      clientData: data.clientData,
      vehicleData: data.vehicleData,
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