// products.api.js - CORREGIDO
import { helpFetch } from './helpFetch.js';

// Crear instancia de helpFetch
const api = helpFetch();
const { get, post, put, delet: del } = api;

// ============================================
// FUNCIONES PARA PRODUCTOS (CORREGIDAS)
// ============================================

// Obtener todos los productos
export const getProductsRequest = async () => {
  try {
    console.log('📦 API - getProductsRequest - Solicitando productos...');
    
    // SOLO el endpoint, no toda la URL
    const response = await get('/api/products');
    console.log('✅ API - getProductsRequest - Respuesta:', response);
    return response;
  } catch (error) {
    console.error('❌ API - getProductsRequest - Error:', error);
    throw error;
  }
};

// Buscar productos
export const searchProductsRequest = async (searchTerm) => {
  try {
    console.log(`🔍 API - searchProductsRequest - Buscando: ${searchTerm}`);
    
    const response = await get(`/api/products/search?search=${encodeURIComponent(searchTerm)}`);
    return response;
  } catch (error) {
    console.error('❌ API - searchProductsRequest - Error:', error);
    throw error;
  }
};

// Obtener producto por ID
export const getProductByIdRequest = async (id) => {
  try {
    console.log(`🔍 API - getProductByIdRequest - ID: ${id}`);
    
    const response = await get(`/api/products/${id}`);
    return response;
  } catch (error) {
    console.error('❌ API - getProductByIdRequest - Error:', error);
    throw error;
  }
};

// Crear nuevo producto
export const createProductRequest = async (productData) => {
  try {
    console.log('📝 API - createProductRequest - Datos:', productData);
    
    const response = await post('/api/products', productData);
    return response;
  } catch (error) {
    console.error('❌ API - createProductRequest - Error:', error);
    throw error;
  }
};

// Actualizar producto
export const updateProductRequest = async (id, productData) => {
  try {
    console.log(`✏️ API - updateProductRequest - ID: ${id}`, productData);
    
    const response = await put(`/api/products/${id}`, productData);
    return response;
  } catch (error) {
    console.error('❌ API - updateProductRequest - Error:', error);
    throw error;
  }
};

// Eliminar producto
export const deleteProductRequest = async (id) => {
  try {
    console.log(`🗑️ API - deleteProductRequest - ID: ${id}`);
    
    const response = await del(`/api/products/${id}`);
    return response;
  } catch (error) {
    console.error('❌ API - deleteProductRequest - Error:', error);
    throw error;
  }
};

// Obtener categorías
export const getCategoriesRequest = async () => {
  try {
    console.log('📂 API - getCategoriesRequest - Solicitando categorías...');
    
    const response = await get('/api/products/categories');
    console.log('✅ API - getCategoriesRequest - Respuesta:', response);
    return response;
  } catch (error) {
    console.error('❌ API - getCategoriesRequest - Error:', error);
    throw error;
  }
};

// Obtener departamentos
export const getDepartmentsRequest = async () => {
  try {
    console.log('📂 API - getDepartmentsRequest - Solicitando departamentos...');
    
    const response = await get('/api/products/departments');
    return response;
  } catch (error) {
    console.error('❌ API - getDepartmentsRequest - Error:', error);
    throw error;
  }
};

export default {
  getProductsRequest,
  searchProductsRequest,
  getProductByIdRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  getCategoriesRequest,
  getDepartmentsRequest
};