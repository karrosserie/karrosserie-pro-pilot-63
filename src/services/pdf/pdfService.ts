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
        
        // Parser les données des réparations et pièces
        let repairs = [];
        let parts = [];
        try {
          repairs = cession.repair_orders.repairs_data ? JSON.parse(cession.repair_orders.repairs_data as string) : [];
          parts = cession.repair_orders.parts_data ? JSON.parse(cession.repair_orders.parts_data as string) : [];
        } catch (error) {
          console.error('Error parsing repair/parts data:', error);
        }

        // Formater les articles pour le PDF
        const allItems = [...repairs, ...parts];
        const formattedItems = allItems.map(item => {
          const unitCost = parseFloat(item.unitCost) || 0;
          const quantity = parseFloat(item.quantity) || 0;
          const discount = parseFloat(item.discount) || 0;
          const vat = parseFloat(item.vat) || 20;
          
          const subtotal = unitCost * quantity;
          const afterDiscount = subtotal - discount;
          const vatAmount = (afterDiscount * vat) / 100;
          const totalTTC = afterDiscount + vatAmount;

          return {
            ref: item.ref || '',
            description: item.description || '',
            quantity: quantity,
            discount: discount,
            unitPrice: unitCost,
            vat: vat,
            totalHT: afterDiscount,
            totalTTC: totalTTC
          };
        });

        // Calculer les totaux
        const totals = formattedItems.reduce((acc, item) => {
          acc.subtotal += item.totalHT;
          acc.vat += item.totalTTC - item.totalHT;
          acc.total += item.totalTTC;
          acc.discount += item.discount;
          return acc;
        }, { subtotal: 0, vat: 0, total: 0, discount: 0 });

        // Formater les données client comme attendu par InvoicePDF
        const formattedClientData = repairOrderClient ? {
          number: cession.repair_orders.reference,
          name: `${repairOrderClient.first_name} ${repairOrderClient.last_name}`,
          phone: repairOrderClient.phone || '',
          email: repairOrderClient.email || '',
          address: repairOrderClient.address || '',
          city: `${repairOrderClient.postal_code || ''} ${repairOrderClient.city || ''}`.trim(),
          licensePlate: repairOrderVehicle?.license_plate || '',
          mileage: repairOrderVehicle?.mileage ? repairOrderVehicle.mileage.toLocaleString() + ' km' : '',
          vehicle: repairOrderVehicle ? `${repairOrderVehicle.car_brands?.name || ''} ${repairOrderVehicle.car_models?.name || ''}`.trim() : '',
          billingDate: cession.repair_orders.created_at ? new Date(cession.repair_orders.created_at).toLocaleDateString('fr-FR') : '',
          notes: 'Observations et remarques concernant cette réparation\n\n[Signature2/]',  // Notes avec saut de ligne avant signature
          items: formattedItems,
          totals: {
            // Format pour le template par défaut
            subtotal: `${totals.subtotal.toFixed(2).replace('.', ',')} €`,
            vat: `${totals.vat.toFixed(2).replace('.', ',')} €`,
            total: `${totals.total.toFixed(2).replace('.', ',')} €`,
            // Format pour le template alternatif
            totalHT: `${totals.subtotal.toFixed(2).replace('.', ',')} €`,
            totalVAT: `${totals.vat.toFixed(2).replace('.', ',')} €`,
            totalDiscount: `${totals.discount.toFixed(2).replace('.', ',')} €`,
            totalTTC: `${totals.total.toFixed(2).replace('.', ',')} €`
          }
        } : null;

        // Formater les données véhicule comme attendu par InvoicePDF
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 7); // Délai de 7 jours par défaut
        
        const formattedVehicleData = repairOrderVehicle ? {
          vehicle: `${repairOrderVehicle.car_brands?.name || ''} ${repairOrderVehicle.car_models?.name || ''}`.trim(),
          licensePlate: repairOrderVehicle.license_plate || '',
          mileage: repairOrderVehicle.mileage ? repairOrderVehicle.mileage.toLocaleString() + ' km' : '',
          start_date: today.toISOString(),     // Date de début = aujourd'hui
          end_date: futureDate.toISOString(),  // Date de fin = dans 7 jours
        } : null;

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