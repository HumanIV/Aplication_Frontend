// src/hooks/useUserRole.js (COMPLETO Y CORREGIDO)
import { useState, useEffect, useCallback } from 'react'
import { helpFetch } from '../api/helpFetch'

const api = helpFetch()

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mapeo de nombres de roles a inglés (para el sistema)
  const roleMapSpanishToEnglish = {
    'Administrador': 'admin',
    'Gerente': 'gerente',
    'Empleado': 'empleado',
    'Cliente': 'cliente'
  }

  // Mapeo de Id_rol a nombres legibles (VENTAS)
  const roleMapIdToEnglish = {
    1: 'admin',           // "Administrador"
    2: 'gerente',         // "Gerente"
    3: 'empleado',        // "Empleado"
    4: 'cliente'          // "Cliente"
  }

  // Función para obtener el rol en inglés
  const getEnglishRole = useCallback((userData) => {
    if (!userData) return 'cliente'
    
    // Prioridad 1: Usar Id_rol
    if (userData.Id_rol && roleMapIdToEnglish[userData.Id_rol]) {
      return roleMapIdToEnglish[userData.Id_rol]
    }
    
    // Prioridad 2: Usar tipo_rol (español) y convertir a inglés
    if (userData.tipo_rol && roleMapSpanishToEnglish[userData.tipo_rol]) {
      return roleMapSpanishToEnglish[userData.tipo_rol]
    }
    
    // Prioridad 3: Usar rol (inglés) si existe
    if (userData.rol) {
      return userData.rol
    }
    
    return 'cliente' // Por defecto
  }, [])

  // Función para validar datos del usuario
  const validateUserData = useCallback((userData) => {
    if (!userData || !userData.id) {
      console.warn(`⚠️ Campo requerido faltante: id`)
      return false
    }
    
    // Verificar que tengamos al menos un identificador de rol
    const hasRoleInfo = userData.Id_rol || userData.tipo_rol || userData.rol
    if (!hasRoleInfo) {
      console.warn(`⚠️ Sin información de rol`)
      return false
    }
    
    return true
  }, [])

  // Función para obtener datos del usuario desde el backend
  const fetchUserFromBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setError('No hay token de autenticación')
        setIsLoading(false)
        return null
      }

      console.log('🔍 useUserRole - Obteniendo datos del usuario desde backend...')
      
      const response = await api.get('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ useUserRole - Respuesta del backend:', response)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.')
          return null
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      if (!response.user) {
        throw new Error('Respuesta inválida del servidor: datos de usuario no encontrados')
      }

      // Obtener rol en inglés
      const englishRole = getEnglishRole(response.user)
      
      console.log(`🔄 useUserRole - Rol detectado: tipo_rol "${response.user.tipo_rol}" → ${englishRole}`)
      
      // Preparar datos completos del usuario
      const completeUserData = {
        ...response.user,
        rol: englishRole,                    // Nombre del rol estandarizado (inglés)
        tipo_rol: response.user.tipo_rol,    // Nombre original en español
        Id_rol: response.user.Id_rol,        // ID numérico original
        esAdmin: englishRole === 'admin',
        esGerente: englishRole === 'gerente',
        esEmpleado: englishRole === 'empleado',
        esCliente: englishRole === 'cliente'
      }

      // Validar datos antes de retornar
      if (!validateUserData(completeUserData)) {
        throw new Error('Datos de usuario inválidos')
      }

      console.log('👤 useUserRole - Datos procesados:', {
        id: completeUserData.id,
        rol: completeUserData.rol,
        tipo_rol: completeUserData.tipo_rol,
        Id_rol: completeUserData.Id_rol
      })

      // Guardar en localStorage como cache
      localStorage.setItem('user', JSON.stringify(completeUserData))

      return completeUserData
    } catch (err) {
      console.error('❌ useUserRole - Error obteniendo datos desde backend:', err)
      
      // Manejo específico de errores de red
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Error de conexión. Verifica tu conexión a internet.')
      } else {
        setError(err.message || 'Error al obtener datos del usuario')
      }
      
      return null
    }
  }, [getEnglishRole, validateUserData])

  // Función para obtener datos del usuario (localStorage o backend)
  const getUserData = useCallback(async (forceRefresh = false) => {
    try {
      // Si no forceRefresh, intentar obtener de localStorage primero
      if (!forceRefresh) {
        const cachedUser = localStorage.getItem('user')
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser)
            console.log('📦 useUserRole - Usando datos cacheados de localStorage')
            
            // Validar datos cacheados
            if (validateUserData(parsedUser)) {
              return parsedUser
            } else {
              console.warn('⚠️ useUserRole - Datos cacheados inválidos, obteniendo de backend')
            }
          } catch (e) {
            console.warn('⚠️ useUserRole - Error al parsear cache, obteniendo de backend')
          }
        }
      }

      // Obtener desde backend
      console.log('🔄 useUserRole - Obteniendo datos frescos del backend')
      return await fetchUserFromBackend()
    } catch (err) {
      console.error('❌ useUserRole - Error en getUserData:', err)
      throw err
    }
  }, [fetchUserFromBackend, validateUserData])

  // Función para refrescar datos del usuario
  const refreshUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const freshUserData = await getUserData(true)
      
      if (freshUserData) {
        setUserData(freshUserData)
        setUserRole(freshUserData.rol)
        setUserId(freshUserData.id)
      }
      
      return freshUserData
    } catch (err) {
      setError(err.message || 'Error al refrescar datos')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getUserData])

  // Función para limpiar datos del usuario (logout)
  const clearUserData = useCallback(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUserRole(null)
    setUserId(null)
    setUserData(null)
    setError(null)
  }, [])

  // Verificar si tiene un rol específico
  const hasRole = useCallback((role) => {
    if (!userRole) return false
    
    const rolesHierarchy = {
      'admin': ['admin'],
      'gerente': ['gerente'],
      'empleado': ['empleado'],
      'cliente': ['cliente']
    }
    
    return rolesHierarchy[userRole]?.includes(role) || false
  }, [userRole])

  // Verificar si tiene al menos uno de varios roles
  const hasAnyRole = useCallback((roles = []) => {
    if (!userRole) return false
    return roles.includes(userRole)
  }, [userRole])

  // Efecto inicial para cargar datos del usuario
  useEffect(() => {
    let isMounted = true

    const loadUserData = async () => {
      try {
        if (isMounted) {
          setIsLoading(true)
          setError(null)
        }
        
        // Obtener datos del usuario
        const userData = await getUserData()
        
        if (isMounted && userData) {
          setUserData(userData)
          setUserRole(userData.rol)
          setUserId(userData.id)
          
          console.log('✅ useUserRole - Datos cargados exitosamente:', {
            id: userData.id,
            rol: userData.rol,
            tipo_rol: userData.tipo_rol
          })
        }
      } catch (err) {
        if (isMounted) {
          console.error('❌ useUserRole - Error cargando datos iniciales:', err)
          setError(err.message || 'Error al cargar datos del usuario')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUserData()

    return () => {
      isMounted = false
    }
  }, [getUserData])

  return {
    // Datos del usuario
    userRole,
    userId,
    userData,
    
    // Estados
    isLoading,
    error,
    
    // Funciones
    getUserData,
    refreshUserData,
    clearUserData,
    hasRole,
    hasAnyRole,
    
    // Atajos comunes
    isAdmin: userRole === 'admin',
    isGerente: userRole === 'gerente',
    isEmpleado: userRole === 'empleado',
    isCliente: userRole === 'cliente',
    
    // Verificación de permisos
    canManageUsers: hasAnyRole(['admin']),
    canManageProducts: hasAnyRole(['admin', 'gerente']),
    canManageSales: hasAnyRole(['admin', 'gerente', 'empleado']),
    canViewReports: hasAnyRole(['admin', 'gerente']),
    
    // Nuevas utilidades
    isAuthenticated: !!userRole && !!userId,
    roleId: userData?.Id_rol || null,
    roleName: userData?.tipo_rol || null
  }
}

export default useUserRole