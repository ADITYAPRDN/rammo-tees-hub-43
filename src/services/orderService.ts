
import { supabase } from '@/integrations/supabase/client';
import type { Order, OrderItem } from '@/lib/data';

// Export the Order interface again to make it directly available from this service
export type { Order, OrderItem };

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `);
    
    if (ordersError) throw ordersError;
    
    const customerPromises = orders.map(async (order) => {
      const { data: customer } = await supabase
        .from('customers')
        .select('name, contact')
        .eq('id', order.customer_id)
        .single();
      
      return {
        ...order,
        customerName: customer?.name || '',
        contact: customer?.contact || ''
      };
    });
    
    const ordersWithCustomerInfo = await Promise.all(customerPromises);
    
    return ordersWithCustomerInfo.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customerName,
      contact: order.contact,
      notes: order.notes || '',
      status: order.status as Order['status'], // Explicitly cast to the correct type
      createdAt: order.created_at,
      products: (order.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
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
      .select('id, customer_id, notes, status, created_at, order_items(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const { data: customer } = await supabase
      .from('customers')
      .select('name, contact')
      .eq('id', order.customer_id)
      .single();
    
    return {
      id: order.id,
      customerId: order.customer_id,
      customerName: customer?.name || '',
      contact: customer?.contact || '',
      notes: order.notes || '',
      status: order.status as Order['status'], // Explicitly cast to the correct type
      createdAt: order.created_at,
      products: (order.order_items || []).map((item: any) => ({
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
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, name, contact')
      .eq('contact', contactInfo)
      .single();
    
    if (customerError) throw customerError;
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_id, notes, status, created_at, order_items(*)')
      .eq('customer_id', customer.id);
    
    if (ordersError) throw ordersError;
    
    return orders.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      customerName: customer.name,
      contact: customer.contact,
      notes: order.notes || '',
      status: order.status as Order['status'], // Explicitly cast to the correct type
      createdAt: order.created_at,
      products: (order.order_items || []).map((item: any) => ({
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
    let customerId = order.customerId;
    
    if (customerId === 'guest') {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('contact', order.contact)
        .maybeSingle();
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
        await supabase
          .from('customers')
          .update({ name: order.customerName })
          .eq('id', customerId);
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: order.customerName,
            contact: order.contact
          })
          .select()
          .single();
        
        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }
    }
    
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        notes: order.notes,
        status: order.status // This is already the correct type from the parameter
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Prepare order items with product names
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
    
    return {
      id: newOrder.id,
      customerId,
      customerName: order.customerName,
      contact: order.contact,
      notes: order.notes,
      status: newOrder.status as Order['status'], // Explicitly cast to ensure type safety
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
      .select('id, customer_id, notes, status, created_at, order_items(*)')
      .single();
    
    if (error) throw error;
    
    const { data: customer } = await supabase
      .from('customers')
      .select('name, contact')
      .eq('id', data.customer_id)
      .single();
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: customer?.name || '',
      contact: customer?.contact || '',
      notes: data.notes || '',
      status: data.status as Order['status'], // Explicitly cast to the correct type
      createdAt: data.created_at,
      products: (data.order_items || []).map((item: any) => ({
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
