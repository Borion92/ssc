import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get Supabase client
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const year = searchParams.get('year')

    // Build query
    let query = supabase
      .from('results')
      .select('*')
      .order('employee_name')

    // Apply filters if provided
    if (city) {
      query = query.eq('city_name', city)
    }
    if (year) {
      query = query.eq('year', parseInt(year))
    }

    const { data, error } = await query

    if (error) {
      console.error('Results query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      count: data?.length || 0
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}