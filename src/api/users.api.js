// src/api/users.api.js - VERSIÓN ACTUALIZADA CON RUTAS CORRECTAS
import { helpFetch } from './helpFetch'

const api = helpFetch()

// Obtener todos los usuarios
export const getUsersRequest = async () => {
  try {
    console.log('📡 API - Obteniendo lista de usuarios...')
    const response = await api.get('/api/users/list')
    
    if (response.ok) {
      console.log(`✅ API - Usuarios obtenidos: ${response.users?.length || 0}`)
      return {
        success: true,
        data: response.users || [],
        total: response.total || 0,
        ok: true
      }
    } else {
      console.error('❌ API - Error obteniendo usuarios:', response.msg)
      throw new Error(response.msg || 'Error al obtener usuarios')
    }
  } catch (error) {
    console.error('❌ API - Error en getUsersRequest:', error.message)
    throw error
  }
}

// Crear usuario
export const createUserRequest = async (userData) => {
  try {
    console.log('📝 API - Creando nuevo usuario...', userData)
    
    // Usa la ruta /register para crear usuario (pública)
    const response = await api.post('/api/users/register', userData)
    
    if (response.ok) {
      console.log('✅ API - Usuario creado exitosamente:', response.user?.id)
      return {
        success: true,
        data: response.user,
        msg: response.msg,
        ok: true
      }
    } else {
      console.error('❌ API - Error creando usuario:', response.msg)
      throw new Error(response.msg || 'Error al crear usuario')
    }
  } catch (error) {
    console.error('❌ API - Error en createUserRequest:', error.message)
    throw error
  }
}

// Actualizar usuario
export const updateUserRequest = async (userId, userData) => {
  try {
    console.log(`✏️ API - Actualizando usuario ID: ${userId}`, userData)
    
    // Usa la ruta PUT /api/users/:id
    const response = await api.put(`/api/users/${userId}`, userData)
    
    if (response.ok) {
      console.log('✅ API - Usuario actualizado exitosamente')
      return {
        success: true,
        data: response.user,
        msg: response.msg,
        ok: true
      }
    } else {
      console.error('❌ API - Error actualizando usuario:', response.msg)
      throw new Error(response.msg || 'Error al actualizar usuario')
    }
  } catch (error) {
    console.error('❌ API - Error en updateUserRequest:', error.message)
    throw error
  }
}

// Desactivar usuario (cambiar status a false)
export const patchUserRequest = async (userId, statusData) => {
  try {
    console.log(`⚙️ API - Cambiando estado usuario ID: ${userId}`, statusData)
    
    // Usa la ruta PUT /api/users/:id/status
    const response = await api.put(`/api/users/${userId}/status`, {
      status: statusData.status
    })
    
    if (response.ok) {
      console.log('✅ API - Estado de usuario actualizado')
      return {
        success: true,
        data: response.user,
        msg: response.msg,
        ok: true
      }
    } else {
      console.error('❌ API - Error cambiando estado:', response.msg)
      throw new Error(response.msg || 'Error al cambiar estado')
    }
  } catch (error) {
    console.error('❌ API - Error en patchUserRequest:', error.message)
    throw error
  }
}

// Reactivar usuario
export const reactivateUserRequest = async (userId) => {
  try {
    console.log(`🔄 API - Reactivando usuario ID: ${userId}`)
    
    // Usa la ruta PUT /api/users/:id/reactivate
    const response = await api.put(`/api/users/${userId}/reactivate`)
    
    if (response.ok) {
      console.log('✅ API - Usuario reactivado')
      return {
        success: true,
        data: response.user,
        msg: response.msg,
        ok: true
      }
    } else {
      console.error('❌ API - Error reactivando usuario:', response.msg)
      throw new Error(response.msg || 'Error al reactivar usuario')
    }
  } catch (error) {
    console.error('❌ API - Error en reactivateUserRequest:', error.message)
    throw error
  }
}

// Eliminar usuario (físicamente)
export const deleteUserRequest = async (userId) => {
  try {
    console.log(`🗑️ API - Eliminando usuario ID: ${userId}`)
    
    // Usa la ruta DELETE /api/users/:id
    const response = await api.delet(`/api/users/${userId}`)
    
    if (response.ok) {
      console.log('✅ API - Usuario eliminado exitosamente')
      return {
        success: true,
        data: response,
        msg: response.msg,
        ok: true
      }
    } else {
      console.error('❌ API - Error eliminando usuario:', response.msg)
      throw new Error(response.msg || 'Error al eliminar usuario')
    }
  } catch (error) {
    console.error('❌ API - Error en deleteUserRequest:', error.message)
    throw error
  }
}

// Buscar usuarios (opcional, si tu frontend usa búsqueda)
export const searchUsersRequest = async (searchTerm) => {
  try {
    console.log(`🔍 API - Buscando usuarios: "${searchTerm}"`)
    const response = await api.get(`/api/users/search?search=${encodeURIComponent(searchTerm)}`)
    
    if (response.ok) {
      console.log(`✅ API - Búsqueda completada: ${response.users?.length || 0} resultados`)
      return {
        success: true,
        data: response.users || [],
        total: response.total || 0,
        ok: true
      }
    } else {
      console.error('❌ API - Error buscando usuarios:', response.msg)
      throw new Error(response.msg || 'Error al buscar usuarios')
    }
  } catch (error) {
    console.error('❌ API - Error en searchUsersRequest:', error.message)
    throw error
  }
}

// Exportar todas las funciones
export default {
  getUsersRequest,
  searchUsersRequest,
  createUserRequest,
  updateUserRequest,
  patchUserRequest,
  reactivateUserRequest,
  deleteUserRequest
}