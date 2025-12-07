import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function DepositoTypesPage() {
  const depositoTypes = await prisma.depositoType.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Deposito Types</h1>
        <Link
          href="/deposito-types/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Deposito Type
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yearly Return
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {depositoTypes.map((depositoType) => (
              <tr key={depositoType.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {depositoType.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {depositoType.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(depositoType.yearlyReturn * 100).toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link
                    href={`/deposito-types/${depositoType.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {depositoTypes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No deposito types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
