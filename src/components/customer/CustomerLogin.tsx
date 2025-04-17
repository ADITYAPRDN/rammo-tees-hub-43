
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fetchCustomerOrders } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';
import { isValidContact } from '@/lib/utils';

interface CustomerLoginProps {
  onLogin: (contact: string) => void;
}

const CustomerLogin = ({ onLogin }: CustomerLoginProps) => {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact.trim() || !isValidContact(contact)) {
      toast({
        title: "Input Tidak Valid",
        description: "Silakan masukkan email atau nomor WhatsApp yang valid",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const orders = await fetchCustomerOrders(contact);
      
      if (orders.length === 0) {
        toast({
          title: "Tidak Ditemukan",
          description: "Tidak ada pesanan yang terkait dengan kontak ini",
          variant: "destructive"
        });
        return;
      }

      // Store contact in localStorage for "session"
      localStorage.setItem('customerContact', contact);
      
      // Notify parent component that login is successful
      onLogin(contact);
      
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!"
      });
    } catch (error) {
      console.error('Error during login:', error);
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customer Portal</CardTitle>
          <CardDescription>
            Masuk untuk melihat riwayat pesanan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Email atau WhatsApp</Label>
              <Input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="contoh@email.com atau 08123456789"
                required
              />
              <p className="text-xs text-gray-500">
                Masukkan kontak yang Anda gunakan saat melakukan pemesanan
              </p>
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
    </div>
  );
};

export default CustomerLogin;
