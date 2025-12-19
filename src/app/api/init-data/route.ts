import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // 默认城市数据
    const defaultCities = [
      {
        city_name: '烟台',
        year: 2024,
        base_min: 4546,
        base_max: 26421,
        rate: 0.14
      },
      {
        city_name: '烟台',
        year: 2025,
        base_min: 4504,
        base_max: 22518,
        rate: 0.14
      }
    ]

    // 插入或更新城市数据
    const { error } = await supabase
      .from('cities')
      .upsert(defaultCities, { onConflict: 'city_name,year' })

    if (error) {
      console.error('Error inserting cities:', error)
      return NextResponse.json(
        { error: 'Failed to insert city data', details: error.message },
        { status: 500 }
      )
    }

    // 验证插入的数据
    const { data: cities, error: fetchError } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', '烟台')

    if (fetchError) {
      console.error('Error fetching cities:', fetchError)
    }

    return NextResponse.json({
      message: 'Default city data initialized successfully',
      cities: cities || [],
      inserted: defaultCities.length
    })

  } catch (error) {
    console.error('Init data error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET方法用于检查当前数据状态
export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // 获取所有城市数据
    const { data: cities, error } = await supabase
      .from('cities')
      .select('*')
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching cities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cities', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Current city data',
      cities: cities || [],
      count: cities?.length || 0
    })

  } catch (error) {
    console.error('Check data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}