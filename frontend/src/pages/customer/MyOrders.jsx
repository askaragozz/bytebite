import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/orders/user/${user.id}`)
      .then((res) => setOrders(res.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="text-gray-400">You haven't placed any orders yet.</p>
        )}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{order.restaurant?.name ?? `Restaurant #${order.restaurant?.id}`}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              {order.items?.length > 0 && (
                <ul className="mt-2 text-sm text-gray-500 space-y-0.5">
                  {order.items.map((item) => (
                    <li key={item.id}>{item.menuItem?.name} × {item.quantity}</li>
                  ))}
                </ul>
              )}
              <p className="text-sm text-gray-600 font-medium mt-2">Total: ${order.totalPrice?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
