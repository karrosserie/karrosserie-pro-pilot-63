import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create } from 'https://deno.land/x/djwt@v2.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('generate-iframe-token: Function called')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-secret-key'
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get JWT token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('generate-iframe-token: Token received, length:', token.length)
    
    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('generate-iframe-token: Auth error:', authError?.message)
      throw new Error('Invalid or expired token')
    }

    console.log('generate-iframe-token: User authenticated:', user.id)

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('generate-iframe-token: Profile error:', profileError.message)
      throw new Error('Failed to fetch user profile')
    }

    console.log('generate-iframe-token: Profile fetched for user:', profile?.email)

    // Get user company and role
    const { data: userCompany, error: companyError } = await supabase
      .from('user_companies')
      .select(`
        company_id,
        role,
        active,
        company_info (*)
      `)
      .eq('user_id', user.id)
      .eq('active', true)
      .single()

    if (companyError) {
      console.error('generate-iframe-token: Company error:', companyError.message)
      throw new Error('Failed to fetch user company')
    }

    console.log('generate-iframe-token: Company fetched:', (userCompany?.company_info as any)?.name, 'Role:', userCompany?.role)

    // Create token payload with 30 minutes expiration
    const now = Math.floor(Date.now() / 1000)
    const exp = now + (30 * 60) // 30 minutes

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number
      },
      company: userCompany.company_info,
      role: userCompany.role,
      supabaseToken: token, // Include original Supabase token
      iat: now,
      exp: exp,
      purpose: 'iframe-context'
    }

    console.log('generate-iframe-token: JWT Payload Details:', {
      user: {
        id: payload.user.id,
        email: payload.user.email,
        first_name: payload.user.first_name,
        last_name: payload.user.last_name,
        phone_number: payload.user.phone_number
      },
      company: {
        id: (payload.company as any)?.id,
        name: (payload.company as any)?.name,
        email: (payload.company as any)?.email,
        phone: (payload.company as any)?.phone,
        address: (payload.company as any)?.address,
        city: (payload.company as any)?.city,
        zipcode: (payload.company as any)?.zipcode,
        siren: (payload.company as any)?.siren,
        siret: (payload.company as any)?.siret,
        logo_url: (payload.company as any)?.logo_url
      },
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
      expiresInMinutes: Math.floor((payload.exp - payload.iat) / 60),
      purpose: payload.purpose
    })

    console.log('generate-iframe-token: Full payload stringified:', JSON.stringify(payload, null, 2))

    // Generate JWT token using crypto.subtle
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const iframeToken = await create({ alg: 'HS256', typ: 'JWT' }, payload, key)

    console.log('generate-iframe-token: JWT created successfully, length:', iframeToken.length)

    const response = {
      success: true,
      token: iframeToken,
      expiresAt: exp * 1000 // Convert to milliseconds
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    )
    
  } catch (error: any) {
    console.error('generate-iframe-token: Error:', error.message, error.stack)
    
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error'
    }

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    )
  }
})