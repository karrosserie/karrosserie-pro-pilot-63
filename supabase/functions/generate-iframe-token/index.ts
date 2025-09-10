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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-secret-key'
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get JWT token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid or expired token')
    }

    console.log('Generating iframe token for user:', user.id)

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw new Error('Failed to fetch user profile')
    }

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
      throw new Error('Failed to fetch user company')
    }

    // Create token payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        ...profile
      },
      company: userCompany.company_info,
      role: userCompany.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes expiration
      purpose: 'iframe-context'
    }

    // Generate JWT token
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const iframeToken = await create({ alg: 'HS256', typ: 'JWT' }, payload, key)

    console.log('Successfully generated iframe token for user:', user.id)

    return new Response(
      JSON.stringify({
        success: true,
        token: iframeToken,
        expiresAt: payload.exp * 1000 // Convert to milliseconds
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
    
  } catch (error) {
    console.error('Error generating iframe token:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})