import React, { useState } from 'react'
import {
  CContainer,
  CAvatar,
  CCard,
  CCardBody,
  CFormInput,
  CButton,
  CCardHeader,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeOpen, cilLockLocked, cilClock } from '@coreui/icons'

// =============================
// USERS PANEL – ADMIN VERSION
// =============================

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
    <>
      <CContainer fluid className="mt-4 d-flex justify-content-center">
        <CCard
          className="shadow-lg border-0 p-4"
          style={{
            borderRadius: 22,
            maxWidth: 1200,
            width: '100%',
            background: 'rgba(10,15,35,0.65)',
            backdropFilter: 'blur(18px)',
            boxShadow: '0 0 35px rgba(0,0,0,0.55)',
          }}
        >
          <CCardHeader className="border-0 mb-3 text-white">
            <h3 className="fw-bold mb-1 text-center">Perfil</h3>
            <p className="text-center opacity-75 m-0" style={{ fontSize: '0.9rem' }}></p>
          </CCardHeader>

          <CCardBody>
            <div className="row g-4 align-items-start">
              {/* Panel izquierdo - Perfil */}
              <div className="col-md-4 text-center">
                <div
                  style={{
                    width: 200,
                    height: 200,
                    margin: '0 auto 20px auto',
                    borderRadius: '50%',
                    padding: 8,
                    background: 'linear-gradient(135deg, #4bffb470, #2e8f21ff, #4bff81ff)',
                    boxShadow:
                      '0 0 30px rgba(80, 255, 138, 0.77), 0 0 45px rgba(86, 255, 80, 0.35)',
                  }}
                >
                  <CAvatar
                    src={user.avatar}
                    style={{ width: '100%', height: '100%' }}
                    className="shadow-lg"
                  />
                </div>

                <h3 className="fw-bold text-white mb-1">{user.name}</h3>
                <p className="text-light opacity-75 mb-1">{user.department}</p>
                <p className="text-light opacity-75">
                  Código de empleado: <strong>{user.employeeCode}</strong>
                </p>

                <span
                  className="px-4 py-2 fw-semibold d-inline-block"
                  style={{
                    background: '#4b79ff',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 14px rgba(80,110,255,0.35)',
                  }}
                >
                  {user.role}
                </span>
              </div>

              {/* Panel central - Información */}
              <div className="col-md-5 text-white">
                <h5 className="fw-bold mb-3">
                  <CIcon icon={cilUser} className="me-2 text-primary" />
                  Información del Usuario
                </h5>

                <p className="mb-3">
                  <CIcon icon={cilUser} className="me-2 text-info" />
                  <strong>Nombre Completo:</strong> {user.name}
                </p>

                <p className="mb-3">
                  <CIcon icon={cilEnvelopeOpen} className="me-2 text-success" />
                  <strong>Correo Corporativo:</strong> {user.email}
                </p>

                <p className="mb-3">
                  <CIcon icon={cilClock} className="me-2 text-warning" />
                  <strong>Último acceso:</strong> {user.lastLogin}
                </p>

                <p className="mb-3">
                  <CIcon icon={cilUser} className="me-2 text-primary" />
                  <strong>Departamento:</strong> {user.department}
                </p>

                <p>
                  <CIcon icon={cilUser} className="me-2 text-danger" />
                  <strong>Código de Empleado:</strong> {user.employeeCode}
                </p>
              </div>

              {/* Panel derecho - Seguridad */}
              <div className="col-md-3 text-white">
                <h5 className="fw-bold mb-3">
                  <CIcon icon={cilLockLocked} className="me-2 text-warning" />
                  Seguridad
                </h5>

                <p className="text-light opacity-75 mb-4" style={{ fontSize: '0.9rem' }}>
                  Configuraciones relacionadas con la seguridad del trabajador.
                </p>

                <CButton
                  color="warning"
                  className="w-100 fw-bold text-dark shadow-sm"
                  style={{ borderRadius: 14 }}
                  onClick={() => setModalVisible(true)}
                >
                  Cambiar Contraseña
                </CButton>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CContainer>

      {/* TOASTS */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast
            key={t.id}
            autohide
            delay={2500}
            color={t.type}
            visible
            className="rounded-3 shadow"
          >
            <CToastHeader closeButton>
              <strong className="me-auto">{t.message}</strong>
            </CToastHeader>
            <CToastBody>Operación realizada con éxito.</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* MODAL */}
      <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            <CIcon icon={cilLockLocked} className="me-2" /> Cambiar Contraseña
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              className="mb-3"
              type="password"
              label="Contraseña Actual"
              placeholder="Ingrese su contraseña actual"
            />

            <CFormInput
              className="mb-3"
              type="password"
              label="Nueva Contraseña"
              placeholder="Ingrese su nueva contraseña"
            />

            <CButton color="success" onClick={updatePassword}>
              Guardar Cambios
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Porfile
