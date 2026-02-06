// src/components/AppHeader.js (CORREGIDO)
import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownDivider, // ← AÑADE ESTE IMPORT
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilEnvelopeOpen,
  cilMenu,
  cilUser,
} from '@coreui/icons'

const AppHeader = ({ userData, onRoleRefresh }) => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              <div className="d-flex align-items-center">
                <CIcon icon={cilUser} className="me-2" />
                <span>{userData?.username || 'Usuario'}</span>
                <small className="text-muted ms-2">
                  ({userData?.tipo_rol || 'Sin rol'})
                </small>
              </div>
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#/profile">
                <CIcon icon={cilUser} className="me-2" />
                Perfil
              </CDropdownItem>
              <CDropdownItem onClick={onRoleRefresh}>
                <CIcon icon={cilContrast} className="me-2" />
                Actualizar permisos
              </CDropdownItem>
              
              {/* REEMPLAZA ESTA LÍNCA: */}
              {/* <CDropdownItem divider /> ← ❌ PROBLEMA */}
              
              {/* CON ESTO: */}
              <CDropdownDivider /> {/* ← ✅ SOLUCIÓN */}
              
              <CDropdownItem onClick={handleLogout}>
                <CIcon icon={cilEnvelopeOpen} className="me-2" />
                Cerrar sesión
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader