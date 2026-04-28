import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function OwnerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/api/restaurants/owner/${user.id}`)
      .then((res) => setRestaurants(res.data))
      .catch(() => setError('Failed to load restaurants.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Restaurants</h2>
          <button
            onClick={() => navigate('/owner/restaurants/create')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + New restaurant
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{r.name}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {r.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{r.cuisineType} · {r.address}</p>
              <button
                onClick={() => navigate(`/owner/restaurants/${r.id}/menu`)}
                className="w-full text-sm border border-gray-300 hover:bg-gray-50 rounded-lg py-1.5 transition-colors"
              >
                Manage menu
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
