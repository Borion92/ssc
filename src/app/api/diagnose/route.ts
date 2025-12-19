import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const results = {
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    },
    connection: null as any,
    tables: null as any,
    citiesData: null as any,
    error: null as string | null
  }

  try {
    // 1. 检查环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      results.error = 'Environment variables not set'
      return NextResponse.json(results)
    }

    // 2. 尝试连接Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 测试基本连接
    const { data, error } = await supabase.from('cities').select('count').single()

    if (error) {
      results.connection = {
        status: 'Failed',
        error: error.message,
        hint: error.hint,
        details: error.details
      }
      results.error = `Connection failed: ${error.message}`
    } else {
      results.connection = {
        status: 'Success',
        message: 'Connected to Supabase'
      }
    }

    // 3. 检查表是否存在 - 直接查询表来检查

    // 直接查询表来检查是否存在
    try {
      const { data: citiesCheck, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .limit(1)

      results.tables = {
        cities: citiesError ? `Error: ${citiesError.message}` : 'Exists'
      }

      // 4. 获取城市数据
      if (!citiesError) {
        const { data: allCities, error: fetchError } = await supabase
          .from('cities')
          .select('*')
          .eq('city_name', '烟台')

        results.citiesData = {
          count: allCities?.length || 0,
          data: allCities || [],
          error: fetchError?.message
        }
      }
    } catch (e) {
      results.tables = {
        cities: `Error: Table may not exist`
      }
      results.error = 'Table cities does not exist or is not accessible'
    }

  } catch (error: any) {
    results.error = `Diagnosis error: ${error.message}`
  }

  return NextResponse.json(results)
}

// POST方法尝试创建表和插入数据
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Environment variables not set' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 尝试插入测试数据
    const testCity = {
      city_name: '烟台',
      year: 2024,
      base_min: 4546,
      base_max: 26421,
      rate: 0.14
    }

    const { data, error } = await supabase
      .from('cities')
      .insert(testCity)
      .select()

    if (error) {
      // 如果是权限错误，尝试使用service role key
      return NextResponse.json({
        error: 'Insert failed',
        details: error.message,
        hint: 'You may need to disable RLS or use service role key',
        testCity
      }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Test data inserted successfully',
      data
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to insert test data',
      details: error.message
    }, { status: 500 })
  }
}