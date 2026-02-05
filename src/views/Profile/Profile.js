/** PERFIL DE USUARIO — DISEÑO ADAPTATIVO 2026 **/
import React, { useState } from 'react'
import {
  CContainer,
  CAvatar,
  CCard,
  CCardBody,
  CFormInput,
  CButton,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CRow,
  CCol,
  CBadge,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilEnvelopeOpen,
  cilLockLocked,
  cilClock,
  cilShieldAlt,
  cilBadge,
} from '@coreui/icons'

export const Porfile = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [toasts, setToasts] = useState([])

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { type, message, id: Date.now() }])
  }

  const updatePassword = () => {
    showToast('success', 'Contraseña actualizada correctamente')
    setModalVisible(false)
  }

  const user = {
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    name: 'Usuario de Ejemplo',
    department: 'Recursos Humanos',
    employeeCode: 'EMP-001',
    role: 'Administrador',
    email: 'usuario@example.com',
    lastLogin: '2026-01-30 14:22',
  }

  return (
    <div className="profile-page-wrapper py-4">
      <CContainer fluid>
        {/* HEADER DE BIENVENIDA */}
        <div className="mb-4 text-center text-md-start">
          <h2 className="fw-bold mb-0 text-color-main">Mi Perfil</h2>
          <p className="text-secondary">Gestiona tu información personal y seguridad de cuenta</p>
        </div>

        <CRow className="gy-4">
          {/* COLUMNA IZQUIERDA: TARJETA DE IDENTIDAD */}
          <CCol lg={4}>
            <CCard className="border-0 shadow-sm rounded-4 bg-card-custom h-100 overflow-hidden">
              <div className="profile-banner-accent" />
              <CCardBody className="pt-0 text-center">
                <div className="avatar-wrapper mb-3">
                  <CAvatar src={user.avatar} size="xl" className="profile-avatar-premium shadow" />
                </div>
                <h4 className="fw-bold text-color-main mb-1">{user.name}</h4>
                <CBadge
                  color="primary"
                  variant="solid"
                  className="px-3 py-2 rounded-pill mb-3 shadow-sm"
                >
                  <CIcon icon={cilBadge} className="me-1" /> {user.role}
                </CBadge>

                <div className="mt-4 p-3 rounded-3 bg-light-subtle text-start">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-secondary">Departamento</span>
                    <span className="small fw-bold text-color-main">{user.department}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-secondary">ID Empleado</span>
                    <span className="small fw-bold text-color-main">{user.employeeCode}</span>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* COLUMNA DERECHA: INFORMACIÓN Y SEGURIDAD */}
          <CCol lg={8}>
            <CRow className="gy-4">
              {/* BLOQUE DE INFORMACIÓN */}
              <CCol xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 bg-card-custom">
                  <CCardBody className="p-4">
                    <h5 className="fw-bold mb-4 d-flex align-items-center text-color-main">
                      <CIcon icon={cilUser} className="me-2 text-info" />
                      Detalles de la Cuenta
                    </h5>
                    <CRow className="gy-3">
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">Nombre Completo</label>
                        <div className="p-2 border-bottom text-color-main">{user.name}</div>
                      </CCol>
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">
                          Correo Corporativo
                        </label>
                        <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                          <CIcon icon={cilEnvelopeOpen} className="me-2 text-success" />{' '}
                          {user.email}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">Última Conexión</label>
                        <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                          <CIcon icon={cilClock} className="me-2 text-warning" /> {user.lastLogin}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">Nivel de Acceso</label>
                        <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                          <CIcon icon={cilShieldAlt} className="me-2 text-primary" /> Permisos
                          Totales
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* BLOQUE DE SEGURIDAD */}
              <CCol xs={12}>
                <CCard className="border-0 shadow-sm rounded-4 bg-card-custom border-start-warning">
                  <CCardBody className="p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div>
                      <h5 className="fw-bold mb-1 text-color-main">Seguridad de la Cuenta</h5>
                      <p className="small text-secondary mb-0">
                        Se recomienda cambiar la contraseña periódicamente.
                      </p>
                    </div>
                    <CButton
                      color="warning"
                      variant="outline"
                      className="px-4 py-2 fw-bold rounded-3"
                      onClick={() => setModalVisible(true)}
                    >
                      <CIcon icon={cilLockLocked} className="me-2" /> Actualizar Contraseña
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>

      {/* COMPONENTES DE INTERACCIÓN */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast
            key={t.id}
            autohide
            delay={2500}
            color={t.type}
            visible
            className="border-0 shadow-lg"
          >
            <CToastHeader closeButton className="bg-transparent border-0">
              <strong className="me-auto text-white">Notificación</strong>
            </CToastHeader>
            <CToastBody className="text-white">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <CModal
        backdrop="static"
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        className="modal-premium"
      >
        <CModalHeader className="border-0 pb-0">
          <CModalTitle className="fw-bold">
            <CIcon icon={cilLockLocked} className="me-2 text-warning" /> Seguridad
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="password"
                label="Contraseña Actual"
                className="bg-light-subtle py-2"
              />
            </div>
            <div className="mb-4">
              <CFormInput
                type="password"
                label="Nueva Contraseña"
                className="bg-light-subtle py-2"
              />
            </div>
            <div className="d-grid">
              <CButton color="primary" className="py-2 fw-bold rounded-3" onClick={updatePassword}>
                Guardar Nueva Contraseña
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      {/* ESTILOS DINÁMICOS */}
      <style jsx>{`
        /* VARIABLES BASE */
        .bg-card-custom {
          background: #ffffff;
          transition: all 0.3s ease;
        }
        .text-color-main {
          color: #2d3748;
        }
        .bg-light-subtle {
          background: #f8f9fa;
        }
        .border-start-warning {
          border-left: 4px solid #f9b115 !important;
        }

        /* MODO OSCURO */
        [data-coreui-theme='dark'] .bg-card-custom {
          background: #1e2128 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme='dark'] .text-color-main {
          color: #f8f9fa;
        }
        [data-coreui-theme='dark'] .bg-light-subtle {
          background: rgba(255, 255, 255, 0.03) !important;
        }
        [data-coreui-theme='dark'] .border-bottom {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        /* ELEMENTOS PREMIUM */
        .profile-banner-accent {
          height: 80px;
          background: linear-gradient(135deg, #4b79ff 0%, #00d2ff 100%);
        }
        .avatar-wrapper {
          margin-top: -50px;
        }
        .profile-avatar-premium {
          width: 100px;
          height: 100px;
          border: 4px solid #fff;
        }
        [data-coreui-theme='dark'] .profile-avatar-premium {
          border-color: #1e2128;
        }

        .profile-page-wrapper {
          min-height: 100vh;
        }
      `}</style>
    </div>
  )
}

export default Porfile
