
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { fetchOrders, fetchProducts, Order, Product } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

const AnalyticsDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  
  // Derived data
  const [revenueByDate, setRevenueByDate] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [revenueStats, setRevenueStats] = useState({
    total: 0,
    average: 0,
    growth: 0
  });
  
  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, productsData] = await Promise.all([
          fetchOrders(),
          fetchProducts()
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    if (orders.length > 0) {
      processData();
    }
  }, [orders, products, timeRange]);
  
  const processData = () => {
    // Filter orders by time range
    const filteredOrders = filterOrdersByTime(orders);
    
    // Calculate revenue by date
    calculateRevenueByDate(filteredOrders);
    
    // Calculate top products
    calculateTopProducts(filteredOrders);
    
    // Calculate status distribution
    calculateStatusDistribution(filteredOrders);
    
    // Calculate revenue statistics
    calculateRevenueStats(filteredOrders);
  };
  
  const filterOrdersByTime = (allOrders: Order[]): Order[] => {
    if (timeRange === 'all') return allOrders;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return allOrders;
    }
    
    return allOrders.filter(order => {
      const orderDate = new Date(order.createdAt || Date.now());
      return orderDate >= cutoffDate;
    });
  };
  
  const calculateRevenueByDate = (filteredOrders: Order[]) => {
    const revenueMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt || Date.now());
      const dateKey = getDateKey(orderDate);
      
      const orderTotal = order.products.reduce(
        (sum, product) => sum + (product.price * product.quantity), 0
      );
      
      revenueMap.set(
        dateKey,
        (revenueMap.get(dateKey) || 0) + orderTotal
      );
    });
    
    // Convert to array and sort by date
    const revenueData = Array.from(revenueMap.entries()).map(([date, amount]) => ({
      date,
      amount
    }));
    
    // Sort by date
    revenueData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    setRevenueByDate(revenueData);
  };
  
  const calculateTopProducts = (filteredOrders: Order[]) => {
    // Count product popularity
    const productMap = new Map<string, {count: number, revenue: number}>();
    
    filteredOrders.forEach(order => {
      order.products.forEach(product => {
        const { productId, productName, price, quantity } = product;
        
        if (productMap.has(productId)) {
          const existing = productMap.get(productId)!;
          productMap.set(productId, {
            count: existing.count + quantity,
            revenue: existing.revenue + (price * quantity)
          });
        } else {
          productMap.set(productId, {
            count: quantity,
            revenue: price * quantity
          });
        }
      });
    });
    
    // Convert to array and add product names
    const topProductsData = Array.from(productMap.entries()).map(([id, data]) => {
      // Find full product info
      const productInfo = products.find(p => p.id === id) || {
        id,
        name: 'Unknown Product',
        image: '/placeholder.svg'
      };
      
      return {
        id,
        name: productInfo.name,
        image: productInfo.image,
        count: data.count,
        revenue: data.revenue
      };
    });
    
    // Sort by count
    topProductsData.sort((a, b) => b.revenue - a.revenue);
    
    setTopProducts(topProductsData.slice(0, 5));
  };
  
  const calculateStatusDistribution = (filteredOrders: Order[]) => {
    const statusMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      statusMap.set(
        order.status,
        (statusMap.get(order.status) || 0) + 1
      );
    });
    
    const statusData = Array.from(statusMap.entries()).map(([status, count]) => {
      let name;
      switch (status) {
        case 'pending': name = 'Menunggu'; break;
        case 'processing': name = 'Diproses'; break;
        case 'completed': name = 'Selesai'; break;
        default: name = status;
      }
      
      return { name, value: count };
    });
    
    setStatusDistribution(statusData);
  };
  
  const calculateRevenueStats = (filteredOrders: Order[]) => {
    // Total revenue
    const total = filteredOrders.reduce((sum, order) => {
      const orderTotal = order.products.reduce(
        (s, product) => s + (product.price * product.quantity), 0
      );
      return sum + orderTotal;
    }, 0);
    
    // Average order value
    const average = filteredOrders.length > 0 
      ? total / filteredOrders.length 
      : 0;
    
    // Calculate growth (simplified)
    let growth = 0;
    if (filteredOrders.length > 0) {
      // Sort orders by date
      const sortedOrders = [...filteredOrders].sort((a, b) => {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      });
      
      // Split into two halves
      const midpoint = Math.floor(sortedOrders.length / 2);
      const firstHalf = sortedOrders.slice(0, midpoint);
      const secondHalf = sortedOrders.slice(midpoint);
      
      // Calculate revenue for each half
      const firstHalfRevenue = firstHalf.reduce((sum, order) => {
        return sum + order.products.reduce((s, p) => s + (p.price * p.quantity), 0);
      }, 0);
      
      const secondHalfRevenue = secondHalf.reduce((sum, order) => {
        return sum + order.products.reduce((s, p) => s + (p.price * p.quantity), 0);
      }, 0);
      
      // Calculate growth percentage
      if (firstHalfRevenue > 0) {
        growth = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
      }
    }
    
    setRevenueStats({
      total,
      average,
      growth
    });
  };
  
  const getDateKey = (date: Date): string => {
    // Format depends on the selected time range
    switch (timeRange) {
      case 'week':
      case 'month':
        // Daily format: "23 Apr"
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
      case 'quarter':
        // Weekly format: "Week 23"
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((date.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
        return `Minggu ${weekNumber}`;
      case 'year':
        // Monthly format: "Apr"
        return date.toLocaleString('default', { month: 'short' });
      default:
        // Monthly format for 'all'
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    }
  };
  
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analitik Bisnis</h2>
        
        <div className="w-48">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Rentang Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 Hari Terakhir</SelectItem>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
              <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
              <SelectItem value="year">1 Tahun Terakhir</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div>
                <p className="text-2xl font-bold">{formatCurrency(revenueStats.total)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {timeRange === 'all' ? 'Semua waktu' : `${timeRange === 'week' ? '7 hari' : timeRange === 'month' ? '30 hari' : timeRange === 'quarter' ? '3 bulan' : '1 tahun'} terakhir`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Rata-rata Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div>
                <p className="text-2xl font-bold">{formatCurrency(revenueStats.average)}</p>
                <p className="text-xs text-gray-500 mt-1">Per pesanan</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pertumbuhan Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="flex items-center">
                <p className={`text-2xl font-bold ${
                  revenueStats.growth > 0 
                    ? 'text-green-600' 
                    : revenueStats.growth < 0 
                      ? 'text-red-600' 
                      : ''
                }`}>
                  {revenueStats.growth > 0 ? '+' : ''}{revenueStats.growth.toFixed(1)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pendapatan Seiring Waktu</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <div className="h-full bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDate} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={formatTooltipValue} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Top Products and Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="h-full bg-gray-200 rounded animate-pulse"></div>
            ) : topProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Tidak ada data produk tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value as number) : value, 
                      name === 'revenue' ? 'Pendapatan' : 'Jumlah Terjual'
                    ]}
                  />
                  <Bar dataKey="count" fill="#8884d8" name="Jumlah Terjual" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Pendapatan" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="h-full bg-gray-200 rounded animate-pulse"></div>
            ) : statusDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Tidak ada data status pesanan tersedia
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pesanan`, 'Jumlah']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
