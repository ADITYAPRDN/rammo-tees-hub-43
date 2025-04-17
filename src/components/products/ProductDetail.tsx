
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { fetchProductById, Product } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getProduct = async () => {
      if (!id) return;
      
      try {
        const fetchedProduct = await fetchProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Produk tidak ditemukan');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Terjadi kesalahan saat memuat produk');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
              <div className="h-10 bg-gray-200 rounded mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Kembali ke Produk
        </Link>
        <Card className="p-12 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Produk tidak ditemukan'}
            </h2>
            <p className="text-gray-600 mb-6">
              Mohon maaf, produk yang Anda cari tidak tersedia atau telah dihapus
            </p>
            <Link to="/products">
              <Button>Lihat Produk Lainnya</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Kembali ke Produk
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product?.name}</h1>
          <p className="text-xl font-semibold text-primary-600 mt-2">
            {product?.price ? formatCurrency(product.price) : ''}
          </p>
          
          <div className="mt-4">
            <h3 className="font-medium text-gray-900">Deskripsi</h3>
            <p className="mt-2 text-gray-600">{product?.description}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-900">Ukuran yang Tersedia</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {product?.sizes.map((size) => (
                <Badge key={size} variant="outline" className="text-sm">
                  {size}
                </Badge>
              ))}
            </div>
          </div>
          
          <Link to={`/order?productId=${product?.id}`} className="block mt-8">
            <Button className="w-full">
              Pesan Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
