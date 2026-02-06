// src/components/ProtectedRoute.js
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = ({ 
  children, 
  allowedRoles = []
}) => {
  const location = useLocation()

  // Estado de carga
  const [isLoading, setIsLoading] = React.useState(true)
  const [userRole, setUserRole] = React.useState('')

  React.useEffect(() => {
    const loadUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        setUserRole(user.rol || '')
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  // Verificar autenticación
  const isAuthenticated = !!localStorage.getItem('accessToken')
  
  if (!isAuthenticated) {
    localStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/Login" replace />
  }

  // Verificar permisos si se especifican roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.warn(`🚨 Acceso denegado a ${location.pathname} por rol ${userRole}`)
    
    // Redirigir según rol
    let redirectPath = '/Inicio'
    switch(userRole) {
      case 'admin':
        redirectPath = '/Inicio'
        break
      case 'gerente':
        redirectPath = '/gerente/dashboard'
        break
      case 'empleado':
        redirectPath = '/empleado/ventas'
        break
      case 'cliente':
        redirectPath = '/cliente/compras'
        break
    }
    
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default ProtectedRoute