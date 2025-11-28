import React, { useState, useEffect } from 'react'
import {
    CContainer,
    CAvatar,
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
    CFormSelect
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeOpen, cilLockLocked, cilClock, cibAddthis } from '@coreui/icons'

export const Users = () => {

    // ---------------------- TOAST ---------------------- //
    const [toasts, setToasts] = useState([])

    const showToast = (type, message) => {
        setToasts((prev) => [...prev, { type, message, id: Date.now() }])
    }

    // ---------------------- MODAL / FORM ---------------------- //
    const [modalVisible, setModalVisible] = useState(false)
    const [editingId, setEditingId] = useState(null) // null => crear, id => editar
    const [user, setUser] = useState(null) // usuario logueado (guardado en localStorage)
    const [usersList, setUsersList] = useState([]) // lista desde json-server
    const API = 'http://localhost:4000/users'

    const emptyForm = {
        dni: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        role: '',
        username: '',
        password: ''
    }
    const [formUser, setFormUser] = useState(emptyForm)

    // CARGA DE USUARIO (logueado) y lista inicial
    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem("user"))
        if (loggedUser) {
            setUser(loggedUser)
        }
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch(API)
            if (!res.ok) throw new Error('Error al cargar usuarios')
            const data = await res.json()
            setUsersList(data)
        } catch (err) {
            showToast('danger', 'No se pudieron cargar los usuarios')
            console.error(err)
        }
    }

    // ABRIR MODAL PARA NUEVO USUARIO
    const handleNew = () => {
        setEditingId(null)
        setFormUser(emptyForm)
        setModalVisible(true)
    }

    // ABRIR MODAL PARA EDITAR
    const handleEdit = (u) => {
        setEditingId(u.id)
        setFormUser({
            dni: u.dni || '',
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            address: u.address || '',
            role: u.role || '',
            username: u.username || '',
            password: '' // no mostrar password original
        })
        setModalVisible(true)
    }

    // GUARDAR (crear o actualizar)
    const handleSave = async (e) => {
        e.preventDefault()
        // validación mínima
        if (!formUser.dni || !formUser.firstName || !formUser.username) {
            showToast('warning', 'Complete DNI, nombre y usuario')
            return
        }
        try {
            if (editingId) {
                // actualizar
                const res = await fetch(`${API}/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formUser)
                })
                if (!res.ok) throw new Error('Error al actualizar')
                const updated = await res.json()
                setUsersList((prev) => prev.map((p) => (p.id === editingId ? updated : p)))
                showToast('success', 'Usuario actualizado correctamente')
            } else {
                // crear
                const res = await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formUser)
                })
                if (!res.ok) throw new Error('Error al crear usuario')
                const created = await res.json()
                setUsersList((prev) => [...prev, created])
                showToast('success', 'Usuario creado correctamente')
            }
            setModalVisible(false)
            setFormUser(emptyForm)
            setEditingId(null)
        } catch (err) {
            showToast('danger', 'Ocurrió un error al guardar')
            console.error(err)
        }
    }

    // ELIMINAR
    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este usuario?')) return
        try {
            const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Error al eliminar')
            setUsersList((prev) => prev.filter((u) => u.id !== id))
            showToast('success', 'Usuario eliminado')
        } catch (err) {
            showToast('danger', 'No se pudo eliminar el usuario')
            console.error(err)
        }
    }

    const updatePassword = () => {
        showToast('success', 'Contraseña actualizada correctamente')
        setModalVisible(false)
    }


    return (
        <>
            <CToaster position="top-end">
                {toasts.map((t) => (
                    <CToast key={t.id} autohide={true} delay={3000}>
                        <CToastHeader closeButton={false}>{t.type}</CToastHeader>
                        <CToastBody>{t.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>

            <div className="table-responsive">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Usuarios</h4>
                    <CButton color="primary" onClick={handleNew}>
                        Nuevo Usuario
                        <CIcon className="ms-2" icon={cibAddthis} />
                    </CButton>
                </div>

                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">DNI</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Address</th>
                            <th scope="col">Role</th>
                            <th scope="col">Username</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="table-group-divider">
                        {usersList.map((u, idx) => (
                            <tr key={u.id || idx}>
                                <th scope="row">{idx + 1}</th>
                                <td>{u.dni}</td>
                                <td>{u.firstName}</td>
                                <td>{u.lastName}</td>
                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.role}</td>
                                <td>{u.username}</td>
                                <td>
                                    <CButton color="primary" size="sm" onClick={() => handleEdit(u)}>Editar</CButton>{' '}
                                    <CButton color="danger" size="sm" onClick={() => handleDelete(u.id)}>Eliminar</CButton>
                                </td>
                            </tr>
                        ))}

                        {/* Si no hay usuarios */}
                        {usersList.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center">No hay usuarios</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader onClose={() => setModalVisible(false)}>
                    <CModalTitle>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSave}>
                        <CFormInput className="mb-2" value={formUser.dni} onChange={(e) => setFormUser({ ...formUser, dni: e.target.value })} placeholder="DNI" />
                        <CFormInput className="mb-2" value={formUser.firstName} onChange={(e) => setFormUser({ ...formUser, firstName: e.target.value })} placeholder="First Name" />
                        <CFormInput className="mb-2" value={formUser.lastName} onChange={(e) => setFormUser({ ...formUser, lastName: e.target.value })} placeholder="Last Name" />
                        <CFormInput className="mb-2" value={formUser.email} onChange={(e) => setFormUser({ ...formUser, email: e.target.value })} placeholder="Email" />
                        <CFormInput className="mb-2" value={formUser.address} onChange={(e) => setFormUser({ ...formUser, address: e.target.value })} placeholder="Address" />
                        <CFormSelect className="mb-2" value={formUser.role} onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}>
                            <option value="">Seleccione rol</option>
                            <option value="Admin">Admin</option>
                            <option value="Empleado">Empleado</option>
                        </CFormSelect>
                        <CFormInput className="mb-2" value={formUser.username} onChange={(e) => setFormUser({ ...formUser, username: e.target.value })} placeholder="Username" />
                        <CFormInput className="mb-3" type="password" value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })} placeholder="Password (dejar vacío si no cambia)" />

                        <div className="d-flex justify-content-end">
                            <CButton color="secondary" onClick={() => setModalVisible(false)} className="me-2">Cancelar</CButton>
                            <CButton color="primary" type="submit">{editingId ? 'Guardar cambios' : 'Crear usuario'}</CButton>
                        </div>
                    </CForm>
                </CModalBody>
            </CModal>
        </>
    )
}

export default Users
