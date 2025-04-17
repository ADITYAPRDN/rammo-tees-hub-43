
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CustomerLogin from '@/components/customer/CustomerLogin';
import OrderHistory from '@/components/customer/OrderHistory';

const CustomerPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contactInfo, setContactInfo] = useState<string>('');
  
  useEffect(() => {
    // Check if user is already logged in
    const storedContact = localStorage.getItem('customerContact');
    if (storedContact) {
      setContactInfo(storedContact);
      setIsLoggedIn(true);
    }
  }, []);
  
  const handleLogin = (contact: string) => {
    setContactInfo(contact);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('customerContact');
    setContactInfo('');
    setIsLoggedIn(false);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portal Pelanggan</h1>
          <p className="mt-2 text-gray-600">
            {isLoggedIn 
              ? 'Lihat dan pantau status pesanan Anda'
              : 'Masuk untuk melihat riwayat dan status pesanan Anda'}
          </p>
        </div>
        
        {isLoggedIn ? (
          <OrderHistory contactInfo={contactInfo} onLogout={handleLogout} />
        ) : (
          <CustomerLogin onLogin={handleLogin} />
        )}
      </div>
    </Layout>
  );
};

export default CustomerPage;
