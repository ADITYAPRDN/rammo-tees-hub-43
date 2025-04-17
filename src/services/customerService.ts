
import { Customer } from "@/lib/data";

// Menyimpan data pelanggan dalam memori untuk simulasi database
let customers: Customer[] = [
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

export const fetchCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...customers]), 500);
  });
};

export const fetchCustomerById = (id: string): Promise<Customer | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(customers.find(customer => customer.id === id)), 300);
  });
};

export const createCustomer = (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  return new Promise((resolve) => {
    const newCustomer: Customer = {
      ...customer,
      id: `${customers.length + 1}`,
    };
    customers.push(newCustomer);
    setTimeout(() => resolve({...newCustomer}), 500);
  });
};

export const updateCustomer = (id: string, updates: Partial<Customer>): Promise<Customer | undefined> => {
  return new Promise((resolve) => {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      setTimeout(() => resolve({...customers[index]}), 300);
    } else {
      setTimeout(() => resolve(undefined), 300);
    }
  });
};
