import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function RestaurantMenu() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/menu-items/restaurant/${id}`)
      .then((res) => setItems(res.data))
      .catch(() => setError('Failed to load menu.'))
      .finally(() => setLoading(false));
  }, [id]);

  const setQty = (itemId, qty) => {
    setCart((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: qty };
    });
  };

  const cartTotal = items
    .filter((i) => cart[i.id])
    .reduce((sum, i) => sum + i.price * cart[i.id], 0);

  const handleOrder = async () => {
    setOrdering(true);
    setError('');
    try {
      const orderItems = Object.entries(cart).map(([menuItemId, quantity]) => ({
        menuItemId: Number(menuItemId),
        quantity,
      }));
      await api.post('/api/orders', {
        userId: user.id,
        restaurantId: Number(id),
        items: orderItems,
      });
      navigate('/customer/orders');
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/customer/restaurants')} className="text-sm text-orange-500 hover:underline mb-4 block">
          ← Back to restaurants
        </button>

        {loading && <p className="text-gray-500">Loading menu…</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          {items.filter((i) => i.isAvailable).map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category} · ${item.price.toFixed(2)}</p>
                {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(item.id, (cart[item.id] || 0) - 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                >−</button>
                <span className="w-5 text-center text-sm">{cart[item.id] || 0}</span>
                <button
                  onClick={() => setQty(item.id, (cart[item.id] || 0) + 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        {cartCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-4 flex items-center gap-6">
            <span className="text-sm text-gray-600">{cartCount} item{cartCount > 1 ? 's' : ''} · <span className="font-semibold">${cartTotal.toFixed(2)}</span></span>
            <button
              onClick={handleOrder}
              disabled={ordering}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {ordering ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
