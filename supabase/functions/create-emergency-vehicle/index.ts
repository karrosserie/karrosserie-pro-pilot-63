import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Create admin client with service role key
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

    const { plaque, nom, prenom, heure, employeId, companyId } = await req.json()

    if (!plaque || !nom || !prenom || !heure || !employeId || !companyId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Données manquantes' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🚨 Creating emergency vehicle:', { plaque, nom, prenom, heure, employeId, companyId })

    // 1. Récupérer le user_id depuis user_companies car employeId est l'ID de user_companies, pas l'ID utilisateur
    const { data: userCompany, error: userCompanyError } = await supabaseAdmin
      .from('user_companies')
      .select('user_id, role, active')
      .eq('id', employeId)
      .eq('company_id', companyId)
      .eq('active', true)
      .maybeSingle()

    if (userCompanyError) {
      console.error('❌ Error fetching user_companies:', userCompanyError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Employé non trouvé dans l'entreprise: ${userCompanyError.message}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!userCompany) {
      console.log('❌ Employee ID not found in user_companies:', employeId)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `L'employé sélectionné n'existe pas ou n'est pas actif dans cette entreprise.` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const actualUserId = userCompany.user_id;
    console.log('✅ Found employee in user_companies:', { employeId, actualUserId, role: userCompany.role })

    // 2. Vérifier si l'employé existe dans profiles (utilisateur authentifié)
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('id', actualUserId)
      .maybeSingle()

    if (profileCheckError) {
      console.error('❌ Error checking employee profile:', profileCheckError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `L'employé sélectionné n'a pas de profil utilisateur valide: ${profileCheckError.message}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!existingProfile) {
      console.log('❌ Employee has no profile in auth system:', actualUserId)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `L'employé sélectionné n'a pas de profil utilisateur dans le système d'authentification.` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Employee profile exists:', existingProfile)

    // 2. Créer le client avec les privilèges admin
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        first_name: prenom,
        last_name: nom,
        company_id: companyId
      })
      .select()
      .single()

    if (clientError) {
      console.error('❌ Error creating client:', clientError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Erreur lors de la création du client: ${clientError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Client created:', clientData)

    // 3. Créer le véhicule
    const { data: vehicleData, error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .insert({
        license_plate: plaque.toUpperCase(),
        client_id: clientData.id,
        company_id: companyId,
        status: 'En attente'
      })
      .select()
      .single()

    if (vehicleError) {
      console.error('❌ Error creating vehicle:', vehicleError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Erreur lors de la création du véhicule: ${vehicleError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Vehicle created:', vehicleData)

    // 4. Calculer la date et heure de début et fin
    const now = new Date()
    const [hours, minutes] = heure.split(':').map(Number)
    
    // Créer la date/heure de début
    const startDateTime = new Date(now)
    startDateTime.setHours(hours, minutes, 0, 0)
    
    // Si l'heure est dans le passé aujourd'hui, programmer pour demain
    if (startDateTime <= now) {
      startDateTime.setDate(startDateTime.getDate() + 1)
      console.log(`⏰ Heure ${heure} est dans le passé, programmation pour demain:`, startDateTime.toISOString())
    }
    
    const endDateTime = new Date(startDateTime)
    endDateTime.setHours(startDateTime.getHours() + 2, minutes, 0, 0) // 2h par défaut pour urgence

    // 5. Créer la tâche dans le planning
    const { data: scheduleData, error: scheduleError } = await supabaseAdmin
      .from('employee_schedule')
      .insert({
        company_id: companyId,
        user_id: actualUserId,
        vehicle_id: vehicleData.id,
        task_type: 'Accueil & Préparation du dossier',
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        status: 'En attente'
      })
      .select()
      .single()

    if (scheduleError) {
      console.error('❌ Error creating schedule:', scheduleError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Erreur lors de la création de la tâche: ${scheduleError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Schedule created:', scheduleData)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Véhicule d\'urgence ajouté avec succès',
        data: {
          clientId: clientData.id,
          vehicleId: vehicleData.id,
          scheduleId: scheduleData.id
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})