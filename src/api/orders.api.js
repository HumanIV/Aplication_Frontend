import { helpFetch } from './helpFetch.js';

// Crear instancia de helpFetch
const api = helpFetch();

// ============================================
// FUNCIONES PARA PEDIDOS
// ============================================

// Obtener todos los pedidos
export const getOrdersRequest = async () => {
  try {
    console.log('📋 API - getOrdersRequest - Solicitando pedidos...');
    
    const response = await api.get('/api/orders');
    
    console.log('📦 Respuesta de pedidos:', response);
    
    if (response._ok || response.ok) {
      console.log('✅ Pedidos cargados exitosamente');
      return {
        ok: true,
        orders: response.orders || response.data || [],
        message: response.message || 'Pedidos cargados'
      };
    } else {
      console.warn('⚠️ No se encontraron pedidos:', response.message || response.msg);
      return {
        ok: false,
        orders: [],
        message: response.message || response.msg || 'No hay pedidos registrados'
      };
    }
    
  } catch (error) {
    console.error('❌ API - getOrdersRequest - Error:', error);
    return {
      ok: false,
      orders: [],
      message: 'Error cargando pedidos'
    };
  }
};

// Obtener clientes
export const getCustomersRequest = async () => {
  try {
    console.log('👥 API - getCustomersRequest - Solicitando clientes...');
    
    const response = await api.get('/api/orders/customers');
    
    console.log('📦 Respuesta de clientes:', response);
    
    if (response._ok || response.ok) {
      console.log('✅ Clientes cargados exitosamente');
      
      const customers = response.customers || response.data || response || [];
      const formattedCustomers = customers.map(customer => ({
        id: customer.id || customer.id_customer,
        nombre: customer.nombre || 
               (customer.first_name && customer.last_name ? `${customer.first_name} ${customer.last_name}` : 'Cliente sin nombre'),
        rif: customer.rif || customer.identification || '',
        email: customer.email || '',
        telefono: customer.telefono || customer.phone_number || customer.phone || '',
        direccion: customer.direccion || customer.address || '',
        shipping_address: customer.shipping_address || customer.direccion || '',
        sucursal: customer.sucursal || customer.branch || ''
      }));
      
      return {
        ok: true,
        customers: formattedCustomers,
        message: 'Clientes cargados'
      };
    } else {
      console.warn('⚠️ No se encontraron clientes');
      return {
        ok: true,
        customers: [],
        message: 'No hay clientes registrados'
      };
    }
  } catch (error) {
    console.error('❌ API - getCustomersRequest - Error:', error);
    return {
      ok: true,
      customers: [],
      message: 'Error cargando clientes'
    };
  }
};

// Crear nuevo pedido
export const createOrderRequest = async (orderData) => {
  try {
    console.log('📝 API - createOrderRequest - Datos:', orderData);
    
    const response = await api.post('/api/orders', orderData);
    
    console.log('📦 Respuesta creación pedido:', response);
    
    if (response._ok || response.ok) {
      console.log('✅ Pedido creado exitosamente');
      return {
        ok: true,
        msg: response.msg || response.message || 'Pedido creado exitosamente',
        orderId: response.orderId || response.id || response.order?.id
      };
    } else {
      console.error('❌ Error al crear pedido:', response);
      return {
        ok: false,
        msg: response.msg || response.message || 'Error al crear pedido'
      };
    }
  } catch (error) {
    console.error('❌ API - createOrderRequest - Error:', error);
    return {
      ok: false,
      msg: 'Error de conexión al crear pedido'
    };
  }
};

// Eliminar pedido
export const deleteOrderRequest = async (orderId) => {
  try {
    console.log(`🗑️ API - deleteOrderRequest - Eliminando pedido ID: ${orderId}`);
    
    // IMPORTANTE: Verifica cómo está configurado tu helpFetch
    // Opción 1: Si tu helpFetch tiene método 'delet'
    const response = await api.delet(`/api/orders/${orderId}`);
    
    // Opción 2: Si tu helpFetch tiene método 'delete' (con 'e' al final)
    // const response = await api.delete(`/api/orders/${orderId}`);
    
    console.log('📦 Respuesta eliminación pedido:', response);
    
    if (response._ok || response.ok) {
      console.log('✅ Pedido eliminado exitosamente');
      return {
        ok: true,
        msg: response.msg || response.message || 'Pedido eliminado exitosamente',
        deletedOrderId: response.deletedOrderId || orderId
      };
    } else {
      console.error('❌ Error al eliminar pedido:', response);
      return {
        ok: false,
        msg: response.msg || response.message || 'Error al eliminar pedido'
      };
    }
  } catch (error) {
    console.error('❌ API - deleteOrderRequest - Error:', error);
    return {
      ok: false,
      msg: 'Error de conexión al eliminar pedido'
    };
  }
};

// Obtener productos
export const getProductsRequest = async () => {
  try {
    console.log('📦 API - getProductsRequest - Solicitando productos...');
    
    const response = await api.get('/api/products');
    
    console.log('📦 Respuesta de productos:', response);
    
    if (response._ok || response.ok) {
      console.log('✅ Productos cargados exitosamente');
      
      let productsData = [];
      
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response.products && Array.isArray(response.products)) {
        productsData = response.products;
      } else if (response.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }
      
      const formattedProducts = productsData.map(product => {
        let price = 0;
        if (typeof product.price === 'number') {
          price = product.price;
        } else if (typeof product.price === 'string') {
          price = parseFloat(product.price.replace(/[^\d.-]/g, '')) || 0;
        } else if (typeof product.Precio_Unit === 'number') {
          price = product.Precio_Unit;
        } else if (typeof product.Precio_Unit === 'string') {
          price = parseFloat(product.Precio_Unit.replace(/[^\d.-]/g, '')) || 0;
        }
        
        return {
          id: product.id_product || product.id || product.product_id,
          id_product: product.id_product || product.id || product.product_id,
          name_product: product.name_product || product.name || product.nombre || 'Producto sin nombre',
          name: product.name_product || product.name || product.nombre || 'Producto sin nombre',
          price: price,
          Precio_Unit: price,
          description: product.description || product.descripcion || '',
          category: product.category || product.categoria || product.Categoria || '',
          Categoria: product.category || product.categoria || product.Categoria || '',
          stock: product.stock || product.quantity || 0
        };
      });
      
      return {
        ok: true,
        products: formattedProducts,
        message: 'Productos cargados'
      };
    } else {
      console.warn('⚠️ No se encontraron productos');
      return {
        ok: true,
        products: [],
        message: 'No hay productos disponibles'
      };
    }
  } catch (error) {
    console.error('❌ API - getProductsRequest - Error:', error);
    return {
      ok: true,
      products: [],
      message: 'Error cargando productos'
    };
  }
};

// Crear nuevo cliente - CORREGIDO
export const createCustomerRequest = async (customerData) => {
  try {
    console.log('👤 API - createCustomerRequest - Datos:', customerData);
    
    // ENDPOINT CORREGIDO: /api/orders/customers
    const response = await api.post('/api/orders/customers', customerData);
    
    console.log('📦 Respuesta creación cliente:', response);
    
    if (response._ok || response.ok) {
      console.log('✅ Cliente creado exitosamente');
      return {
        ok: true,
        msg: response.msg || 'Cliente creado exitosamente',
        customerId: response.customerId || response.id,
        customer: response.customer || customerData
      };
    } else {
      console.error('❌ Error al crear cliente:', response);
      return {
        ok: false,
        msg: response.msg || 'Error al crear cliente'
      };
    }
  } catch (error) {
    console.error('❌ API - createCustomerRequest - Error:', error);
    return {
      ok: false,
      msg: 'Error de conexión al crear cliente'
    };
  }
};