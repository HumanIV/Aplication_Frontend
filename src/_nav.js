import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilLibraryBuilding,
  cilBook,
  cilReportSlash,
  cilStar,
  cilPencil,
  cilSatelite,
  cilCart,
  cilDollar,
  cilCash
} from '@coreui/icons'
import { CNav, CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'INICIO',
    to: '/Inicio',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'MODULES',
  },

  {
    component: CNavGroup,
    name: 'Productos',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Productos',
        to: '/Products',
      },
      {
        component:CNavItem,
        name:'USERS',
        to:'/users'
      }
    ],
  },

  {
    component: CNavGroup,
    name: 'Pedidos',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pedidos',
        to: '/Pedidos',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Facturacion',
    icon:<CIcon icon={cilCash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name:'Facturacion',
        to:'/Facturacion'
      }
    ]
  },
  {
    component: CNavGroup,
    name: 'Inventario',
    icon:<CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name:'Inventario',
        to:'/Inventario'
      }
    ]
  },

{
    component: CNavGroup,
    name: 'Reportes y Estadísticas',
    icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Reportes',
        to: '/Reports',
      },
    ],
  },


  {
    component: CNavGroup,
    name: 'Login',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
    ],
  },
]

export default _nav
