export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Bank Saving System</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/customers" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Customers</h2>
          <p className="text-gray-700">Manage customer information</p>
        </a>
        <a href="/accounts" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Accounts</h2>
          <p className="text-gray-700">Manage customer accounts and transactions</p>
        </a>
        <a href="/deposito-types" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Deposito Types</h2>
          <p className="text-gray-700">Manage deposito types and interest rates</p>
        </a>
      </div>
    </div>
  );
}
