
import AdminLayout from '@/components/admin/AdminLayout';
import SiteSettings from '@/components/admin/SiteSettings';

const AdminSettingsPage = () => {
  return (
    <AdminLayout title="Pengaturan Situs">
      <SiteSettings />
    </AdminLayout>
  );
};

export default AdminSettingsPage;
