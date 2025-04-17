
import AdminLayout from '@/components/admin/AdminLayout';
import ProductsManagement from '@/components/admin/ProductsManagement';

const AdminProductsPage = () => {
  return (
    <AdminLayout title="Manajemen Produk">
      <ProductsManagement />
    </AdminLayout>
  );
};

export default AdminProductsPage;
