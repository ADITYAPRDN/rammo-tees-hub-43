
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Users, BarChart2, Settings, Home, LogOut, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: <Home className="h-5 w-5" />
    },
    {
      name: 'Pesanan',
      href: '/admin/orders',
      icon: <ShoppingBag className="h-5 w-5" />
    },
    {
      name: 'Produk',
      href: '/admin/products',
      icon: <Package className="h-5 w-5" />
    },
    {
      name: 'Pelanggan',
      href: '/admin/customers',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Analitik',
      href: '/admin/analytics',
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      name: 'Pengaturan',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-xl font-bold text-primary-600">RAMMO Admin</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar for mobile (overlay) */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
          <div className="h-full w-64 bg-white shadow-lg p-5 animate-slide-right">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-primary-600">RAMMO Admin</h2>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-md ${
                    location.pathname === item.href ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-5 left-5">
              <Button variant="ghost" className="text-gray-700" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-md">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-primary-600">RAMMO Admin</h2>
          </div>
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <nav className="mt-5 flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-md ${
                    location.pathname === item.href ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="mt-4 lg:mt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
