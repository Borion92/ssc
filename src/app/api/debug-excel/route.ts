import { NextRequest, NextResponse } from 'next/server'
import * as xlsx from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer()
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to array format
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

    // Convert to HTML table for better visualization
    const htmlTable = data.slice(0, 10).map((row: any) =>
      `<tr>${Array.isArray(row) ? row.map(cell => `<td>${cell}</td>`).join('') : `<td>${JSON.stringify(row)}</td>`}</tr>`
    ).join('')

    return NextResponse.json({
      sheetName,
      totalRows: data.length,
      firstRow: data[0],
      first10Rows: data.slice(0, 10),
      htmlTable: `<table border="1">${htmlTable}</table>`
    })

  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}