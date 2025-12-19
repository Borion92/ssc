import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

// Initialize Supabase client
function initializeSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables are configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured. Please copy .env.example to .env.local and fill in your Supabase credentials.')
    return
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    console.error('Invalid Supabase URL format. Please check your NEXT_PUBLIC_SUPABASE_URL.')
    return
  }

  // Initialize client if not already done
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
}

// Export function that gets the client
export function getSupabaseClient() {
  if (!supabaseClient) {
    initializeSupabase()
  }
  return supabaseClient
}

// For backward compatibility
export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseClient()  // Using same client for simplicity