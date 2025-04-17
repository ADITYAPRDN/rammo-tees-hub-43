
import { Product } from '@/lib/data';

// Export the Product interface again to make it directly available from this service
export type { Product };

// Menyimpan semua produk dalam memori untuk simulasi database
let products: Product[] = [
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

export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...products]), 500);
  });
};

export const fetchProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.find(product => product.id === id)), 300);
  });
};

export const createProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    const newProduct: Product = {
      ...product,
      id: `${products.length + 1}`
    };
    products.push(newProduct);
    setTimeout(() => resolve({...newProduct}), 500);
  });
};

export const updateProduct = (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      setTimeout(() => resolve({...products[index]}), 300);
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
