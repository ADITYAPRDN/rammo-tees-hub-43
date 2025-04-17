import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Selamat Datang di RAMMO T-Shirts
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Buat kaos custom impianmu dengan mudah dan cepat!
        </p>
        <div className="space-x-4">
          <Link to="/products">
            <Button variant="primary">Lihat Produk</Button>
          </Link>
          <Link to="/order">
            <Button variant="secondary">Pesan Sekarang</Button>
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link to="/admin/login">
          <Button variant="outline">
            Admin Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
