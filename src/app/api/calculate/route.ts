import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
import { calculateContributions } from '@/lib/calculator'

export async function POST(request: NextRequest) {
  try {
    // Get Supabase client
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 500 }
      )
    }

    const { city, year } = await request.json()

    if (!city || !year) {
      return NextResponse.json(
        { error: 'City and year are required' },
        { status: 400 }
      )
    }

    // Get city standard from database
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', city)
      .eq('year', parseInt(year))
      .single()

    console.log('City query result:', { cityData, cityError }) // Debug

    if (cityError || !cityData) {
      console.log('City standard not found for', city, year)
      return NextResponse.json(
        { error: `City standard not found for ${city} in ${year}` },
        { status: 404 }
      )
    }

    // Get all salary data
    const { data: salariesData, error: salariesError } = await supabase
      .from('salaries')
      .select('*')

    console.log('Salaries query result:', {
      count: salariesData?.length || 0,
      sampleData: salariesData?.slice(0, 3),
      error: salariesError
    }) // Debug

    if (salariesError) {
      console.error('Salaries query error:', salariesError)
      return NextResponse.json(
        { error: 'Failed to fetch salary data' },
        { status: 500 }
      )
    }

    // Calculate contributions
    const results = calculateContributions(
      salariesData || [],
      cityData,
      parseInt(year)
    )

    console.log('Calculation results:', {
      inputCount: salariesData?.length || 0,
      outputCount: results.length,
      sampleResult: results[0]
    }) // Debug

    // Delete old results for this city and year
    const { error: deleteError } = await supabase
      .from('results')
      .delete()
      .eq('city_name', city)
      .eq('year', parseInt(year))

    if (deleteError) {
      console.error('Delete old results error:', deleteError)
      // Continue with insertion even if delete fails
    }

    // Insert new results
    if (results.length > 0) {
      const { error: insertError } = await supabase
        .from('results')
        .insert(results)

      if (insertError) {
        console.error('Insert results error:', insertError)
        return NextResponse.json(
          { error: 'Failed to save calculation results' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      message: `Successfully calculated contributions for ${results.length} employees`,
      count: results.length,
      city: city,
      year: year
    })

  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}