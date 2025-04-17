import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { createOrder } from "@/services/orderService";
import { type Product, fetchProductById } from "@/services/productService";
import { formatCurrency } from "@/lib/utils";

const OrderForm = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    size: '',
    quantity: 1,
    notes: '',
  });
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        setLoading(true);
        try {
          const productData = await fetchProductById(productId);
          if (productData) {
            setProduct(productData);
            setFormData(prev => ({
              ...prev,
              size: productData.sizes[0] || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Gagal memuat data produk",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [productId, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 1;
    setFormData(prev => ({ ...prev, quantity: value }));
  };
  
  const calculateTotal = () => {
    if (!product) return 0;
    return product.price * formData.quantity;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tidak ada produk yang dipilih",
      });
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.size || formData.quantity < 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const order = await createOrder({
        customerId: 'guest',
        customerName: formData.name,
        contact: formData.email || formData.phone,
        products: [
          {
            productId: product.id,
            productName: product.name,
            size: formData.size,
            quantity: formData.quantity,
            price: product.price
          }
        ],
        notes: formData.notes,
        status: 'pending'
      });
      
      toast({
        title: "Pesanan Berhasil",
        description: "Pesanan Anda telah diterima dan sedang diproses",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        size: '',
        quantity: 1,
        notes: '',
      });
      
      navigate(`/customer?contact=${encodeURIComponent(formData.email || formData.phone)}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengirim pesanan. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>
                  Masukkan informasi kontak Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda" 
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Masukkan nomor telepon Anda" 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat (Opsional)</Label>
                  <Textarea 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap Anda" 
                    rows={3} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
                <CardDescription>
                  Masukkan spesifikasi pesanan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ) : product ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size">Ukuran</Label>
                        <Select 
                          value={formData.size} 
                          onValueChange={(value) => handleSelectChange('size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih ukuran" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.sizes.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Jumlah</Label>
                        <Input 
                          id="quantity" 
                          name="quantity"
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={handleQuantityChange}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Tidak ada produk yang dipilih.</p>
                    <Button 
                      variant="secondary"
                      className="mt-2"
                      onClick={() => navigate('/products')}
                    >
                      Pilih Produk
                    </Button>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                  <Textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Masukkan catatan atau permintaan khusus" 
                    rows={3} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                {product ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Produk</span>
                      <span>{product.name}</span>
                    </div>
                    
                    {formData.size && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Ukuran</span>
                        <Badge variant="outline">{formData.size}</Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Jumlah</span>
                      <span>{formData.quantity} pcs</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Harga Satuan</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Pilih produk terlebih dahulu</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={!product || submitting}
                  type="submit"
                >
                  {submitting ? 'Memproses...' : 'Kirim Pesanan'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
