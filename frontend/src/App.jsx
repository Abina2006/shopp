import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Lazy-loaded pages — each page loads only when the user navigates to it
// This splits the bundle and dramatically improves initial load time
const HomePage          = lazy(() => import('./pages/HomePage'));
const SearchPage        = lazy(() => import('./pages/SearchPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CategoriesPage    = lazy(() => import('./pages/CategoriesPage'));
const ComparePage       = lazy(() => import('./pages/ComparePage'));
const CartPage          = lazy(() => import('./pages/CartPage'));
const BudgetPage        = lazy(() => import('./pages/BudgetPage'));
const WishlistPage      = lazy(() => import('./pages/WishlistPage'));
const AiAssistantPage   = lazy(() => import('./pages/AiAssistantPage'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/RegisterPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const ScraperPage       = lazy(() => import('./pages/ScraperPage'));
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'));

// Minimal loading fallback shown while a page chunk is downloading
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#3FA66B] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#6B7280] font-medium">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="catalog" element={<SearchPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="compare/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="ai-assistant" element={<AiAssistantPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route path="wishlist" element={
                <ProtectedRoute><WishlistPage /></ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index element={<AdminDashboardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
