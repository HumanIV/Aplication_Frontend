// src/components/PublicRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken')
  
  // Si ya está autenticado, redirigir según su rol
  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user.rol || 'cliente'
    
    switch(userRole) {
      case 'admin':
        return <Navigate to="/Inicio" replace />
      case 'gerente':
        return <Navigate to="/gerente/dashboard" replace />
      case 'empleado':
        return <Navigate to="/empleado/ventas" replace />
      case 'cliente':
        return <Navigate to="/cliente/compras" replace />
      default:
        return <Navigate to="/Inicio" replace />
    }
  }
  
  return children
}

export default PublicRoute