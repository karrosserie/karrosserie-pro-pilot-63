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
  console.log('=== STARTING PDF SERVICE ===');
  console.log('Cession passed to pdfService:', JSON.stringify(cession, null, 2));
  console.log('Company data:', JSON.stringify(companyData, null, 2));
  console.log('Client data passed to pdfService:', JSON.stringify(clientData, null, 2));
  console.log('Vehicle data passed to pdfService:', JSON.stringify(vehicleData, null, 2));
  
  try {
    // Générer le composant PDF de l'ordre de réparation si disponible
    let repairOrderPDFComponent: React.ReactElement | null = null;
    if (cession.repair_orders) {
      try {
        console.log('=== CESSION PDF GENERATION ===');
        console.log('Generating repair order PDF component for cession:', JSON.stringify(cession.repair_orders, null, 2));
        console.log('Client data passed to PDF service:', JSON.stringify(clientData, null, 2));
        console.log('Vehicle data passed to PDF service:', JSON.stringify(vehicleData, null, 2));
        
        // Préparer les données de l'ordre de réparation depuis les données de la cession
        const repairOrderForPDF = {
          id: cession.repair_order_id,
          reference: cession.repair_orders.reference,
          created_at: cession.repair_orders.created_at,
          client_id: null, // Nous avons les données directement
          vehicle_id: null, // Nous avons les données directement
          parts_data: cession.repair_orders.parts_data,
          repairs_data: cession.repair_orders.repairs_data,
          user_id: cession.user_id
        };
        
        console.log('Prepared repair order for PDF:', JSON.stringify(repairOrderForPDF, null, 2));
        
        const data = await prepareRepairOrderDataForPDF(repairOrderForPDF as any, companyData);
        console.log('Prepared repair order data from function:', JSON.stringify(data, null, 2));
        
        // Surcharger les données client et véhicule avec celles de la cession si elles ne sont pas présentes
        const finalClientData = data.clientData || (cession.repair_orders.clients ? {
          clientName: `${cession.repair_orders.clients.first_name} ${cession.repair_orders.clients.last_name}`,
          address: cession.repair_orders.clients.address || '',
          postalCode: cession.repair_orders.clients.postal_code || '',
          city: cession.repair_orders.clients.city || '',
          email: cession.repair_orders.clients.email || '',
          phone: cession.repair_orders.clients.phone || ''
        } : null);
        
        const finalVehicleData = data.vehicleData || (cession.repair_orders.vehicles ? {
          licensePlate: cession.repair_orders.vehicles.license_plate,
          vin: cession.repair_orders.vehicles.vin,
          brandName: cession.repair_orders.vehicles.car_brands?.name,
          modelName: cession.repair_orders.vehicles.car_models?.name,
          year: null,
          mileage: cession.repair_orders.vehicles.mileage
        } : null);
        
        console.log('Final client data for PDF:', JSON.stringify(finalClientData, null, 2));
        console.log('Final vehicle data for PDF:', JSON.stringify(finalVehicleData, null, 2));
        
        const invoiceData = {
          ...data.repairOrder,
          amount: data.totals.total,
          date: data.repairOrder.created_at,
          due_date: data.repairOrder.created_at,
          repairs_data: Array.isArray(data.repairOrder.repairs_data) ? data.repairOrder.repairs_data : [],
          parts_data: Array.isArray(data.repairOrder.parts_data) ? data.repairOrder.parts_data : []
        } as any;

        console.log('Invoice data for PDF:', JSON.stringify(invoiceData, null, 2));

        // Créer le composant InvoicePDF pour l'ordre de réparation
        repairOrderPDFComponent = InvoicePDF({ 
          invoice: invoiceData, 
          companyData: data.companyData, 
          receipts: [],
          clientData: finalClientData,
          vehicleData: finalVehicleData,
          template: data.template,
          documentType: 'repair_order'
        });
        
        console.log('RepairOrder PDF component created successfully');
      } catch (error) {
        console.error('Erreur lors de la génération du composant PDF ordre de réparation:', error);
        console.error('Error stack:', error.stack);
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
        repairOrderPDFComponent
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