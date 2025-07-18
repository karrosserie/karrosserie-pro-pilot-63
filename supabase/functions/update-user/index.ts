import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UpdateUserRequest {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  active: boolean;
  userCompanyId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify the user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: user, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { 
      userId, 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      role, 
      active, 
      userCompanyId 
    }: UpdateUserRequest = await req.json();

    console.log("Updating user:", { userId, firstName, lastName, email, role, active });

    // Update user email in auth.users if it has changed
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        email,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber
        }
      }
    );

    if (authError) {
      console.error("Auth update error:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to update user authentication data: " + authError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update profile in profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber
      })
      .eq('id', userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to update profile: " + profileError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update role and status in user_companies table
    const { error: roleError } = await supabaseAdmin
      .from('user_companies')
      .update({ 
        role: role,
        active: active
      })
      .eq('id', userCompanyId);

    if (roleError) {
      console.error("Role update error:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to update user role: " + roleError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in update-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);