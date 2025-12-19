import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
import { parseSalariesExcel } from '@/lib/excel-parser'

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

    console.log('Request received. File:', file ? file.name : 'No file')

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
    const salaries = parseSalariesExcel(buffer)

    console.log('Parsed salaries:', salaries) // Debug log

    if (salaries.length === 0) {
      return NextResponse.json(
        { error: 'No valid salary data found in the file. Please check your Excel format.', details: 'Make sure columns are: employee_id, employee_name, month, salary_amount' },
        { status: 400 }
      )
    }

    // Insert data into Supabase
    console.log('Attempting to insert salaries into database...')
    const { data, error } = await supabase
      .from('salaries')
      .insert(salaries)
      .select()

    console.log('Insert result:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save salary data to database', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Successfully uploaded ${salaries.length} salary records`,
      count: salaries.length
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}