
import AdminLayout from '@/components/admin/AdminLayout';
import CustomersManagement from '@/components/admin/CustomersManagement';

const AdminCustomersPage = () => {
  return (
    <AdminLayout title="Manajemen Pelanggan">
      <CustomersManagement />
    </AdminLayout>
  );
};

export default AdminCustomersPage;
