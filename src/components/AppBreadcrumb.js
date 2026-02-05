import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux' // Importamos para saber el tema

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  // Asumiendo que guardas el tema en el estado global o lo detectas por atributo
  // Si usas el hook de CoreUI: const isDark = document.documentElement.getAttribute('data-coreui-theme') === 'dark'

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      <style>
        {`
          /* Estilo base para los Breadcrumbs */
          .custom-breadcrumb .breadcrumb-item a {
            text-decoration: none !important;
            transition: color 0.3s ease;
          }

          /* MODO OSCURO */
          [data-coreui-theme="dark"] .custom-breadcrumb .breadcrumb-item,
          [data-coreui-theme="dark"] .custom-breadcrumb .breadcrumb-item a {
            color: rgba(255, 255, 255, 0.6) !important;
          }
          [data-coreui-theme="dark"] .custom-breadcrumb .breadcrumb-item.active {
            color: #58cc7d !important; /* Verde V&A */
            font-weight: 600;
          }

          /* MODO CLARO */
          [data-coreui-theme="light"] .custom-breadcrumb .breadcrumb-item,
          [data-coreui-theme="light"] .custom-breadcrumb .breadcrumb-item a {
            color: rgba(0, 0, 0, 0.8) !important;
          }
          [data-coreui-theme="light"] .custom-breadcrumb .breadcrumb-item.active {
            color: #00183d !important; /* Azul V&A */
            font-weight: 600;
          }

          /* Separador "/" */
          .breadcrumb-item + .breadcrumb-item::before {
            color: inherit;
          }
        `}
      </style>

      <CBreadcrumb className="my-0 custom-breadcrumb">
        <CBreadcrumbItem href="/">V&A</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>
          )
        })}
      </CBreadcrumb>
    </>
  )
}

export default React.memo(AppBreadcrumb)
