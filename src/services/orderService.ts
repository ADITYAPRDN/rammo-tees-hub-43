
import { supabase } from '@/integrations/supabase/client';
import type { Order, OrderItem } from '@/lib/data';

// Export the Order interface again to make it directly available from this service
export type { Order, OrderItem };

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    // Fetch orders from Supabase
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*)');
    
    if (ordersError) throw ordersError;
    
    // Transform the data to match our Order interface
    return orders.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name || '',
      contact: order.contact || '',
      notes: order.notes || '',
      status: order.status as Order['status'],
      createdAt: order.created_at,
      products: order.order_items.map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name || 'Product', // Fallback name
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const fetchOrderById = async (id: string): Promise<Order | undefined> => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name || '',
      contact: order.contact || '',
      notes: order.notes || '',
      status: order.status as Order['status'],
      createdAt: order.created_at,
      products: order.order_items.map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name || 'Product',
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))
    };
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return undefined;
  }
};

export const fetchCustomerOrders = async (contactInfo: string): Promise<Order[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('contact', contactInfo);
    
    if (error) throw error;
    
    return orders.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name || '',
      contact: order.contact || '',
      notes: order.notes || '',
      status: order.status as Order['status'],
      createdAt: order.created_at,
      products: order.order_items.map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name || 'Product',
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))
    }));
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  try {
    // Start a transaction to insert order and order items
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: order.customerId,
        customer_name: order.customerName,
        contact: order.contact,
        notes: order.notes,
        status: order.status
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items
    const orderItems = order.products.map(product => ({
      order_id: newOrder.id,
      product_id: product.productId,
      product_name: product.productName,
      size: product.size,
      quantity: product.quantity,
      price: product.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Return the created order with proper format
    return {
      id: newOrder.id,
      customerId: newOrder.customer_id,
      customerName: newOrder.customer_name || '',
      contact: newOrder.contact || '',
      notes: newOrder.notes || '',
      status: newOrder.status as Order['status'],
      createdAt: newOrder.created_at,
      products: order.products
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order | undefined> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select('*, order_items(*)')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name || '',
      contact: data.contact || '',
      notes: data.notes || '',
      status: data.status as Order['status'],
      createdAt: data.created_at,
      products: data.order_items.map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name || 'Product',
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))
    };
  } catch (error) {
    console.error(`Error updating order status with ID ${orderId}:`, error);
    return undefined;
  }
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    // With CASCADE constraint, this will delete related order_items too
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    return false;
  }
};
