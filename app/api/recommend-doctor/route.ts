/**
 * API route for doctor recommendation using ML models
 */
import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { condition, symptoms } = body

    if (
      (!condition || typeof condition !== 'string') &&
      (!symptoms || typeof symptoms !== 'string')
    ) {
      return NextResponse.json(
        { error: 'Condition or symptoms is required' },
        { status: 400 }
      )
    }

    // Call ML service
    const response = await fetch(`${ML_SERVICE_URL}/api/recommend-doctor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ condition: condition || '', symptoms: symptoms || '' }),
    })

    if (!response.ok) {
      throw new Error(`ML service error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error recommending doctor:', error)
    
    // Fallback response
    return NextResponse.json(
      {
        specialization: 'General Physician',
        department: 'General Medicine',
        confidence: 0.5,
        alternative_specializations: ['Internal Medicine'],
        error: 'ML service temporarily unavailable. Please try again later.'
      },
      { status: 200 }
    )
  }
}

