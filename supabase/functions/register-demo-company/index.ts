import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  siren: string;
}

interface InseeCompanyData {
  success: boolean;
  data: {
    siren: string;
    siret: string;
    companyName: string;
    legalForm: string;
    nafCode: string;
    address: string;
    city: string;
    postalCode: string;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎮 Nouvelle inscription démo reçue');
    
    const requestData = await req.json() as RegistrationRequest;
    const { email, password, firstName, lastName, phoneNumber, siren } = requestData;

    // Validation basique des inputs
    if (!email || !password || !firstName || !lastName || !siren) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Tous les champs obligatoires doivent être remplis',
          code: 'MISSING_FIELDS'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Format d\'email invalide',
          code: 'INVALID_EMAIL'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validation du mot de passe (minimum 8 caractères)
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Le mot de passe doit contenir au moins 8 caractères',
          code: 'WEAK_PASSWORD'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 1. Valider le SIREN et récupérer les données INSEE
    console.log(`🔍 Validation du SIREN: ${siren}`);
    
    const inseeResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/insee-sirene`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ siren })
      }
    );

    if (!inseeResponse.ok) {
      console.error('❌ Erreur validation SIREN:', inseeResponse.status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'SIREN invalide ou entreprise non trouvée',
          code: 'SIREN_INVALID'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const inseeData: InseeCompanyData = await inseeResponse.json();
    
    if (!inseeData.success || !inseeData.data) {
      console.error('❌ Données INSEE invalides:', inseeData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: inseeData.error || 'Impossible de récupérer les données de l\'entreprise',
          code: 'SIREN_INVALID'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ SIREN validé:', inseeData.data.companyName);

    // 2. Créer le client Supabase Admin (nécessaire pour migration_errors si validation échoue)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 3. Valider le numéro de téléphone avec Numverify
    if (phoneNumber) {
      console.log('📞 Validation du numéro de téléphone avec Numverify:', phoneNumber);
      
      try {
        const numverifyApiKey = Deno.env.get('NUMVERIFY_API_KEY');
        
        if (!numverifyApiKey) {
          console.warn('⚠️ NUMVERIFY_API_KEY non configurée, validation du téléphone ignorée');
        } else {
          // Nettoyer le numéro (enlever espaces et caractères spéciaux)
          const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
          
          const numverifyResponse = await fetch(
            `http://apilayer.net/api/validate?access_key=${numverifyApiKey}&number=${cleanPhone}&country_code=&format=1`
          );

          if (numverifyResponse.ok) {
            const phoneData = await numverifyResponse.json();
            console.log('📞 Réponse Numverify:', phoneData);

            if (!phoneData.valid) {
              console.error('❌ Numéro de téléphone invalide selon Numverify:', phoneData);
              
              // Créer une entrée dans migration_errors (nous devons d'abord créer une company temporaire ou la créer après)
              // Pour l'instant, on retourne juste l'erreur
              return new Response(
                JSON.stringify({ 
                  success: false, 
                  error: 'Le numéro de téléphone fourni est invalide',
                  code: 'INVALID_PHONE_NUMBER',
                  details: {
                    number: phoneNumber,
                    country: phoneData.country_name || 'inconnu',
                    carrier: phoneData.carrier || 'inconnu'
                  }
                }),
                { 
                  status: 400, 
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                }
              );
            }
            
            console.log('✅ Numéro de téléphone valide:', {
              country: phoneData.country_name,
              format: phoneData.international_format,
              carrier: phoneData.carrier,
              lineType: phoneData.line_type
            });
          } else {
            console.warn('⚠️ Erreur API Numverify (non bloquant):', numverifyResponse.status);
          }
        }
      } catch (numverifyError) {
        console.error('⚠️ Erreur lors de la validation Numverify (non bloquant):', numverifyError);
      }
    }

    // 4. Vérifier si l'email existe déjà
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUser?.users.some(u => u.email === email);
    
    if (emailExists) {
      console.warn('⚠️ Email déjà utilisé:', email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Cette adresse email est déjà utilisée',
          code: 'EMAIL_EXISTS'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 5. Construire l'adresse complète pour la géolocalisation
    const fullAddress = `${inseeData.data.address}, ${inseeData.data.postalCode} ${inseeData.data.city}`;

    // 6. Créer l'utilisateur avec auto-confirmation
    console.log('👤 Création de l\'utilisateur:', email);
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmer l'email pour la démo
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        is_team_member: 'false', // Important pour déclencher la création d'entreprise
        company_siren: inseeData.data.siren,
        company_name: inseeData.data.companyName,
        company_siret: inseeData.data.siret,
        company_address: fullAddress,
        company_vat_number: '', // Sera calculé si nécessaire
        demo_origin: 'gamified_site' // Marqueur pour tracking
      }
    });

    if (userError) {
      console.error('❌ Erreur création utilisateur:', userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Impossible de créer le compte: ${userError.message}`,
          code: 'USER_CREATION_FAILED'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Utilisateur créé:', userData.user.id);

    // 7. Attendre que le trigger handle_new_user se termine
    console.log('⏳ Attente du trigger handle_new_user...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 8. Récupérer la company_id créée par le trigger
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('user_companies')
      .select('company_id')
      .eq('user_id', userData.user.id)
      .single();

    if (companyError || !companyData) {
      console.error('❌ Entreprise non créée par le trigger:', companyError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'L\'entreprise n\'a pas été créée automatiquement',
          code: 'COMPANY_CREATION_FAILED'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Entreprise créée par trigger:', companyData.company_id);

    // 9. Générer un lien de connexion automatique
    console.log('🔗 Génération du lien de connexion...');
    
    const { data: sessionData, error: sessionError } = 
      await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: email
      });

    if (sessionError) {
      console.error('⚠️ Erreur génération lien (non bloquant):', sessionError);
    }

    const loginLink = sessionData?.properties?.action_link || null;
    console.log('✅ Lien de connexion généré');

    // 10. Logger l'inscription réussie
    console.log('🎉 Inscription démo réussie:', {
      userId: userData.user.id,
      email: userData.user.email,
      companyId: companyData.company_id,
      companyName: inseeData.data.companyName,
      origin: 'gamified_site'
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          companyId: companyData.company_id,
          companyName: inseeData.data.companyName
        },
        loginLink: loginLink
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Erreur inattendue:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Une erreur inattendue s\'est produite',
        code: 'SERVER_ERROR',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
