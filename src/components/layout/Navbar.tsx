
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingBag, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-primary-600 text-2xl font-bold">RAMMO</h1>
              <span className="ml-2 text-primary-500 hidden sm:block font-medium">Custom T-Shirts</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Products
              </Link>
              <Link to="/order" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Order
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Contact
              </Link>
              <Link to="/customer">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" className="ml-2" size="sm">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-3 px-2 pt-2 shadow-lg animate-fade-in">
          <div className="space-y-1 px-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/order"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Order
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/customer"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Customer Portal
            </Link>
            <Link
              to="/admin/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
