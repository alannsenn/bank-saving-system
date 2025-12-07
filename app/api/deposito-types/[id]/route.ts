import { NextResponse } from 'next/server'
import { depositoTypeController } from '@/lib/controllers/depositoTypeController'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const depositoType = await depositoTypeController.getById(parseInt(id))
    if (!depositoType) {
      return NextResponse.json({ error: 'Deposito type not found' }, { status: 404 })
    }
    return NextResponse.json(depositoType)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deposito type' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const depositoType = await depositoTypeController.update(parseInt(id), body)
    return NextResponse.json(depositoType)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update deposito type' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await depositoTypeController.delete(parseInt(id))
    return NextResponse.json({ message: 'Deposito type deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete deposito type' }, { status: 500 })
  }
}
