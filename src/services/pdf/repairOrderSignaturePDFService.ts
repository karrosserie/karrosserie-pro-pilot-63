import { generateComponentPDF } from '@/utils/pdfGenerator';
import { RepairOrder } from '@/services/supabase/repair-orders';
import DefaultRepairOrderSignaturePreview from '@/components/repair-orders/templates/DefaultRepairOrderSignaturePreview';
import { supabase } from '@/integrations/supabase/client';

export const generateRepairOrderSignaturePDF = async (
  repairOrder: RepairOrder,
  companyData: any,
  clientData: any
): Promise<string> => {
  try {
    console.log('Generating repair order signature PDF for:', repairOrder.id);

    // Préparer les données pour le PDF
    const orderData = {
      number: repairOrder.reference,
      claimNumber: repairOrder.claim_number,
      billingDate: repairOrder.billing_date,
      orderDate: repairOrder.order_date,
      vehicle: repairOrder.vehicles
        ? `${repairOrder.vehicles.car_brands?.name || ''} ${repairOrder.vehicles.car_models?.name || ''}`
        : '',
      licensePlate: repairOrder.vehicles?.license_plate,
      mileage: repairOrder.vehicles?.mileage?.toString(),
      amountDue: repairOrder.amount?.toString(),
      notes: repairOrder.notes
    };

    const formattedClientData = {
      name: clientData ? `${clientData.first_name} ${clientData.last_name}` : '',
      address: clientData?.address,
      city: `${clientData?.postal_code || ''} ${clientData?.city || ''}`.trim(),
      phone: clientData?.phone,
      email: clientData?.email
    };

    const vehicleData = {
      start_date: repairOrder.start_date,
      end_date: repairOrder.end_date
    };

    // Parser les données des réparations et pièces
    let items: any[] = [];

    try {
      if (repairOrder.repairs_data) {
        const repairsData = typeof repairOrder.repairs_data === 'string'
          ? JSON.parse(repairOrder.repairs_data)
          : repairOrder.repairs_data;

        if (Array.isArray(repairsData)) {
          items.push(...repairsData.map((item: any) => ({
            ref: item.ref || '',
            description: item.description || '',
            quantity: parseFloat(item.quantity) || 1,
            unitPrice: parseFloat(item.unit_price) || 0,
            vat: parseFloat(item.vat) || 20,
            totalHT: parseFloat(item.total_ht) || 0,
            totalTTC: parseFloat(item.total) || 0
          })));
        }
      }

      if (repairOrder.parts_data) {
        const partsData = typeof repairOrder.parts_data === 'string'
          ? JSON.parse(repairOrder.parts_data)
          : repairOrder.parts_data;

        if (Array.isArray(partsData)) {
          items.push(...partsData.map((item: any) => ({
            ref: item.ref || '',
            description: item.description || '',
            quantity: parseFloat(item.quantity) || 1,
            unitPrice: parseFloat(item.unit_price) || 0,
            vat: parseFloat(item.vat) || 20,
            totalHT: parseFloat(item.total_ht) || 0,
            totalTTC: parseFloat(item.total) || 0
          })));
        }
      }
    } catch (error) {
      console.error('Error parsing repair order data:', error);
      // Continue avec un tableau vide si parsing échoue
    }

    // Calculer les totaux
    const subtotalHT = items.reduce((sum, item) => sum + item.totalHT, 0);
    const totalVAT = items.reduce((sum, item) => {
      const vatAmount = item.totalHT * (item.vat / 100);
      return sum + vatAmount;
    }, 0);
    const totalTTC = subtotalHT + totalVAT;

    const totals = {
      subtotal: subtotalHT.toFixed(2),
      vat: totalVAT.toFixed(2),
      total: totalTTC.toFixed(2)
    };

    const signatureData = {
      signature: null, // Pas de signature car c'est pour Oodrive
      clientName: formattedClientData.name,
      signatureDate: null
    };

    // Générer le PDF avec le nouveau template de signature
    const pdfBuffer = await generateComponentPDF(
      DefaultRepairOrderSignaturePreview,
      {
        companyData,
        orderData,
        clientData: formattedClientData,
        vehicleData,
        items,
        totals,
        signatureData
      },
      'RepairOrderSignature'
    );

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