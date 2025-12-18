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

// Helper function to convert PDF to image using pdf.co API
async function convertPdfToImage(pdfBlob: Blob, fileName: string): Promise<{ blob: Blob; fileName: string }> {
  const pdfCoApiKey = Deno.env.get('PDF_CO_API_KEY');
  
  if (!pdfCoApiKey) {
    throw new Error('PDF_CO_API_KEY is not configured');
  }

  console.log('Converting PDF to image using pdf.co API...');

  // Convert blob to base64
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);

  // Call pdf.co API to convert PDF to PNG
  const conversionResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/png', {
    method: 'POST',
    headers: {
      'x-api-key': pdfCoApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file: `data:application/pdf;base64,${base64}`,
      pages: '0', // First page only
      async: false
    })
  });

  if (!conversionResponse.ok) {
    const errorText = await conversionResponse.text();
    console.error('pdf.co API error:', errorText);
    throw new Error(`PDF conversion failed: ${conversionResponse.status} - ${errorText}`);
  }

  const conversionResult = await conversionResponse.json();
  console.log('pdf.co conversion result:', conversionResult);

  if (conversionResult.error) {
    throw new Error(`PDF conversion error: ${conversionResult.message}`);
  }

  // Get the first converted image URL
  const imageUrl = conversionResult.urls?.[0] || conversionResult.url;
  
  if (!imageUrl) {
    throw new Error('No image URL returned from pdf.co');
  }

  console.log('Downloading converted image from:', imageUrl);

  // Download the converted PNG image
  const imageResponse = await fetch(imageUrl);
  
  if (!imageResponse.ok) {
    throw new Error(`Failed to download converted image: ${imageResponse.status}`);
  }

  const imageBlob = await imageResponse.blob();
  const newFileName = fileName.replace(/\.pdf$/i, '.png');

  console.log('PDF converted to image successfully, new size:', imageBlob.size);

  return { blob: imageBlob, fileName: newFileName };
}

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

    // Download the file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    console.log('File downloaded successfully, size:', fileData.size, 'type:', fileData.type);

    // Check if the file is a PDF and convert it to image
    const isPDF = fileName.toLowerCase().endsWith('.pdf') || fileData.type === 'application/pdf';
    
    let imageBlob: Blob = fileData;
    let imageFileName: string = fileName;

    if (isPDF) {
      console.log('PDF detected, initiating conversion...');
      const converted = await convertPdfToImage(fileData, fileName);
      imageBlob = converted.blob;
      imageFileName = converted.fileName;
    }

    // Prepare multipart form data with the image (original or converted)
    const formData = new FormData();
    formData.append('image', imageBlob, imageFileName);
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

    // Helper function to convert DD/MM/YYYY to YYYY-MM-DD
    const convertDateFormat = (frenchDate: string): string | null => {
      if (!frenchDate) return null;
      const parts = frenchDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return null;
    };

    // Update the client with the extracted information
    const updateData: any = {};
    const outputData = webhookData.output || {};
    
    if (outputData.numero_permis) {
      updateData.license_number = outputData.numero_permis;
    }
    
    if (outputData.date_delivrance) {
      const convertedDate = convertDateFormat(outputData.date_delivrance);
      if (convertedDate) {
        updateData.license_issue_date = convertedDate;
      }
    }
    
    if (outputData.prefecture) {
      updateData.prefecture = outputData.prefecture;
    }
    
    if (outputData.date_naissance) {
      const convertedDate = convertDateFormat(outputData.date_naissance);
      if (convertedDate) {
        updateData.date_of_birth = convertedDate;
      }
    }
    
    if (outputData.lieu_naissance) {
      updateData.place_of_birth = outputData.lieu_naissance;
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

  } catch (error: any) {
    console.error('Error in analyze-driving-license function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});