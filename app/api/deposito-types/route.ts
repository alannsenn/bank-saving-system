import { NextResponse } from 'next/server'
import { depositoTypeController } from '@/lib/controllers/depositoTypeController'

export async function GET() {
  try {
    const depositoTypes = await depositoTypeController.getAll()
    return NextResponse.json(depositoTypes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deposito types' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const depositoType = await depositoTypeController.create(body)
    return NextResponse.json(depositoType, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deposito type' }, { status: 500 })
  }
}
