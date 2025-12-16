import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateUserRequest {
  userId?: string;
  profileData?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    company_name?: string;
    avatar_url?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the user's token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authenticated user:', user.id);

    const { userId, profileData }: UpdateUserRequest = await req.json();
    
    // Use the authenticated user's ID if no userId is provided, or verify the user has permission
    const targetUserId = userId || user.id;
    
    // For security, only allow users to update their own profile unless they have admin permissions or are company owners
    if (targetUserId !== user.id) {
      console.log('User attempting to update different user profile:', { requestingUser: user.id, targetUser: targetUserId });
      
      // Check if the requesting user is a company owner who can manage their team members
      const { data: requestingUserCompany, error: ownerError } = await supabaseClient
        .from('user_companies')
        .select('role, company_id')
        .eq('user_id', user.id)
        .eq('role', 'Propriétaire')
        .eq('active', true)
        .single();

      if (ownerError || !requestingUserCompany) {
        console.error('User is not a company owner:', ownerError);
        return new Response(
          JSON.stringify({ error: 'Unauthorized to update this user' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if the target user belongs to the same company
      const { data: targetUserCompany, error: targetError } = await supabaseClient
        .from('user_companies')
        .select('company_id')
        .eq('user_id', targetUserId)
        .eq('company_id', requestingUserCompany.company_id)
        .eq('active', true)
        .single();

      if (targetError || !targetUserCompany) {
        console.error('Target user does not belong to the same company:', targetError);
        return new Response(
          JSON.stringify({ error: 'Unauthorized to update this user' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Company owner authorized to update team member profile');
    }

    if (!profileData) {
      return new Response(
        JSON.stringify({ error: 'No profile data provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Updating profile for user:', targetUserId, 'with data:', profileData);

    // Update or create the user's profile using upsert
    const { data, error } = await supabaseClient
      .from('profiles')
      .upsert({
        id: targetUserId,
        ...profileData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Profile updated successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profile updated successfully',
        data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in update-user function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});