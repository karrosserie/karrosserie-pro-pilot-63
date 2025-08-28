import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from 'https://deno.land/x/djwt@v2.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET') || 'your-secret-key'
    
    // Check if this is a token validation request
    const url = new URL(req.url)
    const iframeToken = url.searchParams.get('token')
    
    if (iframeToken) {
      // Validate iframe token
      console.log('Validating iframe token')
      
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(jwtSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )

      try {
        const payload = await verify(iframeToken, key)
        
        if (payload.purpose !== 'iframe-context') {
          throw new Error('Invalid token purpose')
        }

        console.log('Successfully validated iframe token for user:', payload.user?.id)

        // Build role permissions from the stored role
        const userRole = payload.role
        const rolePermissions = {
          isOwner: userRole === 'Propriétaire',
          isCarrossier: userRole === 'carrossier',
          isCarrossierCourtesy: userRole === 'carrossier-vehicule de courtoisie',
          isResponsable: userRole === 'responsable',
          isResponsableAdmin: userRole === 'responsable administratif',
          canManage: ['Propriétaire', 'responsable', 'responsable administratif'].includes(userRole),
          viewOnly: ['carrossier', 'carrossier-vehicule de courtoisie'].includes(userRole),
          restrictedView: userRole === 'carrossier' ? 'employee' : 
                         userRole === 'responsable' ? 'manager' : null
        }

        return new Response(
          JSON.stringify({
            user: {
              id: payload.user.id,
              email: payload.user.email,
              profile: {
                firstName: payload.user.first_name || '',
                lastName: payload.user.last_name || '',
                phoneNumber: payload.user.phone_number || '',
                role: payload.user.role || 'user'
              }
            },
            company: {
              id: payload.company?.id || '',
              name: payload.company?.name || '',
              email: payload.company?.email || '',
              address: payload.company?.address || '',
              city: payload.company?.city || '',
              zipcode: payload.company?.zipcode || '',
              phone: payload.company?.phone || '',
              siret: payload.company?.siret || '',
              siren: payload.company?.siren || '',
              tva: payload.company?.tva || '',
              logoUrl: payload.company?.logo_url || '',
              notifications: payload.company?.notifications || { email: true, push: true, sms: false }
            },
            role: {
              current: userRole,
              permissions: rolePermissions
            },
            impersonation: {
              isActive: false,
              originalUser: null,
              companyName: null
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      } catch (tokenError) {
        console.error('Invalid iframe token:', tokenError)
        return new Response(
          JSON.stringify({ error: 'Invalid or expired iframe token' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Original authentication flow for regular requests
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user from JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('Authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Fetching user context for user:', user.id)

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }

    // Get user's company through user_companies
    const { data: userCompany, error: userCompanyError } = await supabaseClient
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

    if (userCompanyError) {
      console.error('User company fetch error:', userCompanyError)
      return new Response(
        JSON.stringify({ error: 'No active company found for user' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check for admin impersonation
    let impersonationData = null
    let effectiveCompanyData = userCompany.company_info

    // For admin users, check if there's impersonation context
    if (profile?.role === 'admin') {
      // In a real scenario, impersonation context would be passed via request headers or session
      // For now we'll use the user's actual company data
      impersonationData = {
        isActive: false,
        originalUser: null,
        companyName: null
      }
    }

    // Build role permissions
    const rolePermissions = {
      isOwner: userCompany.role === 'Propriétaire',
      isCarrossier: userCompany.role === 'carrossier',
      isCarrossierCourtesy: userCompany.role === 'carrossier-vehicule de courtoisie',
      isResponsable: userCompany.role === 'responsable',
      isResponsableAdmin: userCompany.role === 'responsable administratif',
      canManage: ['Propriétaire', 'responsable', 'responsable administratif'].includes(userCompany.role),
      viewOnly: ['carrossier', 'carrossier-vehicule de courtoisie'].includes(userCompany.role),
      restrictedView: userCompany.role === 'carrossier' ? 'employee' : 
                     userCompany.role === 'responsable' ? 'manager' : null
    }

    // Build the complete user context response
    const userContext = {
      user: {
        id: user.id,
        email: user.email,
        profile: {
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          phoneNumber: profile?.phone_number || '',
          role: profile?.role || 'user'
        }
      },
      company: {
        id: effectiveCompanyData?.id || '',
        name: effectiveCompanyData?.name || '',
        email: effectiveCompanyData?.email || '',
        address: effectiveCompanyData?.address || '',
        city: effectiveCompanyData?.city || '',
        zipcode: effectiveCompanyData?.zipcode || '',
        phone: effectiveCompanyData?.phone || '',
        siret: effectiveCompanyData?.siret || '',
        siren: effectiveCompanyData?.siren || '',
        tva: effectiveCompanyData?.tva || '',
        logoUrl: effectiveCompanyData?.logo_url || '',
        notifications: effectiveCompanyData?.notifications || { email: true, push: true, sms: false }
      },
      role: {
        current: userCompany.role,
        permissions: rolePermissions
      },
      impersonation: impersonationData || {
        isActive: false,
        originalUser: null,
        companyName: null
      }
    }

    console.log('User context successfully built for user:', user.id)

    return new Response(
      JSON.stringify(userContext),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-user-context function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})