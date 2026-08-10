import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- PHONE OTP AUTHENTICATION ---
export async function signInWithPhone(phoneNumber: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
  });
  return { data, error };
}

export async function verifyOTP(phoneNumber: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: token,
    type: "sms",
  });
  return { data, error };
}
