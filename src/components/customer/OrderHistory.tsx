
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchCustomerOrders, Order } from '@/lib/data';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

interface OrderHistoryProps {
  contactInfo: string;
  onLogout: () => void;
}

const OrderHistory = ({ contactInfo, onLogout }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedOrders = await fetchCustomerOrders(contactInfo);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [contactInfo]);

  const calculateTotal = (order: Order): number => {
    return order.products.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Riwayat Pesanan</CardTitle>
        <Button variant="outline" onClick={onLogout}>
          Keluar
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <Table>
            <TableCaption>Daftar pesanan Anda</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.products.map((product, index) => (
                        <li key={index} className="text-sm">
                          {product.productName} ({product.size}) x {product.quantity}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(calculateTotal(order))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(order.status)} border-none`}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada riwayat pesanan ditemukan</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
