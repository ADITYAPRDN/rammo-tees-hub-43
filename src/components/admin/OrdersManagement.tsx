
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Eye, Edit, Trash2, Filter, ArrowUpDown } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose 
} from '@/components/ui/dialog';
import { fetchOrders, updateOrderStatus, deleteOrder, Order } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, sortOrder]);
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data pesanan",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterOrders = () => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(search) || 
        order.customerName.toLowerCase().includes(search) ||
        order.contact.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredOrders(result);
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'processing' | 'completed') => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Status Diperbarui",
        description: `Status pesanan berhasil diubah menjadi ${newStatus}`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui status pesanan",
      });
    }
  };
  
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      
      toast({
        title: "Pesanan Dihapus",
        description: "Pesanan berhasil dihapus dari sistem",
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus pesanan",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Menunggu</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Diproses</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const calculateOrderTotal = (order: Order) => {
    return order.products.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Cari pesanan..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="processing">Diproses</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="h-12">
                        <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada data pesanan ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(0, 6)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.contact}</TableCell>
                      <TableCell>
                        {order.products.length > 1 
                          ? `${order.products[0].productName} +${order.products.length - 1}`
                          : order.products[0].productName}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(calculateOrderTotal(order))}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
      
      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detail Pesanan #{selectedOrder?.id.substring(0, 6)}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pelanggan</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Kontak</p>
                  <p>{selectedOrder.contact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{getStatusBadge(selectedOrder.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tanggal</p>
                  <p>{new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Produk</p>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead className="text-center">Jumlah</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.products.map((product, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>{product.size}</TableCell>
                          <TableCell className="text-center">{product.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product.price * product.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Catatan</p>
                  <p className="border rounded-md p-2 bg-gray-50">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-xl font-bold">{formatCurrency(calculateOrderTotal(selectedOrder))}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              setIsEditDialogOpen(true);
            }}>
              Edit Pesanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Status Pesanan</DialogTitle>
            <DialogDescription>
              Ubah status pesanan dari {selectedOrder?.customerName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Status Saat Ini: {getStatusBadge(selectedOrder.status)}</p>
                <p className="text-sm">Pilih status baru:</p>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant={selectedOrder.status === 'pending' ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                    className="justify-start"
                  >
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 mr-2">
                      Menunggu
                    </Badge>
                    Belum diproses
                  </Button>
                  
                  <Button 
                    variant={selectedOrder.status === 'processing' ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                    className="justify-start"
                  >
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mr-2">
                      Diproses
                    </Badge>
                    Sedang diproses
                  </Button>
                  
                  <Button 
                    variant={selectedOrder.status === 'completed' ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    className="justify-start"
                  >
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mr-2">
                      Selesai
                    </Badge>
                    Pesanan selesai
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Order Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pesanan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="border rounded-md p-4 bg-red-50 border-red-100 text-red-800">
              <p><strong>ID:</strong> #{selectedOrder.id.substring(0, 6)}</p>
              <p><strong>Pelanggan:</strong> {selectedOrder.customerName}</p>
              <p><strong>Produk:</strong> {selectedOrder.products.map(p => p.productName).join(', ')}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedOrder && handleDeleteOrder(selectedOrder.id)}
            >
              Hapus Pesanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
