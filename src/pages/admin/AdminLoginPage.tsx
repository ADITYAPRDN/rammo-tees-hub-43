
import AdminLogin from '@/components/admin/AdminLogin';

const AdminLoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-primary-600">RAMMO Admin</h1>
        <p className="text-gray-600 text-center">Panel Administrator</p>
      </div>
      <AdminLogin />
    </div>
  );
};

export default AdminLoginPage;
