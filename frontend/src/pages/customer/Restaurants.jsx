import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    const request = query.trim()
      ? api.get('/api/restaurants/search', { params: { query } })
      : api.get('/api/restaurants');

    request
      .then((res) => setRestaurants(res.data))
      .catch(() => setError('Failed to load restaurants.'))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Restaurants</h2>
          <input
            type="text"
            placeholder="Search restaurants…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && restaurants.length === 0 && query && (
          <p className="text-gray-400">No restaurants found for "{query}".</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/customer/restaurants/${r.id}`)}
              className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{r.name}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {r.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{r.cuisineType}</p>
              <p className="text-sm text-gray-400 line-clamp-2">{r.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>⭐ {r.rating ?? '—'}</span>
                <span>{r.address}</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
