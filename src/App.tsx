
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Layout from "@/components/layout/Layout";

// Customer Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderPage from "./pages/OrderPage";
import ContactPage from "./pages/ContactPage";
import CustomerPage from "./pages/CustomerPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// 404 Page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Customer Frontend Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
              <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
              <Route path="/order" element={<Layout><OrderPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/customer" element={<Layout><CustomerPage /></Layout>} />
              
              {/* Admin Backend Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={
                <PrivateRoute requireAdmin>
                  <AdminDashboardPage />
                </PrivateRoute>
              } />
              <Route path="/admin/orders" element={
                <PrivateRoute requireAdmin>
                  <AdminOrdersPage />
                </PrivateRoute>
              } />
              <Route path="/admin/products" element={
                <PrivateRoute requireAdmin>
                  <AdminProductsPage />
                </PrivateRoute>
              } />
              <Route path="/admin/customers" element={
                <PrivateRoute requireAdmin>
                  <AdminCustomersPage />
                </PrivateRoute>
              } />
              <Route path="/admin/analytics" element={
                <PrivateRoute requireAdmin>
                  <AdminAnalyticsPage />
                </PrivateRoute>
              } />
              <Route path="/admin/settings" element={
                <PrivateRoute requireSuperAdmin>
                  <AdminSettingsPage />
                </PrivateRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
