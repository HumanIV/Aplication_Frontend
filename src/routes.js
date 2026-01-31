import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))

// Login / Register (si planeas usarlos)
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

//RUTA
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))

//Users
const users = React.lazy(() => import('./views/users/users'))

//RUTAS

//Inicio

const Inicio = React.lazy(() => import ('./views/Inicio/Inicio'))

//PRODUCTOS

const Products = React.lazy(() => import('./views/Products/Products'))

//PEDIDOS

const Pedidos = React.lazy(() => import('./views/Pedidos/Pedidos'))

//FACTURACION

const Facturacion = React.lazy(() => import('./views/Facturacion/Facturacion'))

//Reportes y Estadísticas

const Reports = React.lazy(() => import('./views/Reportes/Reports'))


//FIN RUTAS AGG


const routes = [
  // Página principal
  { path: '/', exact: true, name: 'Home' },

  // Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Base (Gestión de Contenido)
  { path: '/base/tabs', name: 'Tabs', element: Tabs },

  // Login y Register
  { path: '/Login', name: 'Login', element: Login },
  { path: '/Register', name: 'Register', element: Register },
  //RUTA
  {path: '/buttons/buttons', name: 'Buttons', element: Buttons},
  //Users
  {path: '/users', name: 'users', element: users},

  //RUTAS
  {path: '/Inicio', name: 'Inicio', element: Inicio},
  {path: '/Products', name: 'Products', element: Products}, // Productos
  {path: '/Pedidos', name: 'Pedidos', element: Pedidos}, // Pedidos
  {path: '/Reports', name: 'Reports', element: Reports}, // Reportes y Estadísticas
  {path: '/Facturacion', name: 'Facturacion', element: Facturacion}
  //FIN RUTAS AGG





]

export default routes
