import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logoPersonalizado from '../assets/images/LogoCM.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <>
      <style>
        {`
        /* --- MODO OSCURO --- */
        [data-coreui-theme="dark"] .sidebar {
          background: linear-gradient(180deg, #000430 0%, #000e01 100%) !important;
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3) !important;
        }
        [data-coreui-theme="dark"] .nav-link.active {
          background: rgba(46, 139, 87, 0.2) !important;
          border-left: 4px solid #2e8b57 !important;
          color: #58cc7d !important;
        }

        /* --- MODO CLARO --- */
        [data-coreui-theme="light"] .sidebar {
          background: linear-gradient(180deg, #0015ffc4 0%, #00ff11b0 100%) !important;
          box-shadow: 2px 0 12px #0015ffc4 !important;
        }
        
        /* Texto de los enlaces en negro */
        [data-coreui-theme="light"] .nav-link {
          color: #000000 !important;
        }

        /* ICONOS EN NEGRO */
        [data-coreui-theme="light"] .nav-icon {
          color: #000000 !important;
        }

        /* TEXTO "MODULOS" (TITULOS) EN NEGRO */
        [data-coreui-theme="light"] .nav-title {
          color: #000000 !important;
          font-weight: 700;
        }

        [data-coreui-theme="light"] .nav-link.active {
          background: rgba(0, 122, 204, 0.72) !important;
          border-left: 4px solid #000436 !important;
          color: #000000 !important;
          font-weight: 600;
        }

        /* Forzar iconos negros incluso en el item activo */
        [data-coreui-theme="light"] .nav-link.active .nav-icon {
          color: #000000 !important;
        }

        .sidebar, .nav-link, .btn, .nav-icon {
          transition: all 0.3s ease-in-out !important;
        }
          /* Color cuando el mouse está encima (Modo Claro) */
         [data-coreui-theme="light"] .nav-link:hover {
         background: rgba(0, 122, 204, 0.40) !important;
         color: #000436 !important; 
        }

         /* Color cuando el mouse está encima (Modo Oscuro) */
         [data-coreui-theme="dark"] .nav-link:hover {
          background: rgba(46, 139, 87, 0.15) !important; /* Verde traslúcido */
          color: #58cc7d !important; /* Verde claro */
        }
      `}
      </style>

      <CSidebar
        className="shadow-lg border-0"
        // Esto hace que el esquema cambie automáticamente con el tema global
        colorScheme={useSelector((state) => (state.theme === 'dark' ? 'dark' : 'light'))}
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible })
        }}
      >
        <CSidebarHeader className="border-bottom border-secondary border-opacity-25">
          <CSidebarBrand
            to="/"
            className="d-flex justify-content-center align-items-center w-100 py-4"
          >
            <img
              src={logoPersonalizado}
              height={110}
              alt="Logo V&A"
              style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))' }}
            />
          </CSidebarBrand>
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>

        <AppSidebarNav items={navigation} />

        <CSidebarFooter className="border-top border-secondary border-opacity-25 d-none d-lg-flex">
          <CSidebarToggler
            onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
          />
        </CSidebarFooter>
      </CSidebar>
    </>
  )
}

export default React.memo(AppSidebar)
