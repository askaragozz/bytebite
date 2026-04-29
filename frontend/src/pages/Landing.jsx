import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <span className="text-xl font-bold text-orange-500">ByteBite</span>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Food delivery,<br />
          <span className="text-orange-500">built from scratch.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-lg">
          Order from local restaurants, manage your kitchen, or pick up deliveries — all in one platform.
        </p>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Get started free
          </Link>
          <Link
            to="/login"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>

      <section className="max-w-4xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <div className="bg-orange-50 rounded-2xl p-6">
          <div className="text-3xl mb-3">🍔</div>
          <h3 className="font-semibold text-gray-800 mb-1">For Customers</h3>
          <p className="text-sm text-gray-500">Browse restaurants, search by cuisine, and place orders in seconds.</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-6">
          <div className="text-3xl mb-3">🍳</div>
          <h3 className="font-semibold text-gray-800 mb-1">For Owners</h3>
          <p className="text-sm text-gray-500">Manage your restaurants, update menus, and handle incoming orders.</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-6">
          <div className="text-3xl mb-3">🛵</div>
          <h3 className="font-semibold text-gray-800 mb-1">For Drivers</h3>
          <p className="text-sm text-gray-500">Accept deliveries, update your status, and earn on your schedule.</p>
        </div>
      </section>
    </div>
  );
}
