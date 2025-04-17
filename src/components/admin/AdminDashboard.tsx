
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchOrders, fetchProducts, Product, Order } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { 
  UsersIcon, ShoppingBagIcon, TrendingUpIcon, CheckCircleIcon 
} from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          fetchOrders(),
          fetchProducts()
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getCustomerCount = () => {
    const uniqueCustomers = new Set(orders.map(order => order.contact));
    return uniqueCustomers.size;
  };
  
  const getTotalRevenue = () => {
    return orders.reduce((total, order) => {
      const orderTotal = order.products.reduce(
        (sum, product) => sum + (product.price * product.quantity), 
        0
      );
      return total + orderTotal;
    }, 0);
  };
  
  const getCompletedOrdersCount = () => {
    return orders.filter(order => order.status === 'completed').length;
  };
  
  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      processing: 0,
      completed: 0
    };
    
    orders.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="flex items-center">
                <ShoppingBagIcon className="h-8 w-8 text-primary-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-xs text-gray-500">Semua waktu</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pelanggan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-secondary-300 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{getCustomerCount()}</p>
                  <p className="text-xs text-gray-500">Unik</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="flex items-center">
                <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalRevenue())}</p>
                  <p className="text-xs text-gray-500">Semua pesanan</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pesanan Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{getCompletedOrdersCount()}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round((getCompletedOrdersCount() / Math.max(orders.length, 1)) * 100)}% dari total
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span>Menunggu</span>
                    <span className="font-medium">{statusCounts.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${(statusCounts.pending / Math.max(orders.length, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span>Diproses</span>
                    <span className="font-medium">{statusCounts.processing}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(statusCounts.processing / Math.max(orders.length, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span>Selesai</span>
                    <span className="font-medium">{statusCounts.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(statusCounts.completed / Math.max(orders.length, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Produk ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden mr-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span className="text-primary-600 font-medium">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
