import React from 'react'

// Dashboard y Vistas Principales
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Inicio = React.lazy(() => import('./views/Inicio/Inicio'))

// Módulos de Gestión
const Users = React.lazy(() => import('./views/users/users'))
const Products = React.lazy(() => import('./views/Products/Products'))
const Pedidos = React.lazy(() => import('./views/Pedidos/Pedidos'))
const Facturacion = React.lazy(() => import('./views/Facturacion/Facturacion'))
const Inventario = React.lazy(() => import('./views/inventario/inventario'))
const Stock = React.lazy(() => import('./views/Stock/Stock'))
const Reports = React.lazy(() => import('./views/Reportes/Reports'))

// Perfil y Autenticación
const Profile = React.lazy(() => import('./views/Profile/Profile')) // Mantiene la ruta del archivo físico
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))


const routes = [
  { path: '/', exact: true, name: 'V&A' },

  // Dashboard e Inicio
  { path: '/Inicio', name: 'Panel de Inicio', element: Inicio },

  // Administración
  { path: '/users', name: 'Gestión de Usuarios', element: Users },
  { path: '/Products', name: 'Catálogo de Productos', element: Products },
  { path: '/Stock', name: 'Existencias en Stock', element: Stock },

  // Operaciones y Finanzas
  { path: '/Pedidos', name: 'Gestión de Pedidos', element: Pedidos },
  { path: '/Facturacion', name: 'Módulo de Facturación', element: Facturacion },
  { path: '/Inventario', name: 'Control de Inventario', element: Inventario },

  // Análisis y Reportes
  { path: '/Reports', name: 'Estadísticas y Reportes', element: Reports },

  // Cuenta y Seguridad
  { path: '/Profile', name: 'Mi Perfil de Usuario', element: Profile }, // Aquí corregimos el "name" que se ve en pantalla
  { path: '/Login', name: 'Iniciar Sesión', element: Login },
  { path: '/Register', name: 'Crear Cuenta', element: Register },
]

export default routes
