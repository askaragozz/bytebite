import { useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const ORDER_STATUSES = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'CANCELLED'];

export default function OwnerOrders() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('CONFIRMED');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.put(`/api/orders/${orderId}/status`, null, {
        params: { status },
      });
      setResult(res.data);
    } catch {
      setError('Failed to update order. Check the order ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Update order status</h2>
        <p className="text-sm text-gray-400 mb-6">Enter an order ID to update its status.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <input
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              Order #{result.id} updated to <strong>{result.status.replace(/_/g, ' ')}</strong>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update status'}
          </button>
        </form>
      </main>
    </div>
  );
}
