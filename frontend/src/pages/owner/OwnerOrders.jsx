import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const ORDER_STATUSES = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OwnerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [deliveryForms, setDeliveryForms] = useState({});
  const [statusSelects, setStatusSelects] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsRes, driversRes] = await Promise.all([
          api.get(`/api/restaurants/owner/${user.id}`),
          api.get('/api/users/drivers'),
        ]);

        const ordersByRestaurant = await Promise.all(
          restaurantsRes.data.map((r) =>
            api.get(`/api/orders/restaurant/${r.id}`).then((res) =>
              res.data.map((order) => ({ ...order, restaurantName: r.name }))
            )
          )
        );

        const allOrders = ordersByRestaurant
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(allOrders);
        setDrivers(driversRes.data);
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const res = await api.put(`/api/orders/${orderId}/status`, null, { params: { status } });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch {
      setError('Failed to update order status.');
    } finally {
      setUpdating(null);
    }
  };

  const handleAssignDelivery = async (orderId) => {
    const form = deliveryForms[orderId] || {};
    if (!form.driverId || !form.deliveryAddress) return;
    setAssigning(orderId);
    try {
      await api.post('/api/deliveries', {
        orderId,
        driverId: Number(form.driverId),
        deliveryAddress: form.deliveryAddress,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, hasDelivery: true } : o))
      );
    } catch {
      setError('Failed to assign delivery.');
    } finally {
      setAssigning(null);
    }
  };

  const updateForm = (orderId, field, value) => {
    setDeliveryForms((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Orders</h2>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="text-gray-400">No orders yet.</p>
        )}

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{order.restaurantName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Order #{order.id} · {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total: ${order.totalPrice?.toFixed(2)}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>

              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <div className="flex items-center gap-2 mt-3">
                  <select
                    value={statusSelects[order.id] ?? order.status}
                    onChange={(e) => setStatusSelects((prev) => ({ ...prev, [order.id]: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <button
                    disabled={updating === order.id}
                    onClick={() => handleStatusUpdate(order.id, statusSelects[order.id] ?? order.status)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updating === order.id ? 'Saving…' : 'Update'}
                  </button>
                </div>
              )}

              {!order.hasDelivery && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <p className="text-xs font-medium text-gray-500">Assign delivery</p>
                  <div className="flex gap-2">
                    <select
                      value={deliveryForms[order.id]?.driverId || ''}
                      onChange={(e) => updateForm(order.id, 'driverId', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Select driver…</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Delivery address"
                      value={deliveryForms[order.id]?.deliveryAddress || ''}
                      onChange={(e) => updateForm(order.id, 'deliveryAddress', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                      disabled={assigning === order.id}
                      onClick={() => handleAssignDelivery(order.id)}
                      className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {assigning === order.id ? 'Assigning…' : 'Assign'}
                    </button>
                  </div>
                </div>
              )}

              {order.hasDelivery && (
                <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-green-600 font-medium">
                  ✓ Delivery assigned
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
