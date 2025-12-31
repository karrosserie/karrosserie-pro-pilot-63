import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { RepairOrder } from '@/services/supabase/repair-orders';
import NewRepairOrderPDF from '@/services/pdf/NewRepairOrderPDF';
import { supabase } from '@/integrations/supabase/client';
import { calculateInvoiceTotals } from '@/utils/invoiceCalculations';

export const generateRepairOrderSignaturePDF = async (
  repairOrder: RepairOrder,
  companyData: any,
  clientData: any,
  _showItemsDetails: boolean = true
): Promise<string> => {
  try {
    console.log('Generating repair order signature PDF for:', repairOrder.id);

    // Calculer les totaux
    const totals = calculateInvoiceTotals(repairOrder.repairs_data, repairOrder.parts_data);

    const formattedClientData = {
      name: clientData ? `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() : '',
      address: clientData?.address,
      city: `${clientData?.postal_code || ''} ${clientData?.city || ''}`.trim(),
      phone: clientData?.phone,
      email: clientData?.email,
    };

    const vehicleData = {
      start_date: repairOrder.start_date,
      end_date: repairOrder.end_date,
      brand: repairOrder.vehicles?.car_brands?.name || '',
      model: repairOrder.vehicles?.car_models?.name || '',
      licensePlate: repairOrder.vehicles?.license_plate || '',
      mileage: '',
    };

    const orderData = {
      reference: repairOrder.reference,
      date: repairOrder.created_at,
      amount: totals.finalTotal,
      notes: repairOrder.notes,
    };

    // Données optionnelles d'expertise
    const expertiseData = (repairOrder.report_number || repairOrder.expert_name) ? {
      reportNumber: repairOrder.report_number,
      expertName: repairOrder.expert_name,
      reportDate: repairOrder.report_date,
    } : undefined;

    // Données optionnelles de sinistre
    const incidentData = (repairOrder.policy_number || repairOrder.claim_number || repairOrder.incident_date) ? {
      policyNumber: repairOrder.policy_number,
      claimNumber: repairOrder.claim_number,
      incidentDate: repairOrder.incident_date,
    } : undefined;

    const signatureData = {
      clientName: formattedClientData.name,
      isForOodrive: true,
    };

    // Générer le PDF avec le nouveau composant 4 pages
    const doc = (
      <NewRepairOrderPDF
        companyData={companyData}
        clientData={formattedClientData}
        vehicleData={vehicleData}
        orderData={orderData}
        expertiseData={expertiseData}
        incidentData={incidentData}
        signatureData={signatureData}
      />
    );

    const blob = await pdf(doc).toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const pdfBuffer = new Uint8Array(arrayBuffer);

    // Uploader vers Supabase Storage
    const fileName = `repair_orders/signature/${repairOrder.id}_signature_${Date.now()}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
    }

    // Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    const documentUrl = publicUrlData.publicUrl;
    console.log('Repair order signature PDF generated and uploaded:', documentUrl);

    return documentUrl;
  } catch (error) {
    console.error('Error generating repair order signature PDF:', error);
    throw error;
  }
};