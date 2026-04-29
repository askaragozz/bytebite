import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';

import Restaurants from './pages/customer/Restaurants';
import RestaurantMenu from './pages/customer/RestaurantMenu';
import MyOrders from './pages/customer/MyOrders';

import OwnerDashboard from './pages/owner/OwnerDashboard';
import CreateRestaurant from './pages/owner/CreateRestaurant';
import ManageMenu from './pages/owner/ManageMenu';
import OwnerOrders from './pages/owner/OwnerOrders';

import MyDeliveries from './pages/driver/MyDeliveries';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  if (user.role === 'CUSTOMER') return <Navigate to="/customer/restaurants" replace />;
  if (user.role === 'RESTAURANT_OWNER') return <Navigate to="/owner/dashboard" replace />;
  if (user.role === 'DRIVER') return <Navigate to="/driver/deliveries" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/customer/restaurants" element={<ProtectedRoute role="CUSTOMER"><Restaurants /></ProtectedRoute>} />
          <Route path="/customer/restaurants/:id" element={<ProtectedRoute role="CUSTOMER"><RestaurantMenu /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute role="CUSTOMER"><MyOrders /></ProtectedRoute>} />

          <Route path="/owner/dashboard" element={<ProtectedRoute role="RESTAURANT_OWNER"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/restaurants/create" element={<ProtectedRoute role="RESTAURANT_OWNER"><CreateRestaurant /></ProtectedRoute>} />
          <Route path="/owner/restaurants/:id/menu" element={<ProtectedRoute role="RESTAURANT_OWNER"><ManageMenu /></ProtectedRoute>} />
          <Route path="/owner/orders" element={<ProtectedRoute role="RESTAURANT_OWNER"><OwnerOrders /></ProtectedRoute>} />

          <Route path="/driver/deliveries" element={<ProtectedRoute role="DRIVER"><MyDeliveries /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
