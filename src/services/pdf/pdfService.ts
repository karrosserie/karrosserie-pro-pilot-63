import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';
import { CessionPDF } from './CessionPDFGenerator';
import { Cession } from '@/services/supabase/cessions';
import { prepareRepairOrderDataForPDF } from '@/utils/repairOrderPDFGeneration';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export const generateAndUploadCessionPDF = async (
  cession: Cession,
  companyData: any,
  selectedInsuranceCompany: any,
  clientData?: any,
  vehicleData?: any
): Promise<string> => {
  try {
    // Générer le document InvoicePDF pour l'ordre de réparation si disponible
    let repairOrderPDFDocument = null;
    if (cession.repair_orders) {
      try {
        // Préparer les données client depuis la cession
        const repairOrderClient = cession.repair_orders.clients;
        const repairOrderVehicle = cession.repair_orders.vehicles;
        
        // Formater les données client comme attendu par InvoicePDF
        const formattedClientData = repairOrderClient ? {
          number: cession.repair_orders.reference,
          name: `${repairOrderClient.first_name} ${repairOrderClient.last_name}`,
          phone: repairOrderClient.phone || '',
          email: repairOrderClient.email || '',
          address: repairOrderClient.address || '',
          city: `${repairOrderClient.postal_code || ''} ${repairOrderClient.city || ''}`.trim(),
        } : null;

        // Formater les données véhicule comme attendu par InvoicePDF
        const formattedVehicleData = repairOrderVehicle ? {
          vehicle: `${repairOrderVehicle.car_brands?.name || ''} ${repairOrderVehicle.car_models?.name || ''}`.trim(),
          licensePlate: repairOrderVehicle.license_plate || '',
          mileage: repairOrderVehicle.mileage ? repairOrderVehicle.mileage.toLocaleString() + ' km' : '',
        } : null;

        // Parser les données des réparations et pièces
        let repairs = [];
        let parts = [];
        try {
          repairs = cession.repair_orders.repairs_data ? JSON.parse(cession.repair_orders.repairs_data as string) : [];
          parts = cession.repair_orders.parts_data ? JSON.parse(cession.repair_orders.parts_data as string) : [];
        } catch (error) {
          console.error('Error parsing repair/parts data:', error);
        }

        // Calculer les totaux
        const allItems = [...repairs, ...parts];
        const totals = allItems.reduce((acc, item) => {
          const total = parseFloat(item.total) || 0;
          acc.total += total;
          return acc;
        }, { total: 0 });

        const invoiceData = {
          ...cession.repair_orders,
          amount: totals.total,
          date: cession.repair_orders.created_at,
          due_date: cession.repair_orders.created_at,
          repairs_data: repairs,
          parts_data: parts
        } as any;

        repairOrderPDFDocument = InvoicePDF({ 
          invoice: invoiceData, 
          companyData: companyData, 
          receipts: [],
          clientData: formattedClientData,
          vehicleData: formattedVehicleData,
          template: 'default',
          documentType: 'repair_order'
        });
      } catch (error) {
        console.error('Erreur lors de la génération du PDF ordre de réparation:', error);
      }
    }

    // Generate PDF blob
    const pdfBlob = await pdf(
      CessionPDF({
        cession,
        companyData,
        selectedInsuranceCompany,
        clientData,
        vehicleData,
        repairOrderPDFDocument
      })
    ).toBlob();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Create filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cession-${cession.reference}-${timestamp}.pdf`;
    const filePath = `${user.id}/cessions/${filename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      throw new Error(`Erreur lors du téléchargement du PDF: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};