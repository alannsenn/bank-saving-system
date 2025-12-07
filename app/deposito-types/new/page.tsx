'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewDepositoTypePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [yearlyReturn, setYearlyReturn] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/deposito-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          yearlyReturn: parseFloat(yearlyReturn) / 100
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create deposito type')
      }

      router.push('/deposito-types')
    } catch (err) {
      setError('Failed to create deposito type')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Deposito Type</h1>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Deposito Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="yearlyReturn" className="block text-sm font-semibold text-gray-900 mb-2">
              Yearly Return (%)
            </label>
            <input
              type="number"
              id="yearlyReturn"
              value={yearlyReturn}
              onChange={(e) => setYearlyReturn(e.target.value)}
              required
              step="0.01"
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
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Deposito Type'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/deposito-types')}
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
