import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilLibraryBuilding,
  cilReportSlash,
  cilStar,
  cilPencil,
  cilUser,
  cilCart,
  cilCash,
  cilLibraryAdd,
  cilSatelite,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Panel de Inicio',
    to: '/Inicio',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Gestión Administrativa',
  },

  {
    component: CNavItem,
    name: 'Control de Usuarios',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Catálogo y Productos',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista de Productos',
        to: '/Products',
      },
      // ELIMINADO: Ya no está el duplicado de usuarios aquí
    ],
  },

  {
    component: CNavGroup,
    name: 'Ventas y Pedidos',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Gestión de Pedidos',
        to: '/Pedidos',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Finanzas',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Módulo de Facturación',
        to: '/Facturacion',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Bodega Central',
    icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Control de Inventario',
        to: '/Inventario',
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Existencias (Stock)',
    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
    to: '/Stock',
  },

  {
    component: CNavTitle,
    name: 'Reportes e Inteligencia',
  },

  {
    component: CNavGroup,
    name: 'Estadísticas',
    icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Reportes Generales',
        to: '/Reports',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Configuración de Acceso',
  },

  {
    component: CNavGroup,
    name: 'Seguridad',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Iniciar Sesión',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Crear Cuenta',
        to: '/register',
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Mi Perfil de Usuario',
    icon: <CIcon icon={cilSatelite} customClassName="nav-icon" />,
    to: '/Profile',
  },
]

export default _nav
