import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    // Get all data
    const [citiesData, salariesData] = await Promise.all([
      supabase.from('cities').select('*'),
      supabase.from('salaries').select('*')
    ])

    return NextResponse.json({
      cities: {
        data: citiesData.data,
        count: citiesData.data?.length || 0
      },
      salaries: {
        data: salariesData.data?.slice(0, 10), // First 10 records
        count: salariesData.data?.length || 0
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}