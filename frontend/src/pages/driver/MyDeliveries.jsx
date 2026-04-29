import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const DELIVERY_STATUSES = ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];

const STATUS_COLORS = {
  ASSIGNED: 'bg-yellow-100 text-yellow-700',
  PICKED_UP: 'bg-blue-100 text-blue-700',
  ON_THE_WAY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
};

export default function MyDeliveries() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get(`/api/deliveries/driver/${user.id}`)
      .then((res) => setDeliveries(res.data))
      .catch(() => setError('Failed to load deliveries.'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleStatusChange = async (deliveryId, status) => {
    setUpdating(deliveryId);
    try {
      const res = await api.put(`/api/deliveries/${deliveryId}/status`, null, {
        params: { status },
      });
      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? { ...d, status: res.data.status } : d))
      );
    } catch {
      setError('Failed to update delivery status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Deliveries</h2>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && deliveries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🛵</p>
            <p className="font-medium text-gray-700">No deliveries yet</p>
            <p className="text-sm text-gray-400 mt-1">You'll see your assigned deliveries here.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{delivery.deliveryAddress}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Order #{delivery.order?.id} · {new Date(delivery.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[delivery.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {delivery.status.replace(/_/g, ' ')}
                </span>
              </div>

              {delivery.status !== 'DELIVERED' && (
                <div className="flex items-center gap-2 mt-3">
                  <select
                    defaultValue={delivery.status}
                    id={`status-${delivery.id}`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {DELIVERY_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <button
                    disabled={updating === delivery.id}
                    onClick={() => {
                      const select = document.getElementById(`status-${delivery.id}`);
                      handleStatusChange(delivery.id, select.value);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating === delivery.id ? 'Saving…' : 'Update'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
