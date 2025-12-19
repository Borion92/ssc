import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to see what's being sent
    const body = await request.text()
    console.log('Request body:', body)

    return NextResponse.json({
      message: 'Request received successfully',
      body: body
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}