import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from 'https://deno.land/x/djwt@v2.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

interface IframeRequest {
  token: string;
  action: 'select' | 'insert' | 'update' | 'delete' | 'rpc';
  table?: string;
  data?: any;
  filter?: any;
  select?: string;
  rpcName?: string;
  rpcParams?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('iframe-supabase-proxy: Request received', { 
    method: req.method, 
    url: req.url 
  });

  try {
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-secret-key';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Parse request body
    const requestBody: IframeRequest = await req.json();
    const { token, action, table, data, filter, select, rpcName, rpcParams } = requestBody;

    if (!token) {
      throw new Error('Missing iframe token');
    }

    console.log('iframe-supabase-proxy: Validating iframe token');

    // Validate iframe token
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const payload = await verify(token, key);
    
    if (payload.purpose !== 'iframe-context') {
      throw new Error('Invalid token purpose');
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    console.log('iframe-supabase-proxy: Token validated for user:', (payload as any).user?.id);

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get company ID from token for security filtering
    const companyId = (payload as any).company?.id;
    const userId = (payload as any).user?.id;
    const userRole = payload.role;

    if (!companyId || !userId) {
      throw new Error('Missing company or user information in token');
    }

    console.log('iframe-supabase-proxy: Executing action:', action, 'on table:', table);

    let result;

    switch (action) {
      case 'select':
        if (!table) throw new Error('Table is required for select action');
        
        let selectQuery = supabase
          .from(table)
          .select(select || '*');

        // Apply company filtering for security
        if (table !== 'car_brands' && table !== 'car_models') {
          selectQuery = selectQuery.eq('company_id', companyId);
        }

        // Apply additional filters
        if (filter) {
          Object.keys(filter).forEach(key => {
            selectQuery = selectQuery.eq(key, filter[key]);
          });
        }

        const { data: selectData, error: selectError } = await selectQuery;
        if (selectError) throw selectError;
        result = selectData;
        break;

      case 'insert':
        if (!table || !data) throw new Error('Table and data are required for insert action');
        
        // Automatically add company_id for security
        const insertData = { ...data, company_id: companyId };
        
        const { data: insertResult, error: insertError } = await supabase
          .from(table)
          .insert(insertData)
          .select();
        
        if (insertError) throw insertError;
        result = insertResult;
        break;

      case 'update':
        if (!table || !data || !filter) throw new Error('Table, data, and filter are required for update action');
        
        let updateQuery = supabase
          .from(table)
          .update(data);

        // Apply company filtering for security
        updateQuery = updateQuery.eq('company_id', companyId);

        // Apply additional filters
        Object.keys(filter).forEach(key => {
          updateQuery = updateQuery.eq(key, filter[key]);
        });

        const { data: updateResult, error: updateError } = await updateQuery.select();
        if (updateError) throw updateError;
        result = updateResult;
        break;

      case 'delete':
        if (!table || !filter) throw new Error('Table and filter are required for delete action');
        
        let deleteQuery = supabase
          .from(table)
          .delete();

        // Apply company filtering for security
        if (companyId) {
          deleteQuery = deleteQuery.eq('company_id', companyId);
        }

        // Apply additional filters
        Object.keys(filter).forEach(key => {
          if (filter[key] !== undefined) {
            deleteQuery = deleteQuery.eq(key, filter[key]);
          }
        });

        const { data: deleteResult, error: deleteError } = await deleteQuery.select();
        if (deleteError) throw deleteError;
        result = deleteResult;
        break;

      case 'rpc':
        if (!rpcName) throw new Error('RPC name is required for RPC action');
        
        const { data: rpcResult, error: rpcError } = await supabase.rpc(rpcName, {
          ...rpcParams,
          p_company_id: companyId,
          p_user_id: userId
        });
        
        if (rpcError) throw rpcError;
        result = rpcResult;
        break;

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    console.log('iframe-supabase-proxy: Action completed successfully');

    const response = {
      success: true,
      data: result,
      context: {
        userId,
        companyId,
        userRole,
        action,
        table
      }
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );

  } catch (error) {
    console.error('iframe-supabase-proxy: Error:', error instanceof Error ? error.message : String(error));
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});