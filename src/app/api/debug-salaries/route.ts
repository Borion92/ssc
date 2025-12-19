import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  // Get all salaries
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get unique months
  const { data: monthsData } = await supabase
    .from('salaries')
    .select('month')

  const uniqueMonths = [...new Set(monthsData?.map(m => m.month) || [])]

  return NextResponse.json({
    sampleData: data,
    count: data?.length || 0,
    uniqueMonths: uniqueMonths.sort(),
    sampleMonthFormats: monthsData?.slice(0, 5)
  })
}