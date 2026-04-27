import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', isAvailable: true };

export default function ManageMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = () =>
    api.get(`/api/menu-items/restaurant/${id}`)
      .then((res) => setItems(res.data))
      .catch(() => setError('Failed to load menu items.'))
      .finally(() => setLoading(false));

  useEffect(() => { fetchItems(); }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/api/menu-items', {
        ...form,
        price: parseFloat(form.price),
        restaurant: { id: Number(id) },
      });
      setForm(EMPTY_FORM);
      fetchItems();
    } catch {
      setError('Failed to add menu item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/owner/dashboard')} className="text-sm text-orange-500 hover:underline mb-4 block">
          ← Back to dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage menu</h2>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* Add item form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <h3 className="font-semibold text-gray-700 mb-4">Add item</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { name: 'name', label: 'Name', type: 'text' },
              { name: 'category', label: 'Category', type: 'text' },
              { name: 'price', label: 'Price ($)', type: 'number' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name !== 'description'}
                  min={type === 'number' ? 0 : undefined}
                  step={type === 'number' ? 0.01 : undefined}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="accent-orange-500" />
              Available
            </label>
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding…' : 'Add item'}
            </button>
          </div>
        </form>

        {/* Item list */}
        {loading && <p className="text-gray-500">Loading…</p>}
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">{item.category} · ${item.price?.toFixed(2)}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
