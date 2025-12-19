import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    vercel: {
      env: process.env.NODE_ENV,
      url: process.env.VERCEL_URL
    }
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'POST API is working!',
    received: 'OK'
  })
}