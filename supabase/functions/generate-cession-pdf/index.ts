import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CessionPDFRequest {
  cessionId: string;
  repairOrderData: any;
  clientData: any;
  vehicleData: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { cessionId, repairOrderData, clientData, vehicleData }: CessionPDFRequest = await req.json();

    // Get cession data
    const { data: cession, error: cessionError } = await supabase
      .from('cessions')
      .select('*, insurance_companies(name), bank_accounts(*)')
      .eq('id', cessionId)
      .single();

    if (cessionError || !cession) {
      throw new Error('Cession not found');
    }

    // Generate PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const currentDate = new Date().toLocaleDateString('fr-FR');
    const incidentDate = cession.incident_date ? new Date(cession.incident_date).toLocaleDateString('fr-FR') : '';
    
    // Page 1: Attestation sur l'honneur
    const page1 = pdfDoc.addPage([595, 842]); // A4 size
    let yPosition = 750;
    
    page1.drawText('ATTESTATION SUR L\'HONNEUR D\'ABSENCE DE SURFACTURATION', {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= 20;
    page1.drawText('(Conformément à l\'article L. 441-7 du Code de commerce)', {
      x: 50,
      y: yPosition,
      size: 11,
      font: helveticaFont,
    });
    
    yPosition -= 40;
    page1.drawText('KORPORATE', { x: 50, y: yPosition, size: 12, font: helveticaBoldFont });
    yPosition -= 15;
    page1.drawText('25 COURS PIERRE PUGET', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('13006 MARSEILLE', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('ggobeyn@outlook.fr', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('+33646465242', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page1.drawText('À l\'attention de :', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(cession.insurance_companies?.name || 'ACTIVE ASSURANCES', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('8-10 RUE DE LA FERME', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('92100 BOULOGNE-BILLANCOURT', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page1.drawText('Objet : Attestation sur l\'honneur certifiant l\'absence de surfacturation', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(`N° sinistre : ${cession.incident_number || '00125A'}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(`N° contrat : ${cession.policy_number || '7718265A'}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(`PV expertise : ${cession.report_number || 'AE25008924'}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(`Véhicule : ${vehicleData?.license_plate || 'ED-684-JH'}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    const attestationText1 = 'Nous attestons par la présente, conformément à l\'article L. 441-7 du Code de commerce, que :';
    page1.drawText(attestationText1, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 20;
    const attestationText2 = `1. Les travaux de réparation effectués sur le véhicule ${vehicleData?.car_brands?.name} ${vehicleData?.car_models?.name}`;
    page1.drawText(attestationText2, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    const attestationText3 = `(immatriculation ${vehicleData?.license_plate}), dans le cadre du sinistre survenu le ${incidentDate},`;
    page1.drawText(attestationText3, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    const attestationText4 = `référencé sous le n°${cession.incident_number}, ont été facturés en stricte conformité avec :`;
    page1.drawText(attestationText4, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 20;
    page1.drawText('○ Les tarifs professionnels habituellement pratiqués par notre établissement ;', { x: 60, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(`○ Les préconisations techniques du constructeur ${vehicleData?.car_brands?.name} ;`, { x: 60, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText(`○ Les dispositions du rapport d\'expertise n° ${cession.report_number} ;`, { x: 60, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('○ Les règles de l\'art en vigueur dans le secteur de la réparation automobile.', { x: 60, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 100;
    page1.drawText(`Fait à MARSEILLE, le ${currentDate}`, { x: 350, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('KORPORATE', { x: 350, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page1.drawText('Approuvé par MUSSO DORIAN', { x: 350, y: yPosition, size: 11, font: helveticaFont });

    // Page 2: Notification de cession
    const page2 = pdfDoc.addPage([595, 842]);
    yPosition = 750;
    
    page2.drawText('KORPORATE', { x: 50, y: yPosition, size: 12, font: helveticaBoldFont });
    yPosition -= 15;
    page2.drawText('25 COURS PIERRE PUGET', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('13006 MARSEILLE', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('ggobeyn@outlook.fr', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('+33646465242', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 40;
    page2.drawText(cession.insurance_companies?.name || 'ACTIVE ASSURANCES', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('8-10 RUE DE LA FERME', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('92100 BOULOGNE-BILLANCOURT', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page2.drawText('Objet : Notification de cession de créance (Article 1324 du Code civil)', { x: 50, y: yPosition, size: 11, font: helveticaBoldFont });
    yPosition -= 15;
    page2.drawText(`N° sinistre : ${cession.incident_number}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText(`N° contrat : ${cession.policy_number}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText(`PV expertise : ${cession.report_number}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page2.drawText(`MARSEILLE, le ${currentDate}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('Madame, Monsieur,', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    const notifText1 = 'Conformément aux dispositions des articles 1321 et suivants du Code civil et L.121-13 du Code des';
    page2.drawText(notifText1, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    const notifText2 = 'assurances, nous vous notifions par la présente la cession de créance intervenue ce jour entre :';
    page2.drawText(notifText2, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page2.drawText('CÉDANT', { x: 50, y: yPosition, size: 12, font: helveticaBoldFont });
    yPosition -= 15;
    page2.drawText(`${clientData?.first_name} ${clientData?.last_name}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText(clientData?.address || '', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText(`${clientData?.postal_code || ''} ${clientData?.city || ''}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText(clientData?.email || '', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText(clientData?.phone || '', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page2.drawText('Au profit de :', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('CESSIONNAIRE', { x: 50, y: yPosition, size: 12, font: helveticaBoldFont });
    yPosition -= 15;
    page2.drawText('KORPORATE', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('25 COURS PIERRE PUGET', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('13006 MARSEILLE', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('ggobeyn@outlook.fr', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page2.drawText('+33646465242', { x: 50, y: yPosition, size: 11, font: helveticaFont });

    // Page 3: Détails de l'indemnisation
    const page3 = pdfDoc.addPage([595, 842]);
    yPosition = 750;
    
    page3.drawText('Concernant l\'indemnisation des réparations du véhicule :', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText(`${vehicleData?.car_brands?.name} ${vehicleData?.car_models?.name}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText(`Immatriculation : ${vehicleData?.license_plate}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page3.drawText(`Suite au sinistre survenu le ${incidentDate}.`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page3.drawText('Cette cession est effectuée en vertu :', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText('- De l\'article L.121-13 du Code des assurances', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText('- Des articles 1321 à 1326 du Code civil', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText(`- Du PV d\'expertise n°${cession.report_number}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText('- Du privilège du garagiste (article 2332, 3° du Code civil)', { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    const indemnText1 = 'En conséquence, nous vous demandons de procéder au règlement de l\'indemnité d\'un montant de 1 094,79 € TTC';
    page3.drawText(indemnText1, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    const indemnText2 = 'directement sur notre compte bancaire :';
    page3.drawText(indemnText2, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 30;
    page3.drawText(`BANQUE : ${cession.bank_accounts?.bank || 'CIC'}`, { x: 50, y: yPosition, size: 12, font: helveticaBoldFont });
    yPosition -= 15;
    page3.drawText(`IBAN : ${cession.bank_accounts?.iban || 'FR76 0123 4567 8901 2345 6789 123'}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText(`BIC : ${cession.bank_accounts?.bic || 'CICFRPP'}`, { x: 50, y: yPosition, size: 11, font: helveticaFont });
    
    yPosition -= 100;
    page3.drawText('KORPORATE', { x: 350, y: yPosition, size: 11, font: helveticaFont });
    yPosition -= 15;
    page3.drawText('Approuvé par MUSSO DORIAN', { x: 350, y: yPosition, size: 11, font: helveticaFont });

    // Generate PDF buffer
    const pdfBytes = await pdfDoc.save();

    // Upload to Supabase Storage
    const fileName = `cession-${cessionId}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`cessions/${fileName}`, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(`cessions/${fileName}`);

    // Update cession with document URL
    const { error: updateError } = await supabase
      .from('cessions')
      .update({ 
        document_url: publicUrl,
        status: 'en_attente_signature' 
      })
      .eq('id', cessionId);

    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        document_url: publicUrl,
        message: 'PDF généré avec succès'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);