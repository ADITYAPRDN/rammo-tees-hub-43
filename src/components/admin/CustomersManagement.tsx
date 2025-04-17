
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Search, Eye, ArrowUpDown, Phone } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { fetchOrders, Order } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

type Customer = {
  id: string;
  name: string;
  contact: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  orders: Order[];
};

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'totalOrders' | 'totalSpent'>('totalOrders');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    loadCustomers();
  }, []);
  
  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchTerm, sortKey, sortOrder]);
  
  const loadCustomers = async () => {
    setLoading(true);
    try {
      // Fetch all orders to extract customer data
      const orders = await fetchOrders();
      
      // Group orders by customer
      const customerMap = new Map<string, Customer>();
      
      orders.forEach(order => {
        const customerId = order.customerId || order.contact;
        const customerName = order.customerName;
        const customerContact = order.contact;
        const orderTotal = order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const orderDate = new Date(order.createdAt || Date.now());
        
        if (customerMap.has(customerId)) {
          const customer = customerMap.get(customerId)!;
          customer.totalOrders += 1;
          customer.totalSpent += orderTotal;
          customer.orders.push(order);
          
          // Update last order date if this order is more recent
          if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
            customer.lastOrderDate = orderDate;
          }
        } else {
          customerMap.set(customerId, {
            id: customerId,
            name: customerName,
            contact: customerContact,
            totalOrders: 1,
            totalSpent: orderTotal,
            lastOrderDate: orderDate,
            orders: [order]
          });
        }
      });
      
      const customerList = Array.from(customerMap.values());
      setCustomers(customerList);
      setFilteredCustomers(customerList);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data pelanggan",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterAndSortCustomers = () => {
    let result = [...customers];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(search) ||
        customer.contact.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortKey) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          return sortOrder === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
          
        case 'totalOrders':
          return sortOrder === 'asc' 
            ? a.totalOrders - b.totalOrders
            : b.totalOrders - a.totalOrders;
          
        case 'totalSpent':
          return sortOrder === 'asc' 
            ? a.totalSpent - b.totalSpent
            : b.totalSpent - a.totalSpent;
            
        default:
          return 0;
      }
    });
    
    setFilteredCustomers(result);
  };
  
  const handleSort = (key: 'name' | 'totalOrders' | 'totalSpent') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };
  
  const getSortIcon = (key: 'name' | 'totalOrders' | 'totalSpent') => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortOrder === 'asc' 
      ? <ArrowUpDown className="h-4 w-4 ml-1 text-primary-500" />
      : <ArrowUpDown className="h-4 w-4 ml-1 text-primary-500 rotate-180" />;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari pelanggan..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="p-0 font-medium"
                      onClick={() => handleSort('name')}
                    >
                      Nama Pelanggan
                      {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="p-0 font-medium"
                      onClick={() => handleSort('totalOrders')}
                    >
                      Jumlah Pesanan
                      {getSortIcon('totalOrders')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      className="p-0 font-medium"
                      onClick={() => handleSort('totalSpent')}
                    >
                      Total Pembelian
                      {getSortIcon('totalSpent')}
                    </Button>
                  </TableHead>
                  <TableHead>Terakhir Order</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Tidak ada data pelanggan ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.contact}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => window.open(`https://wa.me/${customer.contact.replace(/\D/g, '')}`, '_blank')}
                          >
                            <Phone className="h-4 w-4 text-green-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Pelanggan</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama Pelanggan</p>
                  <p className="text-lg font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Kontak</p>
                  <p className="text-lg font-medium">{selectedCustomer.contact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Pesanan</p>
                  <p className="text-lg font-medium">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Pembelian</p>
                  <p className="text-lg font-medium">{formatCurrency(selectedCustomer.totalSpent)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Riwayat Pesanan</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
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
                      {selectedCustomer.orders.map((order) => {
                        const orderTotal = order.products.reduce(
                          (sum, product) => sum + (product.price * product.quantity), 0
                        );
                        
                        return (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id.substring(0, 6)}</TableCell>
                            <TableCell>{new Date(order.createdAt || 0).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              {order.products.length > 1 
                                ? `${order.products[0].productName} +${order.products.length - 1}` 
                                : order.products[0].productName}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(orderTotal)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status === 'completed' ? 'Selesai' :
                                 order.status === 'processing' ? 'Diproses' : 'Menunggu'}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
            {selectedCustomer && (
              <Button
                onClick={() => window.open(`https://wa.me/${selectedCustomer.contact.replace(/\D/g, '')}`, '_blank')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Hubungi
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersManagement;
