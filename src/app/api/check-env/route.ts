import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Don't expose the actual keys, just check if they exist
  const envStatus = {
    supabaseUrl: {
      configured: !!supabaseUrl,
      value: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not configured'
    },
    supabaseAnonKey: {
      configured: !!supabaseAnonKey,
      value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not configured'
    },
    nodeEnv: process.env.NODE_ENV
  }

  // Try to connect to Supabase if configured
  let connectionStatus = 'Not tested'
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      })
      connectionStatus = response.ok ? 'Connected' : `Failed: ${response.status}`
    } catch (error) {
      connectionStatus = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  return NextResponse.json({
    environment: envStatus,
    connectionStatus,
    timestamp: new Date().toISOString()
  })
}