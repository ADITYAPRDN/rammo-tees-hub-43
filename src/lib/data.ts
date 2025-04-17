
// Mock data for development
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
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

// Mock products
export const products: Product[] = [
  {
    id: '1',
    name: 'Basic Cotton T-Shirt',
    description: 'High quality 100% cotton t-shirt ideal for custom printing',
    price: 99000,
    image: '/t-shirt-1.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'Premium Polo Shirt',
    description: 'Premium quality polo shirt with soft feel and great printability',
    price: 150000,
    image: '/t-shirt-2.png',
    sizes: ['M', 'L', 'XL']
  },
  {
    id: '3',
    name: 'Long Sleeve T-Shirt',
    description: 'Comfortable long sleeve t-shirt perfect for cooler weather',
    price: 130000,
    image: '/t-shirt-3.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Custom Hoodie',
    description: 'Cozy hoodie with high quality fabric for detailed printing',
    price: 250000,
    image: '/hoodie-1.png',
    sizes: ['M', 'L', 'XL', 'XXL']
  }
];

// Mock orders
export const orders: Order[] = [
  {
    id: '1',
    customerId: '101',
    customerName: 'Budi Santoso',
    contact: 'budi@example.com',
    products: [
      {
        productId: '1',
        productName: 'Basic Cotton T-Shirt',
        size: 'L',
        quantity: 5,
        price: 99000
      }
    ],
    notes: 'Design dengan logo perusahaan di bagian depan',
    status: 'completed',
    createdAt: '2024-03-15T09:00:00Z'
  },
  {
    id: '2',
    customerId: '102',
    customerName: 'Siti Nurhayati',
    contact: '+6281234567890',
    products: [
      {
        productId: '2',
        productName: 'Premium Polo Shirt',
        size: 'M',
        quantity: 10,
        price: 150000
      }
    ],
    notes: 'Untuk seragam acara kantor, warna biru',
    status: 'processing',
    createdAt: '2024-04-01T14:30:00Z'
  }
];

// Mock customers
export const customers: Customer[] = [
  {
    id: '101',
    name: 'Budi Santoso',
    contact: 'budi@example.com',
    orders: ['1']
  },
  {
    id: '102',
    name: 'Siti Nurhayati',
    contact: '+6281234567890',
    orders: ['2']
  }
];

// Mock admin users
export const adminUsers = [
  {
    id: '1',
    email: 'admin@rammo.com',
    password: 'admin123' // In a real app, this would be hashed
  }
];

// Mock API handlers
export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
};

export const fetchProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.find(product => product.id === id)), 300);
  });
};

export const fetchOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(orders), 500);
  });
};

export const fetchCustomerOrders = (contactInfo: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    const result = orders.filter(order => order.contact === contactInfo);
    setTimeout(() => resolve(result), 500);
  });
};

export const createOrder = (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  return new Promise((resolve) => {
    const newOrder: Order = {
      ...order,
      id: `${orders.length + 1}`,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    setTimeout(() => resolve(newOrder), 500);
  });
};

export const updateOrderStatus = (orderId: string, status: Order['status']): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
    setTimeout(() => resolve(order), 300);
  });
};

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

export const addProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    const newProduct: Product = {
      ...product,
      id: `${products.length + 1}`
    };
    products.push(newProduct);
    setTimeout(() => resolve(newProduct), 500);
  });
};

export const updateProduct = (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      setTimeout(() => resolve(products[index]), 300);
    } else {
      setTimeout(() => resolve(undefined), 300);
    }
  });
};

export const deleteProduct = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      setTimeout(() => resolve(true), 300);
    } else {
      setTimeout(() => resolve(false), 300);
    }
  });
};
