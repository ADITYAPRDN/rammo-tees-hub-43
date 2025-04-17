
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { authenticateAdmin } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Email dan password diperlukan",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await authenticateAdmin(email, password);
      
      if (result.success && result.token) {
        // Store token in localStorage
        localStorage.setItem('adminToken', result.token);
        
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di dashboard admin"
        });
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login Gagal",
          description: "Email atau password salah",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi nanti.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-2 border-primary-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Masuk ke dashboard admin RAMMO T-Shirts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rammo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Demo Credentials: admin@rammo.com / admin123</p>
      </div>
    </div>
  );
};

export default AdminLogin;
