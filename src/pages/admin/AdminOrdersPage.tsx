
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import OrdersManagement from '@/components/admin/OrdersManagement';

// Create a client
const queryClient = new QueryClient();

const AdminOrdersPage = () => {
  return (
    <AdminLayout title="Manajemen Pesanan">
      <OrdersManagement />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
