import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilContrast, cilEnvelopeOpen, cilMenu, cilMoon, cilSun } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  // Definimos colores dinámicos basados en el tema
  const isDark = colorMode === 'dark'

  const headerStyle = {
    backgroundColor: isDark ? '#000430' : '#ffffff',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0 border-0" ref={headerRef} style={headerStyle}>
      <CContainer className="px-4" fluid style={{ height: '64px' }}>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px', color: isDark ? '#fff' : '#000' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="ms-auto align-items-center">
          {/* Notificaciones */}
          <CNavItem>
            <CNavLink href="#" className="py-0">
              <CIcon
                icon={cilBell}
                size="lg"
                style={{ color: isDark ? 'rgb(255, 255, 255)' : '#000' }}
              />
            </CNavLink>
          </CNavItem>

          <div
            className={`vr mx-3 ${isDark ? 'text-white' : 'text-dark'} opacity-25`}
            style={{ height: '20px' }}
          ></div>

          {/* Selector de Tema */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} className="py-0 border-0 bg-transparent">
              {isDark ? (
                <CIcon icon={cilMoon} size="lg" style={{ color: '#58cc7d' }} /> // Verde del logo
              ) : (
                <CIcon icon={cilSun} size="lg" style={{ color: '#002d72' }} /> // Azul del logo
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem active={colorMode === 'light'} onClick={() => setColorMode('light')}>
                <CIcon className="me-2" icon={cilSun} /> Light
              </CDropdownItem>
              <CDropdownItem active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
                <CIcon className="me-2" icon={cilMoon} /> Dark
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <div
            className={`vr mx-3 ${isDark ? 'text-white' : 'text-dark'} opacity-25`}
            style={{ height: '20px' }}
          ></div>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      {/* Línea divisoria y Breadcrumbs */}
      <CContainer
        className={`px-4 border-top ${isDark ? 'border-light border-opacity-10' : 'border-dark border-opacity-10'} py-2`}
        fluid
      >
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
