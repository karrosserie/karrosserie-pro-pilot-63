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
    const { clientId, documentUrl } = await req.json();
    
    console.log('Analyzing driving license:', { clientId, documentUrl });

    if (!clientId || !documentUrl) {
      throw new Error('Missing required parameters: clientId or documentUrl');
    }

    // Extract file path from the public URL
    const urlParts = documentUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    const filePath = `${userId}/${fileName}`;

    console.log('Downloading file from storage:', filePath);

    // Download the image from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    console.log('File downloaded successfully, size:', fileData.size);

    // Prepare multipart form data
    const formData = new FormData();
    formData.append('image', fileData, fileName);
    formData.append('client_id', clientId);

    console.log('Sending request to driving license webhook...');

    // Call the external webhook
    const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/8aeb4881-46c6-41e3-b2a1-5077683eb417', {
      method: 'POST',
      body: formData,
    });

    if (!webhookResponse.ok) {
      console.error('Webhook response not ok:', webhookResponse.status, webhookResponse.statusText);
      throw new Error(`Webhook returned ${webhookResponse.status}: ${webhookResponse.statusText}`);
    }

    const webhookData = await webhookResponse.json();
    console.log('Webhook response:', webhookData);

    // Update the client with the extracted information
    const updateData: any = {};
    
    if (webhookData.numero_permis) {
      updateData.license_number = webhookData.numero_permis;
    }
    
    if (webhookData.date_delivrance) {
      updateData.license_issue_date = webhookData.date_delivrance;
    }
    
    if (webhookData.prefecture) {
      updateData.prefecture = webhookData.prefecture;
    }
    
    if (webhookData.date_naissance) {
      updateData.date_of_birth = webhookData.date_naissance;
    }
    
    if (webhookData.lieu_naissance) {
      updateData.place_of_birth = webhookData.lieu_naissance;
    }

    console.log('Updating client with data:', updateData);

    // Update the client in the database
    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating client:', updateError);
      throw new Error(`Failed to update client: ${updateError.message}`);
    }

    console.log('Client updated successfully:', updatedClient);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Driving license analyzed and client updated successfully',
        extractedData: webhookData,
        updatedClient
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in analyze-driving-license function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});