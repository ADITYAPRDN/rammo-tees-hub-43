
import { Link } from 'react-router-dom';
import { Instagram, Share2, MessageCircle, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-primary-600 text-2xl font-bold">RAMMO</h2>
            <p className="mt-2 text-sm text-gray-600">
              Providing high quality custom t-shirt printing services since 2015
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="text-base font-medium text-gray-900">Products</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-primary-500">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-primary-500">
                  Polo Shirts
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-primary-500">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-sm text-gray-600 hover:text-primary-500">
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-base font-medium text-gray-900">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-primary-500">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary-500">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/customer" className="text-sm text-gray-600 hover:text-primary-500">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-base font-medium text-gray-900">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <MessageCircle className="h-5 w-5 text-primary-500 mr-2" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary-500"
                >
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Instagram className="h-5 w-5 text-primary-500 mr-2" />
                <a
                  href="https://instagram.com/rammo_tshirts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary-500"
                >
                  @rammo_tshirts
                </a>
              </li>
              <li className="flex items-center">
                <Share2 className="h-5 w-5 text-primary-500 mr-2" />
                <a
                  href="https://tiktok.com/@rammo_tshirts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary-500"
                >
                  @rammo_tshirts
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">
                  Jl. Sablon Kreatif No. 123, Jakarta Selatan, 12345
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} RAMMO T-Shirts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
