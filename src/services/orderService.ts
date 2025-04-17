
import { Order } from '@/lib/data';

// Export the Order interface again to make it directly available from this service
export type { Order };

// Menyimpan semua pesanan dalam memori untuk simulasi database
let orders: Order[] = [
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

export const fetchOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...orders]), 500);
  });
};

export const fetchOrderById = (id: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(orders.find(order => order.id === id)), 300);
  });
};

export const fetchCustomerOrders = (contactInfo: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    const result = orders.filter(order => order.contact === contactInfo);
    setTimeout(() => resolve([...result]), 500);
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
    setTimeout(() => resolve({...newOrder}), 500);
  });
};

export const updateOrderStatus = (orderId: string, status: Order['status']): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      resolve({...orders[orderIndex]});
    } else {
      resolve(undefined);
    }
    setTimeout(() => resolve(undefined), 300);
  });
};

export const deleteOrder = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders.splice(index, 1);
      setTimeout(() => resolve(true), 300);
    } else {
      setTimeout(() => resolve(false), 300);
    }
  });
};
