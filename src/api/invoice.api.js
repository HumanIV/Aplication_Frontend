// src/api/invoice.api.js
import { helpFetch } from "./helpFetch.js";

const { get, post, delet } = helpFetch();
const API_URL = "/api/invoices";

export const invoiceApi = {
  // ============================================
  // OBTENER TODAS LAS FACTURAS
  // ============================================
  async getInvoicesRequest() {
    try {
      console.log("📋 API - getInvoicesRequest - Solicitando facturas...");
      const response = await get(`${API_URL}`);
      return response;
    } catch (error) {
      console.error("❌ API - getInvoicesRequest - Error:", error);
      throw error;
    }
  },

  // ============================================
  // OBTENER FACTURA POR ID
  // ============================================
  async getInvoiceByIdRequest(id) {
    try {
      console.log(`🔍 API - getInvoiceByIdRequest - ID: ${id}`);
      const response = await get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error("❌ API - getInvoiceByIdRequest - Error:", error);
      throw error;
    }
  },

  // ============================================
  // OBTENER PEDIDO PARA FACTURAR
  // ============================================
  async getOrderForInvoiceRequest(orderId) {
    try {
      console.log(`🔍 API - getOrderForInvoiceRequest - Pedido ID: ${orderId}`);
      const response = await get(`${API_URL}/order/${orderId}`);
      return response;
    } catch (error) {
      console.error("❌ API - getOrderForInvoiceRequest - Error:", error);
      throw error;
    }
  },

  // ============================================
  // OBTENER PEDIDOS PENDIENTES DE FACTURAR
  // ============================================
  async getPendingOrdersRequest() {
    try {
      console.log("📋 API - getPendingOrdersRequest - Solicitando pedidos pendientes...");
      const response = await get(`${API_URL}/pending/orders`);
      return response;
    } catch (error) {
      console.error("❌ API - getPendingOrdersRequest - Error:", error);
      throw error;
    }
  },

  // ============================================
  // CREAR NUEVA FACTURA
  // ============================================
  async createInvoiceRequest(invoiceData) {
    try {
      console.log("📝 API - createInvoiceRequest - Creando factura:", invoiceData);
      const response = await post(`${API_URL}`, invoiceData);
      return response;
    } catch (error) {
      console.error("❌ API - createInvoiceRequest - Error:", error);
      throw error;
    }
  },

  // ============================================
  // ELIMINAR FACTURA
  // ============================================
  async deleteInvoiceRequest(id) {
    try {
      console.log(`🗑️ API - deleteInvoiceRequest - Eliminando factura ID: ${id}`);
      const response = await delet(`${API_URL}`, id);
      return response;
    } catch (error) {
      console.error("❌ API - deleteInvoiceRequest - Error:", error);
      throw error;
    }
  },

  // ============================================
  // OBTENER FACTURAS POR CLIENTE
  // ============================================
  async getInvoicesByCustomerRequest(customerId) {
    try {
      console.log(`🔍 API - getInvoicesByCustomerRequest - Cliente ID: ${customerId}`);
      const response = await get(`${API_URL}/customer/${customerId}`);
      return response;
    } catch (error) {
      console.error("❌ API - getInvoicesByCustomerRequest - Error:", error);
      throw error;
    }
  },
};