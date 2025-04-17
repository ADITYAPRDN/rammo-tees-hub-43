
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminSettingsPage = () => {
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAdmin = async () => {
    try {
      setLoading(true);
      
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newAdmin.email,
        password: newAdmin.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // If user was created successfully, add them to admin_profiles table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .insert({
            id: authData.user.id,
            email: newAdmin.email,
            is_super_admin: false
          });
          
        if (profileError) throw profileError;
      }
      
      toast({
        title: 'Sukses',
        description: 'Admin baru berhasil ditambahkan',
      });
      setIsAddAdminOpen(false);
      setNewAdmin({ email: '', password: '', name: '' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal menambahkan admin baru',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Pengaturan">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Manajemen Admin</CardTitle>
                <CardDescription>Kelola akun admin sistem</CardDescription>
              </div>
              <Button onClick={() => setIsAddAdminOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Admin
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* TODO: Add admin list table here */}
            <p className="text-sm text-gray-500">Daftar admin akan ditampilkan di sini</p>
          </CardContent>
        </Card>

        {/* Add Admin Dialog */}
        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Admin Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi untuk membuat akun admin baru
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Masukkan nama admin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Masukkan password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAdminOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button onClick={handleAddAdmin} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
