// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function logEvent(event: { type: string; userId?: string; data?: any }) {
  try {
    await supabase.from('events').insert({
      event_type: event.type,
      user_id: event.userId || null,
      event_data: event.data || {},
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log event:', error);
  }
}

export async function createUser(data: { email?: string; score?: number; tier?: string }) {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .insert({
        email: data.email || null,
        assessment_score: data.score || null,
        tier: data.tier || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return userData;
  } catch (error) {
    console.error('Failed to create user:', error);
    return null;
  }
}
