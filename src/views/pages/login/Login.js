// src/views/pages/login/Login.js (COMPLETAMENTE CORREGIDO)
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilWarning, cilCheckCircle } from '@coreui/icons'
import { helpFetch } from '../../../api/helpFetch'

const api = helpFetch()

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [backendStatus, setBackendStatus] = useState('checking')

  // Función auxiliar para convertir tipo_rol a rol inglés
  const getEnglishRoleFromSpanish = (tipoRol) => {
    const map = {
      'Administrador': 'admin',
      'Gerente': 'gerente', 
      'Empleado': 'empleado',
      'Cliente': 'cliente',
      'Docente': 'docente', // Por si acaso
      'Representante': 'representante', // Por si acaso
      'Estudiante': 'estudiante' // Por si acaso
    }
    return map[tipoRol] || 'cliente'
  }

  // Verificar conexión con el backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log('🔍 Verificando conexión con backend...')
        const isConnected = await api.checkConnection()
        setBackendStatus(isConnected ? 'connected' : 'error')
        
        if (!isConnected) {
          console.error('❌ No se pudo conectar al backend')
        }
      } catch (error) {
        console.error('❌ Error verificando conexión:', error)
        setBackendStatus('error')
      }
    }
    checkBackend()
  }, [])

  // Redirigir si ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        const userRole = userData.rol || getEnglishRoleFromSpanish(userData.tipo_rol) || 'cliente'
        
        // Redirigir según rol
        const redirectPath = getRedirectPathByRole(userRole)
        navigate(redirectPath, { replace: true })
      } catch (err) {
        console.error('Error verificando autenticación:', err)
      }
    }
  }, [navigate])

  // Función para determinar redirección según rol
  const getRedirectPathByRole = (roleName) => {
    const savedPath = localStorage.getItem('redirectAfterLogin')
    
    if (savedPath && !savedPath.includes('/login')) {
      localStorage.removeItem('redirectAfterLogin')
      return savedPath
    }
    
    // Redirección por defecto según rol
    switch (roleName) {
      case 'admin':
        console.log('⚙️ Redirigiendo ADMIN a Inicio')
        return '/Inicio'
        
      case 'gerente':
        console.log('👔 Redirigiendo GERENTE a dashboard')
        return '/gerente/dashboard'
        
      case 'empleado':
        console.log('👨‍💼 Redirigiendo EMPLEADO a ventas')
        return '/empleado/ventas'
        
      case 'cliente':
        console.log('🛒 Redirigiendo CLIENTE a compras')
        return '/cliente/compras'
        
      default:
        console.log('🔀 Redirigiendo a inicio por defecto')
        return '/Inicio'
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Limpiar errores al escribir
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { email, password } = formData

    if (!email || !password) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Iniciando login para:', email)
      
      const response = await api.post('/api/users/login', {
        email: email.trim(),
        password: password
      })

      console.log('📥 Respuesta de API:', response)
      
      // DEBUG: Verificar estructura de la respuesta
      console.log('🔍 Estructura del user:', {
        tieneRol: !!response.user?.rol,
        rolValue: response.user?.rol,
        tieneTipoRol: !!response.user?.tipo_rol,
        tipoRolValue: response.user?.tipo_rol,
        tieneIdRol: !!response.user?.Id_rol,
        IdRolValue: response.user?.Id_rol,
        tieneId_role: !!response.user?.id_role,
        id_roleValue: response.user?.id_role
      })

      if (response.ok && response.accessToken && response.user) {
        // Asegurar que el usuario tenga la propiedad 'rol' en inglés
        const userWithRole = {
          ...response.user,
          rol: response.user.rol || getEnglishRoleFromSpanish(response.user.tipo_rol) || 'cliente'
        }
        
        console.log('✅ Usuario procesado para guardar:', {
          rol: userWithRole.rol,
          tipo_rol: userWithRole.tipo_rol,
          Id_rol: userWithRole.Id_rol
        })
        
        // Guardar tokens y datos del usuario
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(userWithRole))
        
        // Verificar que se guardó correctamente
        const savedUser = JSON.parse(localStorage.getItem('user'))
        console.log('💾 Usuario guardado en localStorage:', {
          rol: savedUser?.rol,
          tipo_rol: savedUser?.tipo_rol
        })
        
        setSuccess(`Bienvenido ${response.user.username || response.user.email}`)
        
        // Redirigir según rol
        const userRole = userWithRole.rol
        const redirectPath = getRedirectPathByRole(userRole)
        console.log('🚀 Redirigiendo a:', redirectPath, 'para rol:', userRole)
        
        // Pequeño delay para mostrar mensaje de éxito
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 1000)
        
      } else {
        // Manejar errores específicos del backend
        const errorMsg = response.msg || response.message || 'Error en la autenticación'
        
        // Detectar tipo de error para mensaje más amigable
        if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('contraseña')) {
          setError('Contraseña incorrecta')
        } else if (errorMsg.toLowerCase().includes('email') || errorMsg.toLowerCase().includes('usuario') || errorMsg.toLowerCase().includes('not found')) {
          setError('Usuario no encontrado')
        } else if (errorMsg.toLowerCase().includes('inactive') || errorMsg.toLowerCase().includes('inactivo')) {
          setError('Cuenta inactiva. Contacta al administrador.')
        } else {
          setError(errorMsg)
        }
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      
      let errorMessage = 'Error de conexión con el servidor'
      
      if (error.message) {
        if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRetryConnection = async () => {
    setBackendStatus('checking')
    try {
      const isConnected = await api.checkConnection()
      setBackendStatus(isConnected ? 'connected' : 'error')
    } catch {
      setBackendStatus('error')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4 shadow">
              <CCardBody className="d-flex flex-column align-items-center">
                {/* Logo */}
                <div className="mb-4 text-center">
                  <div className="sidebar-logo-circle-premium mx-auto mb-3">
                    <img 
                      src="/favicon.png" 
                      alt="Logo V&A" 
                      className="img-fluid" 
                      style={{ maxWidth: '85px' }} 
                    />
                  </div>
                  <h1 className="text-white h3 fw-medium mb-1">V&A SISTEMA</h1>
                  <p className="text-white-50 fw-regular small mb-0">Sistema de Gestión</p>
                  
                  {/* Estado de conexión con BACKEND */}
                  <div className="mt-3">
                    {backendStatus === 'checking' && (
                      <div className="d-flex align-items-center justify-content-center text-warning">
                        <CSpinner size="sm" className="me-2" />
                        <small className="text-white-50">Conectando al servidor...</small>
                      </div>
                    )}
                    {backendStatus === 'connected' && (
                      <div className="d-flex align-items-center justify-content-center text-success">
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        <small className="text-white-50">Conectado al servidor</small>
                      </div>
                    )}
                    {backendStatus === 'error' && (
                      <div className="d-flex align-items-center justify-content-center text-danger">
                        <CIcon icon={cilWarning} className="me-2" />
                        <small className="text-white-50">Error de conexión</small>
                        <CButton 
                          size="sm" 
                          color="link" 
                          className="text-warning p-0 ms-2"
                          onClick={handleRetryConnection}
                        >
                          Reintentar
                        </CButton>
                      </div>
                    )}
                  </div>
                </div>

                <CForm className="w-100" onSubmit={handleLogin}>
                  <h2 className="text-center mb-3">Iniciar Sesión</h2>
                  <p className="text-body-secondary text-center mb-4">
                    Ingresa tus credenciales para acceder al sistema
                  </p>

                  {/* Mensajes de error/éxito */}
                  {error && (
                    <CAlert color="danger" className="mb-3">
                      <CIcon icon={cilWarning} className="me-2" />
                      {error}
                    </CAlert>
                  )}
                  
                  {success && (
                    <CAlert color="success" className="mb-3">
                      <CIcon icon={cilCheckCircle} className="me-2" />
                      {success}
                    </CAlert>
                  )}

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted-custom mb-1 ls-1">
                      Correo Electrónico
                    </label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="ejemplo@empresa.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        disabled={loading || backendStatus === 'error'}
                        required
                      />
                    </CInputGroup>
                  </div>

                  {/* Contraseña */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted-custom mb-1 ls-1">
                      Contraseña
                    </label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="••••••••"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        disabled={loading || backendStatus === 'error'}
                        required
                      />
                    </CInputGroup>
                  </div>

                  {/* Botón de login */}
                  <div className="mb-3">
                    <CButton 
                      type="submit" 
                      color="primary" 
                      className="w-100 py-2"
                      disabled={loading || backendStatus === 'error'}
                    >
                      {loading ? (
                        <>
                          <CSpinner component="span" size="sm" className="me-2" />
                          Autenticando...
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </CButton>
                  </div>

                  {/* Enlaces adicionales */}
                  <CRow className="mb-3">
                    <CCol xs={6}>
                      <CButton 
                        color="link" 
                        className="px-0 w-100 text-start"
                        onClick={() => navigate('/register')}
                        disabled={loading}
                      >
                        ¿No tienes cuenta? Regístrate
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-end">
                      <CButton 
                        color="link" 
                        className="px-0"
                        onClick={() => navigate('/forgot-password')}
                        disabled={loading}
                      >
                        ¿Olvidaste tu contraseña?
                      </CButton>
                    </CCol>
                  </CRow>

                  {/* Información de desarrollo */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-3 p-3 bg-dark bg-opacity-25 rounded">
                      <small className="text-white-50 d-block text-center">
                        Backend: http://localhost:3001
                      </small>
                      <small className="text-white-50 d-block text-center mt-1">
                        Estado: {backendStatus === 'connected' ? '🟢 Conectado' : 
                                backendStatus === 'error' ? '🔴 Error' : '🟡 Conectando...'}
                      </small>
                    </div>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
            
            {/* Footer */}
            <p className="text-center text-white-50 mt-3 small mb-0">
              &copy; {new Date().getFullYear()} V&A Sistema de Gestión.
            </p>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        .bg-body-tertiary {
          min-height: 100vh;
          background: #1a1c1e;
          position: relative;
          overflow: hidden;
        }
        .sidebar-logo-circle-premium {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(var(--primary-500-rgb, 0, 122, 204), 0.3);
          margin: 0 auto;
        }
        .nav-icon {
          color: var(--primary-500) !important;
        }
        .btn-premium {
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
          border: none;
          color: white;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }
        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(var(--primary-500-rgb, 0, 122, 204), 0.4);
        }
        .btn-premium:disabled {
          opacity: 0.7;
          transform: none !important;
          box-shadow: none !important;
        }
        .input-premium:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 0.2rem rgba(var(--primary-500-rgb, 0, 122, 204), 0.25);
        }
      `}</style>
    </div>
  )
}

export default Login