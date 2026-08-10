import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './customer/context/CartContext';
import { LoadingProvider } from './customer/context/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Lazy Load Admin Pages (located in src/pages/ and src/layouts/ from Phase 4 setup)
const Login = lazy(() => import('./pages/Login'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminCategories = lazy(() => import('./pages/Categories'));
const AdminProducts = lazy(() => import('./pages/Products'));

// Lazy Load Customer Pages
const CustomerLayout = lazy(() => import('./customer/layouts/CustomerLayout'));
const Home = lazy(() => import('./customer/pages/Home'));
const Products = lazy(() => import('./customer/pages/Products'));
const ProductDetail = lazy(() => import('./customer/pages/ProductDetail'));
const About = lazy(() => import('./customer/pages/About'));
const Contact = lazy(() => import('./customer/pages/Contact'));
const Policies = lazy(() => import('./customer/pages/Policies'));
const Cart = lazy(() => import('./customer/pages/Cart'));

// Simple loading indicator for lazy chunks loading
const ChunkLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B6B4A]"></div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LoadingProvider>
          <CartProvider>
            <Router>
              <Suspense fallback={<ChunkLoader />}>
                <Routes>
                  {/* Public Admin Route */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Admin Console Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="products" element={<AdminProducts />} />
                  </Route>

                  {/* Public Storefront Layout Routes */}
                  <Route path="/" element={<CustomerLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:id" element={<ProductDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="policies" element={<Policies />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </CartProvider>
        </LoadingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
