import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting document replacement...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Parse the request body
    const contentType = req.headers.get('content-type');
    let documentId: string;
    let pdfData: Uint8Array;
    let filename: string;
    let tableName: string;
    let columnName: string;

    if (contentType?.includes('multipart/form-data')) {
      // Handle multipart form data
      const formData = await req.formData();
      documentId = formData.get('document_id') as string;
      tableName = formData.get('table_name') as string || 'quotes';
      columnName = formData.get('column_name') as string || 'signed_document_url';
      
      const file = formData.get('file') as File;
      if (!file) {
        throw new Error('No file provided');
      }
      
      filename = file.name;
      const buffer = await file.arrayBuffer();
      pdfData = new Uint8Array(buffer);
    } else {
      // Handle JSON with base64
      const body = await req.json();
      documentId = body.document_id;
      tableName = body.table_name || 'quotes';
      columnName = body.column_name || 'signed_document_url';
      filename = body.filename || 'document.pdf';
      
      if (!body.pdf_base64) {
        throw new Error('No PDF data provided');
      }
      
      // Decode base64
      const base64Data = body.pdf_base64.replace(/^data:application\/pdf;base64,/, '');
      pdfData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    }

    console.log(`📄 Document ID: ${documentId}, Table: ${tableName}, Column: ${columnName}`);

    if (!documentId || !pdfData) {
      throw new Error('Missing required parameters: document_id and PDF data');
    }

    // Get the current document to find the old file path
    const { data: currentDoc, error: fetchError } = await supabase
      .from(tableName)
      .select(`${columnName}, company_id`)
      .eq('id', documentId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching document:', fetchError);
      throw new Error(`Failed to fetch document: ${fetchError.message}`);
    }

    console.log('📋 Current document:', currentDoc);

    // Delete old file if it exists
    if (currentDoc?.[columnName]) {
      const oldPath = currentDoc[columnName].split('/').slice(-1)[0];
      const oldFilePath = `${currentDoc.company_id}/${tableName}/${oldPath}`;
      
      console.log(`🗑️ Deleting old file: ${oldFilePath}`);
      const { error: deleteError } = await supabase.storage
        .from('documents')
        .remove([oldFilePath]);
      
      if (deleteError) {
        console.warn('⚠️ Warning: Could not delete old file:', deleteError);
      }
    }

    // Generate new file path
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const newFilePath = `${currentDoc.company_id}/${tableName}/${documentId}_${timestamp}_${sanitizedFilename}`;

    console.log(`📤 Uploading new file to: ${newFilePath}`);

    // Upload new PDF to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(newFilePath, pdfData, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Error uploading file:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(newFilePath);

    const publicUrl = urlData.publicUrl;
    console.log(`✅ New file uploaded: ${publicUrl}`);

    // Update database record
    const updateData: Record<string, any> = {
      [columnName]: publicUrl,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', documentId);

    if (updateError) {
      console.error('❌ Error updating database:', updateError);
      throw new Error(`Failed to update database: ${updateError.message}`);
    }

    console.log('✅ Document replaced successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Document replaced successfully',
        document_id: documentId,
        new_url: publicUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error in replace-document function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
