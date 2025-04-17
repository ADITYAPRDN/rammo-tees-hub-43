
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchProducts, Product } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-9 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <p className="mt-2 font-semibold text-primary-600">{formatCurrency(product.price)}</p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                Tersedia ukuran: {product.sizes.join(', ')}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Link to={`/products/${product.id}`}>
              <Button variant="outline" size="sm">
                Detail
              </Button>
            </Link>
            <Link to={`/order?productId=${product.id}`}>
              <Button size="sm">
                Pesan
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
