/**
 * Supabase Client Initialization & Graceful Fallback Bridge
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('bharat_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('bharat_supabase_anon_key') : null;

export const effectiveUrl = (envUrl && !envUrl.includes('your-project') && envUrl !== 'https://your-project.supabase.co')
  ? envUrl
  : localUrl;

export const effectiveKey = (envKey && envKey !== 'your-anon-key')
  ? envKey
  : localKey;

export const isSupabaseConfigured = Boolean(
  effectiveUrl &&
  effectiveKey &&
  effectiveUrl.startsWith('https://') &&
  effectiveUrl.includes('supabase.co')
);

export const createClientInstance = (url: string, key: string): SupabaseClient | null => {
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (e) {
    console.error('Error creating Supabase client:', e);
    return null;
  }
};

export const supabase: SupabaseClient | null = isSupabaseConfigured && effectiveUrl && effectiveKey
  ? createClientInstance(effectiveUrl, effectiveKey)
  : null;

export const getSupabaseConfig = () => ({
  url: effectiveUrl || '',
  key: effectiveKey || '',
  isConfigured: isSupabaseConfigured,
  source: (envUrl && !envUrl.includes('your-project')) ? 'env' : (localUrl ? 'local' : 'none') as 'env' | 'local' | 'none',
});

export const setSupabaseConfig = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('bharat_supabase_url', url.trim());
    localStorage.setItem('bharat_supabase_anon_key', key.trim());
  } else {
    localStorage.removeItem('bharat_supabase_url');
    localStorage.removeItem('bharat_supabase_anon_key');
  }
};
