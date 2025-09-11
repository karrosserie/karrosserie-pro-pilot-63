import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { violationId, documentUrl, companyId } = await req.json();
    
    console.log('Analyzing violation (simple mode):', { violationId, documentUrl, companyId });

    if (!documentUrl || !companyId) {
      throw new Error('Missing required parameters: documentUrl or companyId');
    }

    // Extract file path from the public URL
    const urlParts = documentUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    const filePath = `${userId}/${fileName}`;

    console.log('Downloading file from storage:', filePath);

    // Download the image from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('violations')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    console.log('File downloaded successfully, size:', fileData.size);

    // Prepare multipart form data
    const formData = new FormData();
    formData.append('image', fileData, fileName);
    formData.append('id_carrosserie', companyId);

    console.log('Sending request to webhook...');

    // Call the external webhook
    const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/70efc3a9-eefa-422c-aa90-d7b4e8b357cf', {
      method: 'POST',
      body: formData,
    });

    if (!webhookResponse.ok) {
      console.error('Webhook response not ok:', webhookResponse.status, webhookResponse.statusText);
      throw new Error(`Webhook returned ${webhookResponse.status}: ${webhookResponse.statusText}`);
    }

    const webhookData = await webhookResponse.json();
    console.log('Webhook response:', webhookData);

    // If we have a violationId, update the violation in the database
    if (violationId) {
      const updateData: any = {};
      const outputData = webhookData.output || {};
      
      if (outputData.numero) {
        updateData.reference_number = outputData.numero;
      }
      
      if (outputData['infraction-date']) {
        updateData.violation_date = outputData['infraction-date'];
      }
      
      if (outputData['infraction-heure']) {
        updateData.violation_time = outputData['infraction-heure'];
      }
      
      if (outputData.immatriculation) {
        updateData.license_plate = outputData.immatriculation;
      }
      
      if (outputData.montant) {
        // Remove the € symbol and parse the number
        const amount = outputData.montant.replace('€', '').trim();
        updateData.fine_amount = parseFloat(amount);
      }

      console.log('Updating violation with data:', updateData);

      // Update the violation in the database
      const { data: updatedViolation, error: updateError } = await supabase
        .from('fleet_violations')
        .update(updateData)
        .eq('id', violationId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating violation:', updateError);
        console.log('Warning: Could not update violation, but analysis data will still be returned');
      } else {
        console.log('Violation updated successfully:', updatedViolation);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Violation analyzed successfully',
        extractedData: webhookData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in analyze-violation-simple function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        extractedData: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});