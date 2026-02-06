// src/api/helpFetch.js (VERSIÓN ACTUALIZADA CON checkConnection)
export const helpFetch = () => {
  const URL = 'http://localhost:3001'

  const customFetch = async (endpoint, options = {}) => {
    options.method = options.method || 'GET'

    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const token = localStorage.getItem('accessToken')
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    options.headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    }

    if (options.body) {
      options.body = JSON.stringify(options.body)
    }

    console.log(`🌐 ${options.method} ${URL}${endpoint}`)

    try {
      const response = await fetch(`${URL}${endpoint}`, options)
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`)
      
      // Leer la respuesta como texto primero
      const text = await response.text()
      
      // Si no hay contenido, retornar objeto vacío
      if (!text || text.trim() === '') {
        console.log('✅ Response vacía')
        return { ok: response.ok, _ok: response.ok, _status: response.status }
      }
      
      let data
      try {
        // Intentar parsear como JSON
        data = JSON.parse(text)
        console.log(`✅ JSON Response:`, data)
      } catch (jsonError) {
        console.log(`⚠️ Response no es JSON:`, text)
        data = { text, ok: response.ok, _ok: response.ok, _status: response.status }
      }
      
      // **IMPORTANTE: Siempre agregar propiedades de estado**
      if (!data._ok) {
        data._ok = response.ok
      }
      if (!data._status) {
        data._status = response.status
      }
      if (!data._statusText) {
        data._statusText = response.statusText
      }
      
      return data
      
    } catch (error) {
      console.error(`❌ Network error:`, error.message)
      return {
        ok: false,
        message: 'Error de conexión con el servidor',
        _ok: false,
        _status: 0,
        _statusText: 'Network Error'
      }
    }
  }

  // ============================================
  // MÉTODOS HTTP BÁSICOS
  // ============================================
  const get = (endpoint, options = {}) => customFetch(endpoint, { ...options, method: 'GET' })
  
  const post = (endpoint, body, options = {}) => {
    return customFetch(endpoint, { 
      ...options, 
      method: 'POST', 
      body 
    })
  }
  
  const put = (endpoint, body, options = {}) => customFetch(endpoint, { ...options, method: 'PUT', body })
  
  const delet = (endpoint, id, options = {}) => {
    const url = id ? `${endpoint}/${id}` : endpoint
    return customFetch(url, { ...options, method: 'DELETE' })
  }

  // ============================================
  // MÉTODO checkConnection NUEVO
  // ============================================
  const checkConnection = async () => {
    try {
      console.log('🔍 Verificando conexión con el backend...');
      
      // Intentar hacer una solicitud simple a la raíz o a un endpoint que siempre exista
      const response = await fetch(`${URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Backend conectado correctamente');
        return true;
      } else {
        console.log(`⚠️ Backend responde pero con error: ${response.status}`);
        return true; // Si responde, aunque sea con error, significa que está activo
      }
    } catch (error) {
      console.error('❌ Error de conexión con backend:', error.message);
      return false;
    }
  };

  return { 
    get, 
    post, 
    put, 
    delet, // <-- Nota: se llama 'delet' no 'delete'
    checkConnection, // <-- AGREGAR ESTO
    URL 
  }
}