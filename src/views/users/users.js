    import React, { useState, useEffect } from 'react'
    import {
    CContainer, CAvatar, CCard, CCardBody, CFormInput,
    CButton, CCardHeader, CToaster, CToast, CToastBody,
    CToastHeader, CModal, CModalHeader,
    CModalTitle, CForm
    } from '@coreui/react'
    import CIcon from '@coreui/icons-react'
    import { cilUser, cilEnvelopeOpen, cilLockLocked, cilClock } from '@coreui/icons'

    export const Users = () => {

    const API = 'http://localhost:5000/users'
    const [user, setUser] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)
    const [toasts, setToasts] = useState([])

    const showToast = (type, message) => {
        setToasts((prev) => [...prev, { type, message, id: Date.now() }])
    }

    // CARGA DE USUARIO
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("user"))
        if (loggedUser) {
        setUser(loggedUser)
        }
    }, [])

    const updatePassword = () => {
        showToast('success', 'Contraseña actualizada correctamente')
        setModalVisible(false)
    }

    if (!user) {
        return <p className="text-center mt-5">Cargando información...</p>
    }

    return (
        <>

        {/* BIENVENIDA */}
        <div className="d-flex justify-content-center align-items-center mt-4">
            <CCard className="shadow-sm border-0 px-4 py-3 text-center" style={{ maxWidth: 400 }}>
            <h5 className="fw-bold mb-1">Bienvenido</h5>
            <p className="text-primary fw-semibold fs-5">{user.name}</p>
            </CCard>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <CContainer fluid className="mt-4">
            <div className="row g-4 justify-content-center">

            {/* PERFIL */}
            <div className="col-md-4 col-lg-3">
                <CCard className="shadow-lg border-0 text-center rounded-4">
                <CCardHeader className="bg-dark text-white fw-semibold rounded-top-4 py-3">
                    <CIcon icon={cilUser} className="me-2" />
                    Perfil
                </CCardHeader>
                <CCardBody className="pt-4">
                    <CAvatar size="xl" src={user.avatar} className="mb-3 shadow" />
                    <h4 className="fw-bold mb-1">{user.name}</h4>
                    <p className="text-muted mb-0">{user.email}</p>
                    <span className="badge bg-secondary mt-2 px-3 py-2 fs-6 text-uppercase">
                    {user.role}
                    </span>
                </CCardBody>
                </CCard>
            </div>

            {/* DATOS DEL USUARIO */}
            <div className="col-md-6 col-lg-5">
                <CCard className="shadow-sm rounded-4 border-light">
                <CCardHeader className="bg-primary text-white fw-semibold rounded-top-4">
                    <CIcon icon={cilUser} className="me-2" />
                    Información del Usuario
                </CCardHeader>

                <CCardBody className="pt-3 fs-6">
                    <div className="d-flex align-items-center mb-3">
                    <CIcon icon={cilUser} className="me-3 text-primary fs-4" />
                    <p className="m-0"><strong>Nombre:</strong> {user.name}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                    <CIcon icon={cilEnvelopeOpen} className="me-3 text-success fs-4" />
                    <p className="m-0"><strong>Email:</strong> {user.email}</p>
                    </div>
                    <div className="d-flex align-items-center">
                    <CIcon icon={cilClock} className="me-3 text-warning fs-4" />
                    <p className="m-0"><strong>Último acceso:</strong> {user.lastLogin}</p>
                    </div>
                </CCardBody>
                </CCard>
            </div>

            {/* ACCIONES */}
            <div className="col-md-4 col-lg-3">

                {/* Seguridad */}
                <CCard className="shadow border-0 text-center rounded-4 mb-3">
                <CCardHeader className="bg-warning text-dark fw-semibold rounded-top-4">
                    <CIcon icon={cilLockLocked} className="me-2" />
                    Seguridad
                </CCardHeader>

                <CCardBody>
                    <p className="text-muted mb-3">
                    Cambia tu contraseña regularmente para mantener tu cuenta segura.
                    </p>

                    <CButton
                    color="warning"
                    className="w-100 fw-bold text-dark shadow-sm"
                    onClick={() => setModalVisible(true)}
                    >
                    Cambiar Contraseña
                    </CButton>
                </CCardBody>
                </CCard>

                {/* OPCIONES POR ROL */}
                {user.role === "admin" && (
                <CCard className="shadow border-0 text-center rounded-4">
                    <CCardHeader className="bg-danger text-white rounded-top-4">
                    Panel de Administrador
                    </CCardHeader>
                    <CCardBody>
                    <p>Gestionar usuarios, reportes, inventarios...</p>
                    </CCardBody>
                </CCard>
                )}

                {user.role === "employee" && (
                <CCard className="shadow border-0 text-center rounded-4">
                    <CCardHeader className="bg-info text-white rounded-top-4">
                    Panel de Empleado
                    </CCardHeader>
                    <CCardBody>
                    <p>Registrar ventas, ver pedidos, editar perfil...</p>
                    </CCardBody>
                </CCard>
                )}

            </div>
            </div>
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
                <CToastBody>¡Operación realizada con éxito!</CToastBody>
            </CToast>
            ))}
        </CToaster>

        {/* MODAL */}
        <CModal
            size="lg"
            visible={modalVisible}
            onClose={() => setModalVisble(false)}
            className="rounded-4"
        >
            <CModalHeader className="rounded-top-4">
            <CModalTitle>
                <CIcon icon={cilLockLocked} className="me-2" />
                Cambiar Contraseña
            </CModalTitle>
            </CModalHeader>

            <CModalBody>
            <CForm>
                <CFormInput
                className="mb-3"
                type="password"
                placeholder="Contraseña Actual"
                label="Contraseña Actual"
                />
                <CFormInput
                className="mb-3"
                type="password"
                placeholder="Nueva Contraseña"
                label="Nueva Contraseña"
                />
                <CButton color="success" onClick={updatePassword} className="mt-2 w-100 fw-semibold">
                Guardar Cambios
                </CButton>
            </CForm>
            </CModalBody>
        </CModal>

        </>
    )
    }

    export default Users
