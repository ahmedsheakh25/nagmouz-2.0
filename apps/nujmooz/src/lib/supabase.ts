import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createClientComponentClient();

export async function createChatSession(userId: string, serviceType: string) {
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: userId,
      service_type: serviceType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addMessage(
  sessionId: string,
  role: string,
  content: string,
  audioUrl?: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      session_id: sessionId,
      role,
      content,
      audio_url: audioUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
