'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface Transaction {
  id: number
  type: string
  amount: number
  date: string
  createdAt: string
}

interface Account {
  id: number
  balance: number
  depositDate: string | null
  customer: {
    id: number
    name: string
  }
  depositoType: {
    id: number
    name: string
    yearlyReturn: number
  }
  transactions: Transaction[]
}

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [depositAmount, setDepositAmount] = useState('')
  const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0])
  const [depositLoading, setDepositLoading] = useState(false)

  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawDate, setWithdrawDate] = useState(new Date().toISOString().split('T')[0])
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [calculatedBalance, setCalculatedBalance] = useState<number | null>(null)

  useEffect(() => {
    fetchAccount()
  }, [])

  useEffect(() => {
    if (account && account.depositDate && withdrawDate) {
      calculateEndingBalance()
    }
  }, [withdrawDate, account])

  const fetchAccount = async () => {
    try {
      const response = await fetch(`/api/accounts/${resolvedParams.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch account')
      }
      const data = await response.json()
      setAccount(data)
    } catch (err) {
      setError('Failed to load account')
    } finally {
      setLoading(false)
    }
  }

  const calculateEndingBalance = () => {
    if (!account?.depositDate) return

    const depositDateObj = new Date(account.depositDate)
    const withdrawDateObj = new Date(withdrawDate)

    const months = (withdrawDateObj.getFullYear() - depositDateObj.getFullYear()) * 12 +
                   (withdrawDateObj.getMonth() - depositDateObj.getMonth())

    const monthlyReturn = account.depositoType.yearlyReturn / 12
    const endingBalance = account.balance + (account.balance * Math.max(months, 0) * monthlyReturn)

    setCalculatedBalance(endingBalance)
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDepositLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/accounts/${resolvedParams.id}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          date: depositDate
        })
      })

      if (!response.ok) {
        throw new Error('Failed to deposit')
      }

      setDepositAmount('')
      await fetchAccount()
    } catch (err) {
      setError('Failed to deposit')
    } finally {
      setDepositLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setWithdrawLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/accounts/${resolvedParams.id}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          date: withdrawDate
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to withdraw')
      }

      setWithdrawAmount('')
      setCalculatedBalance(null)
      await fetchAccount()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw')
    } finally {
      setWithdrawLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this account?')) {
      return
    }

    try {
      const response = await fetch(`/api/accounts/${resolvedParams.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      router.push('/accounts')
    } catch (err) {
      setError('Failed to delete account')
    }
  }

  if (loading) {
    return <div className="text-gray-900">Loading...</div>
  }

  if (!account) {
    return <div className="text-gray-900">Account not found</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Account Details</h1>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Account Information</h2>
          <div className="space-y-3">
            <div className="text-gray-900">
              <span className="font-semibold text-gray-900">Account ID:</span> {account.id}
            </div>
            <div className="text-gray-900">
              <span className="font-semibold text-gray-900">Customer:</span> {account.customer.name}
            </div>
            <div className="text-gray-900">
              <span className="font-semibold text-gray-900">Deposito Type:</span> {account.depositoType.name}
            </div>
            <div className="text-gray-900">
              <span className="font-semibold text-gray-900">Yearly Return:</span> {(account.depositoType.yearlyReturn * 100).toFixed(2)}%
            </div>
            <div className="text-gray-900">
              <span className="font-semibold text-gray-900">Current Balance:</span> Rp{account.balance.toLocaleString('id-ID')}
            </div>
            {account.depositDate && (
              <div className="text-gray-900">
                <span className="font-semibold text-gray-900">Deposit Date:</span> {new Date(account.depositDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Deposit</h2>
          <form onSubmit={handleDeposit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date
              </label>
              <input
                type="date"
                value={depositDate}
                onChange={(e) => setDepositDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={depositLoading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {depositLoading ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Withdraw</h2>
          <form onSubmit={handleWithdraw}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Withdrawal Date
              </label>
              <input
                type="date"
                value={withdrawDate}
                onChange={(e) => setWithdrawDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            {calculatedBalance !== null && (
              <div className="mb-4 p-3 bg-blue-100 rounded">
                <div className="text-sm font-semibold text-gray-900">Ending Balance:</div>
                <div className="text-2xl font-bold text-blue-600">
                  Rp{Math.round(calculatedBalance).toLocaleString('id-ID')}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={withdrawLoading}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              {withdrawLoading ? 'Processing...' : 'Withdraw'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {account.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-3 rounded ${
                  transaction.type === 'DEPOSIT'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-orange-50 border border-orange-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-900">{transaction.type}</span>
                    <div className="text-sm text-gray-700">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    Rp{transaction.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
            {account.transactions.length === 0 && (
              <div className="text-center text-gray-600">No transactions yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
