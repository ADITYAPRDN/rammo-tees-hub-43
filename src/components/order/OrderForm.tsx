
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProducts, createOrder, Product } from '@/lib/data';
import { isValidContact } from '@/lib/utils';

const OrderForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [productId, setProductId] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Selected product info
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    // Update selected product when productId changes
    if (productId) {
      const product = products.find(p => p.id === productId) || null;
      setSelectedProduct(product);
      
      // Reset size when product changes
      setSize('');
    } else {
      setSelectedProduct(null);
    }
  }, [productId, products]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast({
        title: "Nama Diperlukan",
        description: "Silakan masukkan nama Anda",
        variant: "destructive"
      });
      return false;
    }

    if (!contact.trim() || !isValidContact(contact)) {
      toast({
        title: "Kontak Tidak Valid",
        description: "Silakan masukkan email atau nomor WhatsApp yang valid",
        variant: "destructive"
      });
      return false;
    }

    if (!productId) {
      toast({
        title: "Produk Diperlukan",
        description: "Silakan pilih produk yang ingin dipesan",
        variant: "destructive"
      });
      return false;
    }

    if (!size) {
      toast({
        title: "Ukuran Diperlukan",
        description: "Silakan pilih ukuran yang diinginkan",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (!selectedProduct) {
        throw new Error("Product not found");
      }
      
      const order = {
        customerId: "new", // This would be replaced with actual customer ID in a real app
        customerName: name,
        contact,
        products: [
          {
            productId,
            productName: selectedProduct.name,
            size,
            quantity,
            price: selectedProduct.price
          }
        ],
        notes,
        status: 'pending' as const
      };

      await createOrder(order);
      
      toast({
        title: "Pesanan Berhasil Dibuat",
        description: "Tim kami akan segera menghubungi Anda",
      });

      // Reset form
      setName('');
      setContact('');
      setProductId('');
      setSize('');
      setQuantity(1);
      setNotes('');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi nanti.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Form Pemesanan</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Pribadi</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Email / Nomor WhatsApp</Label>
                <Input 
                  id="contact" 
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="contoh@email.com atau 0812xxxxxxxx"
                  required
                />
                <p className="text-xs text-gray-500">
                  Kami akan menggunakan ini untuk menghubungi Anda terkait pesanan
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Detail Pesanan</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Pilih Produk</Label>
                <Select 
                  value={productId} 
                  onValueChange={setProductId}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProduct && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="size">Ukuran</Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Jumlah</Label>
                    <Input 
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Khusus</Label>
                <Textarea 
                  id="notes" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Deskripsi desain, warna, atau informasi tambahan lainnya"
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          {/* Submission */}
          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full bg-primary-500 hover:bg-primary-600"
              disabled={submitting}
            >
              {submitting ? 'Memproses...' : 'Kirim Pesanan'}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Dengan mengirim, Anda setuju untuk dihubungi oleh tim kami terkait pesanan ini
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
