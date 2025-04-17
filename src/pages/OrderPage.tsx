
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import OrderForm from '@/components/order/OrderForm';

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Pemesanan</h1>
          <p className="mt-2 text-lg text-gray-600">
            Isi form berikut untuk memesan produk sablon kami
          </p>
        </div>
        <OrderForm />
      </div>
    </Layout>
  );
};

export default OrderPage;
