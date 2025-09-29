import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from 'https://deno.land/x/djwt@v2.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('iframe-supabase-direct: Request received', { 
    method: req.method, 
    url: req.url 
  });

  try {
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-secret-key';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Get iframe token from request body
    const requestBody = await req.json();
    const { token } = requestBody;

    if (!token) {
      throw new Error('Missing iframe token');
    }

    console.log('iframe-supabase-direct: Validating iframe token');

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

    console.log('iframe-supabase-direct: Token validated for user:', (payload as any).user?.id);

    // Extract Supabase token from JWT payload
    const supabaseToken = payload.supabaseToken;
    
    if (!supabaseToken) {
      throw new Error('No Supabase token found in iframe token');
    }

    console.log('iframe-supabase-direct: Returning Supabase authentication data');

    // Return the Supabase configuration and token for direct use
    const response = {
      success: true,
      supabaseConfig: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        authToken: supabaseToken
      },
      userContext: {
        user: payload.user,
        company: payload.company,
        role: payload.role
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
    console.error('iframe-supabase-direct: Error:', error.message);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error'
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