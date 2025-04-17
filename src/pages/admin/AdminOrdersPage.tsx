
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OrdersManagement from '@/components/admin/OrdersManagement';

const AdminOrdersPage = () => {
  return (
    <AdminLayout title="Manajemen Pesanan">
      <OrdersManagement />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
