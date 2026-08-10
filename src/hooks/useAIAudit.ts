import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAIAudit(userId: string, businessId: string) {
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const triggerAudit = async () => {
    setLoading(true);
    setErrorMsg(null);

    // 1. Fetch user API limit status
    const { data: profile } = await supabase
      .from("profiles")
      .select("monthly_api_usage, max_monthly_api_limit, subscription_status")
      .eq("id", userId)
      .single();

    if (profile && profile.monthly_api_usage >= profile.max_monthly_api_limit) {
      setLoading(false);
      setErrorMsg("⚠️ ናይዚ ወርሒ ናይ AI ኦዲት ገደብካ (Limit) ተወዲኡ ኣሎ። ብ Mobile Money ኣሐድስ።");
      return;
    }

    // 2. Call Supabase Edge Function (Gemini API Integration)
    const { data, error } = await supabase.functions.invoke("deep-ai-audit", {
      body: { userId, businessId },
    });

    if (error) {
      setErrorMsg("ጸብጻብ ኣብ ምምጻእ ጸገም ኣጋጢሙ።");
    } else {
      setAuditResult(data.result);
    }
    setLoading(false);
  };

  return { triggerAudit, loading, auditResult, errorMsg };
}
