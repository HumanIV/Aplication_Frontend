// src/_nav.js (SISTEMA DE VENTAS)
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilSpeedometer,
  cilUser,
  cilCart,
  cilCash,
  cilLibraryBuilding,
  cilLibraryAdd,
  cilChart,
  cilStar,
  cilPeople,
  cilSpreadsheet,
  cilTask,
  cilBuilding,
  cilReportSlash
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // INICIO (Según rol)
  {
    component: CNavItem,
    name: 'Panel de Inicio',
    to: '/Inicio',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    roles: ['admin', 'gerente', 'empleado', 'cliente']
  },

  {
    component: CNavTitle,
    name: 'Gestión Administrativa',
    roles: ['admin', 'gerente']
  },

  // CONTROL DE USUARIOS (Solo admin)
  {
    component: CNavItem,
    name: 'Control de Usuarios',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    roles: ['admin']
  },

  // CATÁLOGO Y PRODUCTOS (admin y gerente)
  {
    component: CNavGroup,
    name: 'Catálogo y Productos',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    roles: ['admin', 'gerente'],
    items: [
      {
        component: CNavItem,
        name: 'Lista de Productos',
        to: '/Products',
        roles: ['admin', 'gerente']
      },
    ],
  },

  // VENTAS Y PEDIDOS (admin, gerente y empleados)
  {
    component: CNavGroup,
    name: 'Ventas y Pedidos',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    roles: ['admin', 'gerente', 'empleado'],
    items: [
      {
        component: CNavItem,
        name: 'Gestión de Pedidos',
        to: '/Pedidos',
        roles: ['admin', 'gerente', 'empleado']
      },
    ],
  },

  // FACTURACIÓN (admin y gerente)
  {
    component: CNavGroup,
    name: 'Finanzas',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    roles: ['admin', 'gerente'],
    items: [
      {
        component: CNavItem,
        name: 'Módulo de Facturación',
        to: '/Facturacion',
        roles: ['admin', 'gerente']
      },
    ],
  },

  // INVENTARIO (admin, gerente, empleados)
  {
    component: CNavGroup,
    name: 'Bodega Central',
    icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    roles: ['admin', 'gerente', 'empleado'],
    items: [
      {
        component: CNavItem,
        name: 'Control de Inventario',
        to: '/Inventario',
        roles: ['admin', 'gerente', 'empleado']
      },
    ],
  },

  // STOCK (admin, gerente, empleados)
  {
    component: CNavItem,
    name: 'Existencias (Stock)',
    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
    to: '/Stock',
    roles: ['admin', 'gerente', 'empleado']
  },

  {
    component: CNavTitle,
    name: 'Reportes e Inteligencia',
    roles: ['admin', 'gerente']
  },

  // REPORTES (admin y gerente)
  {
    component: CNavGroup,
    name: 'Estadísticas',
    icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
    roles: ['admin', 'gerente'],
    items: [
      {
        component: CNavItem,
        name: 'Reportes Generales',
        to: '/Reports',
        roles: ['admin', 'gerente']
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Configuración de Acceso',
    roles: ['admin', 'gerente', 'empleado', 'cliente']
  },

  // SEGURIDAD (todos)
  {
    component: CNavGroup,
    name: 'Seguridad',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    roles: ['admin', 'gerente', 'empleado', 'cliente'],
    items: [
      {
        component: CNavItem,
        name: 'Iniciar Sesión',
        to: '/Login',
        roles: [] // Solo se muestra cuando NO está autenticado
      },
      {
        component: CNavItem,
        name: 'Crear Cuenta',
        to: '/Register',
        roles: ['cliente'] // Solo clientes pueden registrarse
      },
    ],
  },

  // PERFIL (todos)
  {
    component: CNavItem,
    name: 'Mi Perfil de Usuario',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    to: '/Profile',
    roles: ['admin', 'gerente', 'empleado', 'cliente']
  },

  // PANEL CLIENTE (solo clientes)
  {
    component: CNavGroup,
    name: 'Panel Cliente',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['cliente'],
    items: [
      {
        component: CNavItem,
        name: 'Mis Compras',
        to: '/cliente/compras',
        roles: ['cliente']
      },
      {
        component: CNavItem,
        name: 'Mi Historial',
        to: '/cliente/historial',
        roles: ['cliente']
      }
    ],
  },

  // PANEL EMPLEADO (solo empleados)
  {
    component: CNavGroup,
    name: 'Panel Empleado',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    roles: ['empleado'],
    items: [
      {
        component: CNavItem,
        name: 'Ventas del Día',
        to: '/empleado/ventas',
        roles: ['empleado']
      },
      {
        component: CNavItem,
        name: 'Mis Comisiones',
        to: '/empleado/comisiones',
        roles: ['empleado']
      }
    ],
  },

  // PANEL GERENTE (solo gerente)
  {
    component: CNavGroup,
    name: 'Panel Gerente',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    roles: ['gerente'],
    items: [
      {
        component: CNavItem,
        name: 'Dashboard Gerente',
        to: '/gerente/dashboard',
        roles: ['gerente']
      },
      {
        component: CNavItem,
        name: 'Reportes Avanzados',
        to: '/gerente/reportes',
        roles: ['gerente']
      }
    ],
  }
]

// Función para filtrar navegación según rol
export const getFilteredNav = (userRole, isAuthenticated) => {
  console.log('🔍 getFilteredNav - Rol recibido:', userRole)
  console.log('🔐 Usuario autenticado:', isAuthenticated)
  
  const roleHierarchy = {
    'admin': ['admin'],
    'gerente': ['gerente'],
    'empleado': ['empleado'],
    'cliente': ['cliente']
  }
  
  const allowedRoles = roleHierarchy[userRole] || []
  console.log('✅ Roles permitidos para', userRole, ':', allowedRoles)
  
  if (allowedRoles.length === 0 && userRole !== 'guest') {
    console.log('🚫 El rol', userRole, 'no tiene acceso al sistema')
    return []
  }
  
  const filteredNav = _nav.filter(item => {
    // Manejar títulos
    if (item.component && (item.component.displayName === 'CNavTitle')) {
      if (!item.roles || item.roles.length === 0) return false
      
      const hasVisibleItemsAfterTitle = _nav.some(navItem => {
        if (!navItem.roles || navItem.roles.length === 0) return false
        if (navItem === item) return false
        
        const itemHasAccess = navItem.roles.some(role => 
          allowedRoles.includes(role) || 
          (role === '' && !isAuthenticated) // Para login/register cuando no autenticado
        )
        
        return itemHasAccess
      })
      return item.roles.some(role => allowedRoles.includes(role)) && hasVisibleItemsAfterTitle
    }
    
    // Para items de login/register (sin roles definidos)
    if (!item.roles || item.roles.length === 0) {
      // Solo mostrar login/register si NO está autenticado
      if (item.to === '/Login' || item.to === '/Register') {
        return !isAuthenticated
      }
      return false
    }
    
    // Verificar acceso
    const hasAccess = item.roles.some(itemRole => allowedRoles.includes(itemRole))
    
    // Para grupos de navegación
    if (item.component && item.component.displayName === 'CNavGroup') {
      if (item.items) {
        const filteredItems = item.items.filter(child => {
          if (!child.roles || child.roles.length === 0) return false
          return child.roles.some(childRole => allowedRoles.includes(childRole))
        })
        return hasAccess && filteredItems.length > 0
      }
      return hasAccess
    }
    
    return hasAccess
  }).map(item => {
    if (item.items) {
      return {
        ...item,
        items: item.items.filter(child => {
          if (!child.roles || child.roles.length === 0) {
            // Para login/register en grupos
            if (child.to === '/Login' || child.to === '/Register') {
              return !isAuthenticated
            }
            return false
          }
          return child.roles.some(childRole => allowedRoles.includes(childRole))
        })
      }
    }
    return item
  })
  
  console.log('📋 Navegación filtrada final:', filteredNav.map(item => item.name))
  return filteredNav
}

export default _nav