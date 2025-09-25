import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { RepairOrder } from '@/services/supabase/repair-orders';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { supabase } from '@/integrations/supabase/client';
import { parseInvoiceData, calculateInvoiceTotals } from '@/utils/invoiceCalculations';

export const generateRepairOrderSignaturePDF = async (
  repairOrder: RepairOrder,
  companyData: any,
  clientData: any
): Promise<string> => {
  try {
    console.log('Generating repair order signature PDF for:', repairOrder.id);

    // Parser les données des réparations et pièces
    const repairsItems = parseInvoiceData(repairOrder.repairs_data);
    const partsItems = parseInvoiceData(repairOrder.parts_data);

    // Mapper les propriétés pour InvoicePDF
    const allItems = [...repairsItems, ...partsItems].map(item => ({
      ...item,
      description: item.description || item.label || 'N/A',
      unitPrice: item.unitCost || 0, // InvoicePDF utilise unitPrice au lieu de unitCost
      totalHT: (item.quantity || 0) * (item.unitCost || 0) * (1 - (item.discount || 0) / 100)
    }));

    // Calculer les totaux
    const totals = calculateInvoiceTotals(repairOrder.repairs_data, repairOrder.parts_data);

    const formattedClientData = {
      // Format pour InvoicePDF
      name: clientData ? `${clientData.first_name} ${clientData.last_name}` : '', // InvoicePDF utilise 'name'
      clientName: clientData ? `${clientData.first_name} ${clientData.last_name}` : '', // Pour la signature
      address: clientData?.address,
      postalCode: clientData?.postal_code || '',
      city: `${clientData?.postal_code || ''} ${clientData?.city || ''}`.trim(),
      phone: clientData?.phone,
      email: clientData?.email,
      // Ajouter les items pour InvoicePDF
      items: allItems, // InvoicePDF cherche les items dans clientData.items
      // Ajouter les totaux pour InvoicePDF
      totals: {
        subtotal: totals.subtotalAfterDiscount.toFixed(2).replace('.', ',') + ' €',
        vat: totals.totalVAT.toFixed(2).replace('.', ',') + ' €',
        total: totals.finalTotal.toFixed(2).replace('.', ',') + ' €'
      }
    };

    const vehicleData = {
      start_date: repairOrder.start_date,
      end_date: repairOrder.end_date,
      brand: repairOrder.vehicles?.car_brands?.name || '',
      model: repairOrder.vehicles?.car_models?.name || '',
      licensePlate: repairOrder.vehicles?.license_plate || '',
      mileage: '' // TODO: Add mileage field to vehicle type if needed
    };

    const signatureData = {
      signature: null, // Pas de signature car c'est pour Oodrive
      clientName: formattedClientData.clientName,
      signatureDate: null,
      isForOodrive: true // Indiquer que c'est pour Oodrive
    };

    // Transformer les données en format compatible avec InvoicePDF
    const invoiceData = {
      id: repairOrder.id,
      reference: repairOrder.reference,
      date: repairOrder.created_at,
      due_date: repairOrder.created_at,
      status: repairOrder.status,
      amount: totals.finalTotal, // Utiliser le montant calculé
      claim_number: repairOrder.claim_number,
      policy_number: repairOrder.policy_number,
      report_date: repairOrder.report_date,
      expert_name: repairOrder.expert_name,
      report_number: repairOrder.report_number,
      incident_date: repairOrder.incident_date,
      notes: repairOrder.notes,
      // Passer les items parsés au lieu des données brutes JSON
      items: allItems,
      repairs_data: repairsItems,
      parts_data: partsItems,
      discounts_data: repairOrder.discounts_data,
    };

    // Générer le PDF avec le composant InvoicePDF compatible React-PDF
    const doc = (
      <InvoicePDF
        invoice={invoiceData as any}
        companyData={companyData}
        clientData={formattedClientData}
        vehicleData={vehicleData}
        signatureData={signatureData}
        documentType="repair_order"
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