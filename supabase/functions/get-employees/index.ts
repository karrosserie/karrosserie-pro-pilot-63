import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { companyId } = await req.json()
    
    if (!companyId) {
      throw new Error('Company ID is required')
    }

    // Create admin client using service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('🔥 Getting employees for company:', companyId)

    // Get user_companies data with service role (bypasses RLS)
    const { data: userCompanies, error: userCompaniesError } = await supabaseAdmin
      .from('user_companies')
      .select('*')
      .eq('company_id', companyId)
      .eq('active', true)

    if (userCompaniesError) {
      console.error('❌ Error fetching user_companies:', userCompaniesError)
      throw userCompaniesError
    }

    console.log('📦 User companies found:', userCompanies?.length || 0)

    if (!userCompanies || userCompanies.length === 0) {
      return new Response(
        JSON.stringify({ employees: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get profiles for these users
    const userIds = userCompanies.map(item => item.user_id)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, email, phone_number')
      .in('id', userIds)

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError)
      // Continue without profiles if they fail to load
    }

    console.log('👤 Profiles found:', profiles?.length || 0)

    // Transform data to Employee format
    const employees = userCompanies.map((item: any) => {
      const profile = profiles?.find(p => p.id === item.user_id)
      
      const fullName = profile ? 
        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() :
        'Utilisateur'
      
      return {
        id: item.id,
        user_id: item.user_id,
        company_id: item.company_id,
        nom: fullName || profile?.email || item.role || 'Utilisateur',
        email: profile?.email || '',
        telephone: profile?.phone_number || '',
        qualifications: Array.isArray(item.qualifications) ? item.qualifications : [],
        actif: item.active,
        role: item.role,
        planningJour: []
      }
    })

    console.log('✅ Employees processed:', employees.length)

    return new Response(
      JSON.stringify({ employees }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error: any) {
    console.error('❌ Error in get-employees function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})