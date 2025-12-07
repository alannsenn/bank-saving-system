'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Customer {
  id: number
  name: string
}

interface DepositoType {
  id: number
  name: string
  yearlyReturn: number
}

export default function NewAccountPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>([])
  const [customerId, setCustomerId] = useState('')
  const [depositoTypeId, setDepositoTypeId] = useState('')
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [customersRes, depositoTypesRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/deposito-types')
      ])

      if (!customersRes.ok || !depositoTypesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const customersData = await customersRes.json()
      const depositoTypesData = await depositoTypesRes.json()

      setCustomers(customersData)
      setDepositoTypes(depositoTypesData)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: parseInt(customerId),
          depositoTypeId: parseInt(depositoTypeId),
          balance: parseFloat(balance)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

      router.push('/accounts')
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-gray-900">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Account</h1>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="customer" className="block text-sm font-semibold text-gray-900 mb-2">
              Customer
            </label>
            <select
              id="customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="depositoType" className="block text-sm font-semibold text-gray-900 mb-2">
              Deposito Type
            </label>
            <select
              id="depositoType"
              value={depositoTypeId}
              onChange={(e) => setDepositoTypeId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select a deposito type</option>
              {depositoTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({(type.yearlyReturn * 100).toFixed(2)}% yearly)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="balance" className="block text-sm font-semibold text-gray-900 mb-2">
              Initial Balance
            </label>
            <input
              type="number"
              id="balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitting ? 'Creating...' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/accounts')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
