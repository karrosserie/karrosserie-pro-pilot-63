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
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('get-user-context: Request received', { 
    method: req.method, 
    url: req.url,
    hasAuth: !!req.headers.get('Authorization'),
    userAgent: req.headers.get('User-Agent')
  })

  try {
    const jwtSecret = Deno.env.get('JWT_SECRET') || 'your-secret-key'
    
    // Check if this is a token validation request
    const url = new URL(req.url)
    const iframeToken = url.searchParams.get('token')
    
    console.log('get-user-context: Token check', { 
      hasToken: !!iframeToken,
      tokenLength: iframeToken ? iframeToken.length : 0 
    })
    
    if (iframeToken) {
      // Validate iframe token
      console.log('get-user-context: Processing iframe token')
      
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(jwtSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )

      try {
        const payload: any = await verify(iframeToken, key)
        console.log('get-user-context: Token decoded successfully', { 
          userId: payload.user?.id,
          role: payload.role,
          purpose: payload.purpose,
          exp: payload.exp
        })
        
        if (payload.purpose !== 'iframe-context') {
          console.error('get-user-context: Invalid token purpose:', payload.purpose)
          throw new Error('Invalid token purpose')
        }

        // Check expiration
        const now = Math.floor(Date.now() / 1000)
        if (payload.exp && payload.exp < now) {
          console.error('get-user-context: Token expired', { exp: payload.exp, now })
          throw new Error('Token expired')
        }

        console.log('get-user-context: Token validation successful for user:', payload.user?.id)

        // Build role permissions from the stored role
        const userRole = payload.role as string
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

        const response = {
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
        }

        console.log('get-user-context: Returning user context for iframe', { 
          userId: response.user.id,
          companyId: response.company.id,
          role: response.role.current
        })

        return new Response(
          JSON.stringify(response),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      } catch (tokenError) {
        console.error('get-user-context: Invalid iframe token:', {
          message: tokenError instanceof Error ? tokenError.message : String(tokenError),
          name: tokenError instanceof Error ? tokenError.name : 'UnknownError',
          stack: tokenError instanceof Error ? tokenError.stack : undefined
        })
        return new Response(
          JSON.stringify({ 
            error: 'Invalid or expired iframe token',
            details: tokenError instanceof Error ? tokenError.message : String(tokenError)
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.log('get-user-context: Processing regular authentication request')

    // Original authentication flow for regular requests
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('get-user-context: Missing or invalid authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the current user from JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('get-user-context: Authentication error:', {
        error: userError?.message,
        hasUser: !!user
      })
      return new Response(
        JSON.stringify({ 
          error: 'Authentication required',
          details: userError?.message 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('get-user-context: Fetching user context for user:', user.id)

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('get-user-context: Profile fetch error:', profileError)
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
      console.error('get-user-context: User company fetch error:', userCompanyError)
      return new Response(
        JSON.stringify({ 
          error: 'No active company found for user',
          details: userCompanyError.message 
        }),
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
        id: (effectiveCompanyData as any)?.id || '',
        name: (effectiveCompanyData as any)?.name || '',
        email: (effectiveCompanyData as any)?.email || '',
        address: (effectiveCompanyData as any)?.address || '',
        city: (effectiveCompanyData as any)?.city || '',
        zipcode: (effectiveCompanyData as any)?.zipcode || '',
        phone: (effectiveCompanyData as any)?.phone || '',
        siret: (effectiveCompanyData as any)?.siret || '',
        siren: (effectiveCompanyData as any)?.siren || '',
        tva: (effectiveCompanyData as any)?.tva || '',
        logoUrl: (effectiveCompanyData as any)?.logo_url || '',
        notifications: (effectiveCompanyData as any)?.notifications || { email: true, push: true, sms: false }
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

    console.log('get-user-context: User context successfully built for user:', user.id)

    return new Response(
      JSON.stringify(userContext),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: any) {
    console.error('get-user-context: Unexpected error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
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