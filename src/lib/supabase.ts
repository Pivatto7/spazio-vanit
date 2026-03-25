import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zmhvbwejbodekozizfyh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aSAOIQmffY0jrE9tOYIZ0Q__UclUvX2';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Local storage will be used as fallback.');
}

// Cria o cliente se tiver as chaves válidas. 
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createClient('https://placeholder.supabase.co', 'placeholder') as any;
