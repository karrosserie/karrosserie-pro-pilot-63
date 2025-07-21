import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

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
  console.log('generate-cession-pdf function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting PDF generation...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { cessionId, repairOrderData, clientData, vehicleData }: CessionPDFRequest = await req.json();
    console.log('Received data for cession:', cessionId);

    // Get cession data
    const { data: cession, error: cessionError } = await supabase
      .from('cessions')
      .select('*, insurance_companies(name), bank_accounts(*)')
      .eq('id', cessionId)
      .single();

    if (cessionError || !cession) {
      console.error('Cession not found:', cessionError);
      throw new Error('Cession not found');
    }

    console.log('Cession found:', cession.reference);

    // For now, create a simple text file instead of PDF to test
    const textContent = `
CESSION DE CRÉANCE - ${cession.reference}

Date: ${new Date().toLocaleDateString('fr-FR')}
Client: ${clientData?.first_name} ${clientData?.last_name}
Véhicule: ${vehicleData?.car_brands?.name} ${vehicleData?.car_models?.name} - ${vehicleData?.license_plate}
Assurance: ${cession.insurance_companies?.name}
N° sinistre: ${cession.incident_number}
N° contrat: ${cession.policy_number}
PV expertise: ${cession.report_number}

Document généré par KORPORATE
`;

    console.log('Creating text file...');

    // Upload to Supabase Storage
    const fileName = `cession-${cessionId}-${Date.now()}.txt`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`cessions/${fileName}`, textContent, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', uploadData.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(uploadData.path);

    console.log('Public URL:', urlData.publicUrl);

    // Update cession with document URL and status
    const { error: updateError } = await supabase
      .from('cessions')
      .update({ 
        document_url: urlData.publicUrl,
        status: 'en_attente_signature'
      })
      .eq('id', cessionId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Failed to update cession: ${updateError.message}`);
    }

    console.log('Cession updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentUrl: urlData.publicUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-cession-pdf:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

serve(handler);