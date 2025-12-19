import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  // Test insert
  const testData = {
    employee_id: 'TEST001',
    employee_name: '测试员工',
    month: 202401,
    salary_amount: 8000
  }

  const { data, error } = await supabase
    .from('salaries')
    .insert([testData])
    .select()

  if (error) {
    console.error('Test insert error:', error)
    return NextResponse.json({
      error: 'Insert failed',
      details: error.message,
      hint: 'Please check if RLS is enabled on the table'
    }, { status: 500 })
  }

  return NextResponse.json({
    message: 'Test insert successful',
    data: data
  })
}

export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  // Get all salaries
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .limit(5)

  return NextResponse.json({
    count: data?.length || 0,
    data: data || [],
    error: error?.message
  })
}