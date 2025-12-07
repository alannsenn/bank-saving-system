import { NextResponse } from 'next/server'
import { accountController } from '@/lib/controllers/accountController'

export async function GET() {
  try {
    const accounts = await accountController.getAll()
    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const account = await accountController.create(body)
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
