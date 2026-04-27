import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function CreateRestaurant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    cuisineType: '',
    address: '',
    isOpen: true,
    rating: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/restaurants', {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : null,
      });
      navigate('/owner/dashboard');
    } catch {
      setError('Failed to create restaurant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-6 py-8">
        <button onClick={() => navigate('/owner/dashboard')} className="text-sm text-orange-500 hover:underline mb-4 block">
          ← Back to dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">New restaurant</h2>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
          {[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'cuisineType', label: 'Cuisine type', type: 'text' },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'rating', label: 'Rating (0–5)', type: 'number' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                min={type === 'number' ? 0 : undefined}
                max={type === 'number' ? 5 : undefined}
                step={type === 'number' ? 0.1 : undefined}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="isOpen"
              checked={form.isOpen}
              onChange={handleChange}
              className="accent-orange-500"
            />
            Open for orders
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create restaurant'}
          </button>
        </form>
      </main>
    </div>
  );
}
