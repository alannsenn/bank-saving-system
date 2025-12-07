'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomer()
  }, [])

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${resolvedParams.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch customer')
      }
      const data = await response.json()
      setName(data.name)
    } catch (err) {
      setError('Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/customers/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })

      if (!response.ok) {
        throw new Error('Failed to update customer')
      }

      router.push('/customers')
    } catch (err) {
      setError('Failed to update customer')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/customers/${resolvedParams.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete customer')
      }

      router.push('/customers')
    } catch (err) {
      setError('Failed to delete customer')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-gray-900">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Customer</h1>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Customer Name
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

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/customers')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 ml-auto"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
