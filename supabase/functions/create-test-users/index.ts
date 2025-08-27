import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Créer un client Supabase avec les droits service_role pour créer des utilisateurs
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Créer un client normal pour les opérations sur les tables publiques
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Début de la création des utilisateurs de test...');

    // Données des utilisateurs à créer
    const usersToCreate = [
      {
        email: 'carrossier@gmail.com',
        password: 'carrossier',
        first_name: 'Test',
        last_name: 'Carrossier',
        role: 'Carrossier'
      },
      {
        email: 'carrossiercourtois@gmail.com',
        password: 'carrossiercourtois',
        first_name: 'Test',
        last_name: 'Carrossier Courtoisie',
        role: 'Carrossier-vehicule de courtoisie'
      },
      {
        email: 'responsable@gmail.com',
        password: 'responsable',
        first_name: 'Test',
        last_name: 'Responsable',
        role: 'Responsable'
      },
      {
        email: 'responsableadmin@gmail.com',
        password: 'responsableadmin',
        first_name: 'Test',
        last_name: 'Responsable Admin',
        role: 'Responsable administratif'
      }
    ];

    // Récupérer la première entreprise disponible
    const { data: companies, error: companyError } = await supabase
      .from('company_info')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1);

    if (companyError || !companies || companies.length === 0) {
      throw new Error('Aucune entreprise trouvée. Créez d\'abord une entreprise.');
    }

    const targetCompanyId = companies[0].id;
    console.log('Entreprise cible:', targetCompanyId);

    const results = [];

    // Créer chaque utilisateur
    for (const userData of usersToCreate) {
      try {
        console.log(`Création de l'utilisateur: ${userData.email}`);

        // Créer l'utilisateur avec le client admin
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            first_name: userData.first_name,
            last_name: userData.last_name
          }
        });

        if (authError) {
          console.error(`Erreur création auth pour ${userData.email}:`, authError);
          results.push({
            email: userData.email,
            success: false,
            error: authError.message
          });
          continue;
        }

        if (!authData.user) {
          console.error(`Pas d'utilisateur créé pour ${userData.email}`);
          results.push({
            email: userData.email,
            success: false,
            error: 'Utilisateur non créé'
          });
          continue;
        }

        console.log(`Utilisateur auth créé avec l'ID: ${authData.user.id}`);

        // Créer le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email
          });

        if (profileError) {
          console.error(`Erreur création profil pour ${userData.email}:`, profileError);
        } else {
          console.log(`Profil créé pour ${userData.email}`);
        }

        // Créer l'association entreprise-utilisateur avec le rôle
        const { error: companyError } = await supabase
          .from('user_companies')
          .insert({
            user_id: authData.user.id,
            company_id: targetCompanyId,
            role: userData.role,
            active: true
          });

        if (companyError) {
          console.error(`Erreur association entreprise pour ${userData.email}:`, companyError);
          results.push({
            email: userData.email,
            success: false,
            error: `Erreur association: ${companyError.message}`
          });
        } else {
          console.log(`Association entreprise créée pour ${userData.email} avec le rôle ${userData.role}`);
          results.push({
            email: userData.email,
            success: true,
            userId: authData.user.id,
            role: userData.role
          });
        }

      } catch (error) {
        console.error(`Erreur générale pour ${userData.email}:`, error);
        results.push({
          email: userData.email,
          success: false,
          error: error.message
        });
      }
    }

    console.log('Résultats finaux:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Processus de création terminé',
        results: results,
        companyId: targetCompanyId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erreur générale:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})