import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
import { parseCitiesExcel } from '@/lib/excel-parser'

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

    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('Cities upload request. File:', file ? file.name : 'No file')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file' },
        { status: 400 }
      )
    }

    // Parse the Excel file
    const buffer = await file.arrayBuffer()
    const cities = parseCitiesExcel(buffer)

    if (cities.length === 0) {
      return NextResponse.json(
        { error: 'No valid city data found in the file' },
        { status: 400 }
      )
    }

    // Insert data into Supabase
    const { error } = await supabase
      .from('cities')
      .insert(cities)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save city data to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully uploaded ${cities.length} city records`,
      count: cities.length
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}