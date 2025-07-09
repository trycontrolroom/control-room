import { NextRequest, NextResponse } from 'next/server'

function validateContactForm(data: any) {
  const errors: string[] = []
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required')
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Valid email is required')
    }
  }
  
  if (!data.issue || typeof data.issue !== 'string' || data.issue.trim().length < 10) {
    errors.push('Please provide more details about your issue (minimum 10 characters)')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name: data.name?.trim(),
      email: data.email?.trim(),
      issue: data.issue?.trim()
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = validateContactForm(body)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      )
    }
    
    const validatedData = validation.data
    
    
    console.log('Support ticket submitted:', {
      name: validatedData.name,
      email: validatedData.email,
      issue: validatedData.issue,
      timestamp: new Date().toISOString()
    })
    
    const emailContent = `
      New Support Ticket Submitted
      
      Name: ${validatedData.name}
      Email: ${validatedData.email}
      Issue: ${validatedData.issue}
      
      Submitted at: ${new Date().toISOString()}
    `
    
    console.log('Email would be sent to support@control-room.ai:', emailContent)
    
    return NextResponse.json(
      { 
        message: 'Support ticket submitted successfully',
        ticketId: `TICKET-${Date.now()}`
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
