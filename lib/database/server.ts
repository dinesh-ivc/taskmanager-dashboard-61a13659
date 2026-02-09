/**
 * Server-side database client factory
 * Automatically selects the appropriate database client based on environment
 * 
 * For base apps (Aurora): Uses Aurora PostgreSQL (lib/database/aurora)
 * For client apps (Supabase): Uses Supabase (lib/supabase/server)
 * 
 * IMPORTANT: This file should NOT be copied to Aurora-only apps.
 * Aurora apps should directly import from './aurora' instead.
 */

// Check which database provider is configured
const isAurora = !!process.env.DATABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL;
const isSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Get the appropriate database client based on configuration
 * @returns {Promise<any>} - Database client (Aurora Pool or Supabase Client)
 */
export async function getDatabaseClient() {
  if (isAurora) {
    // Use Aurora PostgreSQL - dynamic import to avoid requiring Supabase in Aurora-only apps
    const { getPool } = await import('./aurora');
    return getPool();
  } else if (isSupabase) {
    // Use Supabase - dynamic import to avoid errors if Supabase files don't exist
    const { createClient } = await import('../supabase/server');
    return await createClient();
  } else {
    throw new Error(
      'No database configuration found. ' +
      'Please set either DATABASE_URL (for Aurora) or NEXT_PUBLIC_SUPABASE_URL (for Supabase).'
    );
  }
}

/**
 * Get database type
 * @returns {'aurora' | 'supabase' | 'unknown'}
 */
export function getDatabaseType(): 'aurora' | 'supabase' | 'unknown' {
  if (isAurora) return 'aurora';
  if (isSupabase) return 'supabase';
  return 'unknown';
}

