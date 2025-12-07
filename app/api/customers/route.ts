import { NextResponse } from 'next/server'
import { customerController } from '@/lib/controllers/customerController'

export async function GET() {
  try {
    const customers = await customerController.getAll()
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const customer = await customerController.create(body)
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
