import { NextResponse } from 'next/server'
import { accountController } from '@/lib/controllers/accountController'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const account = await accountController.getById(parseInt(id))
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    return NextResponse.json(account)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const account = await accountController.update(parseInt(id), body)
    return NextResponse.json(account)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await accountController.delete(parseInt(id))
    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
