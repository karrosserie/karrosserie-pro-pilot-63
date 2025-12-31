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
    console.log('=== GÉNÉRATION PDF SIGNATURE OR ===');
    console.log('Repair Order ID:', repairOrder?.id);
    console.log('Repair Order Reference:', repairOrder?.reference);
    console.log('Company:', companyData?.name);
    console.log('Client:', clientData?.first_name, clientData?.last_name);
    
    // Validation des données
    if (!repairOrder) {
      throw new Error('Repair order est null ou undefined');
    }
    if (!companyData) {
      throw new Error('Company data est null ou undefined');
    }
    if (!clientData) {
      throw new Error('Client data est null ou undefined');
    }

    // Calculer les totaux
    console.log('Calcul des totaux...');
    console.log('repairs_data:', JSON.stringify(repairOrder.repairs_data));
    console.log('parts_data:', JSON.stringify(repairOrder.parts_data));
    const totals = calculateInvoiceTotals(repairOrder.repairs_data, repairOrder.parts_data);
    console.log('Totaux calculés:', totals);

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

    console.log('Données préparées pour le PDF:');
    console.log('- formattedClientData:', formattedClientData);
    console.log('- vehicleData:', vehicleData);
    console.log('- orderData:', orderData);
    console.log('- expertiseData:', expertiseData);
    console.log('- incidentData:', incidentData);
    console.log('- signatureData:', signatureData);

    // Générer le PDF avec le nouveau composant 4 pages
    console.log('Création du document PDF...');
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

    console.log('Génération du blob PDF...');
    const blob = await pdf(doc).toBlob();
    console.log('Blob généré, taille:', blob.size, 'bytes');
    
    if (blob.size === 0) {
      throw new Error('Le PDF généré est vide (0 bytes)');
    }

    const arrayBuffer = await blob.arrayBuffer();
    const pdfBuffer = new Uint8Array(arrayBuffer);
    console.log('Buffer créé, taille:', pdfBuffer.length, 'bytes');

    // Uploader vers Supabase Storage
    const fileName = `repair_orders/signature/${repairOrder.id}_signature_${Date.now()}.pdf`;
    console.log('Upload vers Storage:', fileName);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('ERREUR Upload Storage:', uploadError);
      throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
    }
    console.log('Upload réussi:', uploadData);

    // Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    const documentUrl = publicUrlData.publicUrl;
    console.log('=== PDF SIGNATURE GÉNÉRÉ AVEC SUCCÈS ===');
    console.log('URL:', documentUrl);

    return documentUrl;
  } catch (error) {
    console.error('=== ERREUR GÉNÉRATION PDF SIGNATURE ===');
    console.error('Error:', error);
    throw error;
  }
};