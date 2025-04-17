import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

// Mock data for development
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

export const createProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  return new Promise((resolve) => {
    const newProduct: Product = {
      ...product,
      id: `${products.length + 1}`
    };
    products.push(newProduct);
    setTimeout(() => resolve(newProduct), 500);
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

// Define a schema for site settings form
const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  instagram: z.string().min(1, "Instagram handle is required"),
  address: z.string().min(1, "Address is required"),
});

// Define the SiteSettings component
const SiteSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock site settings data (in a real application, this would come from an API)
  const [siteSettings, setSiteSettings] = useState({
    siteName: "RAMMO Clothing",
    siteDescription: "High quality custom clothing manufacturer",
    phoneNumber: "+62123456789",
    whatsapp: "+62123456789",
    instagram: "@rammo_clothing",
    address: "Jalan Raya Clothing No. 123, Jakarta",
  });

  const form = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: siteSettings,
  });

  const onSubmit = (data: z.infer<typeof siteSettingsSchema>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSiteSettings(data);
      toast({
        title: "Settings updated",
        description: "Your site settings have been saved successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would be connected to a file upload service in a real app
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage your website's basic information and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormLabel className="block mb-2">Logo Upload</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500">
                  Upload a logo for your website (recommended size: 200x60px)
                </p>
              </div>
              
              <div>
                <FormLabel className="block mb-2">Hero Image Upload</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500">
                  Upload a hero image for your landing page (recommended size: 1200x600px)
                </p>
              </div>
              
              <Button type="submit" className="mt-4" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
