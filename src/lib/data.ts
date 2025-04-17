
// Export tipe data
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  stock?: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  contact: string;
  products: OrderItem[];
  notes: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  orders: string[];
}

// Export semua fungsi dari layanan
export { 
  fetchProducts, fetchProductById, createProduct, updateProduct, deleteProduct 
} from '../services/productService';

export { 
  fetchOrders, fetchOrderById, fetchCustomerOrders, createOrder, updateOrderStatus, deleteOrder 
} from '../services/orderService';

export { 
  fetchCustomers, fetchCustomerById, createCustomer, updateCustomer 
} from '../services/customerService';

export {
  getSiteSettings, updateSiteSettings
} from '../services/settingsService';

// Admin Auth
// Menyimpan data admin dalam memori untuk simulasi database
export const adminUsers = [
  {
    id: '1',
    email: 'admin@rammo.com',
    password: 'admin123' // Di aplikasi nyata, ini akan dienkripsi
  }
];

// Auth Admin
export const authenticateAdmin = (email: string, password: string): Promise<{ success: boolean; token?: string }> => {
  return new Promise((resolve) => {
    const admin = adminUsers.find(user => user.email === email && user.password === password);
    
    if (admin) {
      resolve({ 
        success: true, 
        token: `mock-token-${admin.id}-${Date.now()}`
      });
    } else {
      resolve({ success: false });
    }
  });
};
