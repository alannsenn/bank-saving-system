import { NextResponse } from 'next/server'
import { accountController } from '@/lib/controllers/accountController'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { amount, date } = body

    if (!amount || !date) {
      return NextResponse.json({ error: 'Amount and date are required' }, { status: 400 })
    }

    const account = await accountController.withdraw(parseInt(id), parseFloat(amount), new Date(date))
    return NextResponse.json(account)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to withdraw'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
