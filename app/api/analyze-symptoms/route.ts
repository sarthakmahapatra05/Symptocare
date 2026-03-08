/**
 * API route for symptom analysis using ML models
 */
import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000'
const ML_FALLBACK_URL = ML_SERVICE_URL.includes('localhost')
  ? ML_SERVICE_URL.replace('localhost', '127.0.0.1')
  : null

async function callMlAnalyze(symptoms: string) {
  const urls = [ML_SERVICE_URL, ML_FALLBACK_URL].filter(Boolean) as string[]
  let lastError: unknown = null

  for (const baseUrl of urls) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(`${baseUrl}/api/analyze-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`ML service error at ${baseUrl}: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error
      console.error(`Analyze symptoms call failed for ${baseUrl}:`, error)
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError ?? new Error('ML service is unreachable')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symptoms } = body

    if (!symptoms || typeof symptoms !== 'string') {
      return NextResponse.json(
        { error: 'Symptoms text is required' },
        { status: 400 }
      )
    }

    const data = await callMlAnalyze(symptoms)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error analyzing symptoms:', error)
    
    // Fallback response if ML service is unavailable
    return NextResponse.json(
      {
        conditions: [
          {
            name: 'General Consultation',
            description: 'Please consult with a healthcare professional for proper diagnosis.',
            confidence: 0.5,
            recommended_specialist: 'General Physician',
            recommended_department: 'General Medicine'
          }
        ],
        primary_recommendation: {
          name: 'General Consultation',
          description: 'Please consult with a healthcare professional for proper diagnosis.',
          confidence: 0.5,
          recommended_specialist: 'General Physician',
          recommended_department: 'General Medicine'
        },
        error: 'ML service temporarily unavailable. Please try again later.'
      },
      { status: 200 } // Return 200 with fallback data
    )
  }
}

