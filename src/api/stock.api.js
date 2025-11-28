import axios from 'axios'

// Instancia configurada para el módulo de Stock
const stockApi = axios.create({
  baseURL: 'http://localhost:3001/stock', // Ajusta el puerto si es distinto al de usuarios
})

// Peticiones para el módulo de Stock
export const getStockRequest = () => stockApi.get('/')

export const getStockByIdRequest = (id_stock) => stockApi.get(`/${id_stock}`)

export const createStockRequest = (item) => stockApi.post('/', item)

// Usamos id_stock para coincidir con tu backend
export const updateStockRequest = (id_stock, newFields) => stockApi.put(`/${id_stock}`, newFields)

export const patchStockRequest = (id_stock, fields) => stockApi.patch(`/${id_stock}`, fields)

export const deleteStockRequest = (id_stock) => stockApi.delete(`/${id_stock}`)
