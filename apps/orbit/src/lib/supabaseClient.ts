import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClientComponentClient();

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      error: 'Failed to initialize authentication. Please check your configuration.' 
    };
  }
};
