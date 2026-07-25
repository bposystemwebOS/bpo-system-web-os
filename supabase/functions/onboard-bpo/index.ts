import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { bpoName, adminName, adminEmail, password } = await req.json();

    if (!bpoName || !adminName || !adminEmail || !password) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatorios ausentes." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: bpoData, error: bpoError } = await supabaseAdmin
      .from("bpo_tenants")
      .insert([{ name: bpoName }])
      .select("id")
      .single();

    if (bpoError) throw bpoError;
    const bpoId = bpoData.id;

    const { error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        bpo_id: bpoId,
        role: "admin",
        full_name: adminName,
      },
    });

    if (userError) {
      await supabaseAdmin.from("bpo_tenants").delete().eq("id", bpoId);
      throw userError;
    }

    return new Response(
      JSON.stringify({ success: true, bpoId, message: "Tenant provisionado com sucesso." }),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 200 }
    );
  } catch (error) {
    console.error("Erro no onboarding:", error);
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 400 }
    );
  }
});
