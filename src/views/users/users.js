  // components/Users.js - VERSIÓN CORREGIDA CON fetchUsers MEJORADA
  import React, { useState, useEffect } from 'react'
  import {
    CContainer,
    CAvatar,
    CButton,
    CToaster,
    CToast,
    CToastBody,
    CToastHeader,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CForm,
    CFormInput,
    CFormSelect,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CBadge,
    CRow,
    CCol,
    CInputGroup,
    CInputGroupText,
    CSpinner,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { 
    cilPencil, 
    cilTrash, 
    cilCheckCircle, 
    cilXCircle, 
    cilUserFollow, 
    cilSearch,
    cilWarning
  } from '@coreui/icons'

  import {
    getUsersRequest,
    createUserRequest,
    deleteUserRequest,
    updateUserRequest,
    patchUserRequest,
    reactivateUserRequest,
  } from '../../api/users.api.js'

  export const Users = () => {
    // --- LÓGICA DE TEMA ---
    const verdeVA = '#58cc7d'
    const azulVA = '#002d72'
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
      const checkTheme = () => {
        const theme = document.documentElement.getAttribute('data-coreui-theme')
        setIsDarkMode(theme === 'dark')
      }
      checkTheme()
      const observer = new MutationObserver(checkTheme)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-coreui-theme'],
      })
      return () => observer.disconnect()
    }, [])

    const colors = {
      bodyBg: isDarkMode ? '#1d222b' : '#f3f4f7',
      cardBg: isDarkMode ? '#212631' : '#ffffff',
      text: isDarkMode ? '#ffffff' : azulVA,
      subText: isDarkMode ? '#a0a0a0' : '#4f5d73',
      border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,45,114,0.1)',
      tableHead: isDarkMode ? '#2d333f' : '#ebedef',
    }

    // --- ESTADOS ---
    const [toasts, setToasts] = useState([])
    const [usersList, setUsersList] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [statusModal, setStatusModal] = useState({
      visible: false,
      userId: null,
      currentStatus: '',
      userName: ''
    })
    const [deleteModal, setDeleteModal] = useState({ 
      visible: false, 
      userId: null,
      userName: ''
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const emptyForm = {
      id_role: '',
      dni: '',
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      user_name: '',
      password: '',
      status: true,
    }
    const [formUser, setFormUser] = useState(emptyForm)

    const showToast = (type, message) =>
      setToasts((prev) => [...prev, { type, message, id: Date.now() }])

    // --- EFECTOS ---
    useEffect(() => {
      fetchUsers()
    }, [])

    useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredUsers(usersList)
      } else {
        const term = searchTerm.toLowerCase()
        const filtered = usersList.filter(user => {
          return (
            (user.dni && user.dni.toLowerCase().includes(term)) ||
            (user.first_name && user.first_name.toLowerCase().includes(term)) ||
            (user.last_name && user.last_name.toLowerCase().includes(term)) ||
            (user.email && user.email.toLowerCase().includes(term)) ||
            (user.user_name && user.user_name.toLowerCase().includes(term))
          )
        })
        setFilteredUsers(filtered)
      }
    }, [searchTerm, usersList])

    // --- FUNCIONES PRINCIPALES ---
    const fetchUsers = async () => {
      try {
        setLoading(true)
        console.log('🔄 fetchUsers - Iniciando...')
        
        const res = await getUsersRequest()
        console.log('📦 fetchUsers - Respuesta de API:', res)
        
        if (res.success && res.data) {
          console.log(`🔍 fetchUsers - ${res.data.length} usuarios recibidos`)
          
          // Procesar cada usuario con DEPURACIÓN COMPLETA
          const processedUsers = res.data.map((user, index) => {
            console.log(`👤 DEPURACIÓN Usuario ${index} (ID: ${user.id}):`, {
              id: user.id,
              status: user.status,
              is_active: user.is_active,
              rawStatus: JSON.stringify(user.status),
              rawIsActive: JSON.stringify(user.is_active),
              userType: typeof user.status,
              isActiveType: typeof user.is_active
            })
            
            // LÓGICA MEJORADA PARA DETERMINAR ESTADO
            let isActive = true
            
            // 1. Verificar campo status (string, boolean o número)
            if (user.status !== undefined && user.status !== null) {
              if (typeof user.status === 'string') {
                const statusLower = user.status.toLowerCase()
                isActive = statusLower === 'activo' || 
                          statusLower === 'active' || 
                          statusLower === 'true' ||
                          statusLower === '1'
              } else if (typeof user.status === 'boolean') {
                isActive = user.status
              } else if (typeof user.status === 'number') {
                isActive = user.status === 1
              }
              console.log(`   📊 Estado por 'status' (${user.status}): ${isActive}`)
            }
            
            // 2. Verificar campo is_active si existe
            else if (user.is_active !== undefined && user.is_active !== null) {
              if (typeof user.is_active === 'string') {
                const activeLower = user.is_active.toLowerCase()
                isActive = activeLower === 'true' || activeLower === '1'
              } else if (typeof user.is_active === 'boolean') {
                isActive = user.is_active
              } else if (typeof user.is_active === 'number') {
                isActive = user.is_active === 1
              }
              console.log(`   📊 Estado por 'is_active' (${user.is_active}): ${isActive}`)
            }
            
            // 3. Si no hay información, verificar otros campos
            else {
              // Buscar cualquier campo que indique estado
              const userStr = JSON.stringify(user).toLowerCase()
              if (userStr.includes('inactivo') || userStr.includes('inactive') || userStr.includes('false') || userStr.includes('0')) {
                isActive = false
                console.log(`   📊 Estado por búsqueda de texto: INACTIVO`)
              } else if (userStr.includes('activo') || userStr.includes('active') || userStr.includes('true') || userStr.includes('1')) {
                isActive = true
                console.log(`   📊 Estado por búsqueda de texto: ACTIVO`)
              }
            }
            
            console.log(`✅ Usuario ${user.id} - Estado final: ${isActive ? 'ACTIVO' : 'INACTIVO'}`)
            
            return {
              ...user,
              // Campos normalizados
              id_user: user.id_user || user.id,
              first_name: user.first_name || user.nombre || '',
              last_name: user.last_name || user.apellido || '',
              status: isActive ? 'activo' : 'inactivo',
              is_active: isActive
            }
          })
          
          // Verificar si hay usuarios inactivos
          const inactiveUsers = processedUsers.filter(u => !u.is_active)
          console.log(`📊 TOTAL Usuarios inactivos encontrados: ${inactiveUsers.length}`)
          
          // Mostrar IDs de usuarios inactivos
          if (inactiveUsers.length > 0) {
            console.log('📋 IDs de usuarios inactivos:', inactiveUsers.map(u => u.id))
          }
          
          setUsersList(processedUsers)
          setFilteredUsers(processedUsers)
        } else {
          console.error('❌ fetchUsers - Respuesta inválida:', res)
          setUsersList([])
          setFilteredUsers([])
        }
      } catch (err) {
        console.error('❌ fetchUsers - Error:', err)
        showToast('danger', 'Error al cargar usuarios: ' + err.message)
        setUsersList([])
        setFilteredUsers([])
      } finally {
        setLoading(false)
      }
    }

    const confirmDelete = async () => {
      try {
        setSaving(true)
        
        // Primero intenta eliminar físicamente
        await deleteUserRequest(deleteModal.userId)
        showToast('success', 'Usuario eliminado exitosamente')
        fetchUsers()
        
      } catch (err) {
        console.error('Error deleting user:', err)
        
        // Si hay error de llave foránea, desactiva en lugar de eliminar
        if (err.message.includes('viola la llave foránea') || 
            err.message.includes('Server error')) {
          
          try {
            // Intenta desactivar el usuario
            await patchUserRequest(deleteModal.userId, { status: false })
            showToast('warning', 'Usuario desactivado (tenía pedidos asociados, no se pudo eliminar)')
            fetchUsers()
            
          } catch (deactivateError) {
            console.error('Error desactivando usuario:', deactivateError)
            showToast('danger', 'Error: No se pudo eliminar ni desactivar el usuario')
          }
          
        } else {
          // Otro tipo de error
          showToast('danger', 'Error al eliminar usuario: ' + (err.message || 'Intente nuevamente'))
        }
        
      } finally {
        setSaving(false)
        setDeleteModal({ visible: false, userId: null, userName: '' })
      }
    }

    // FUNCIÓN MEJORADA PARA CAMBIAR ESTADO
    const handleConfirmStatus = async () => {
      const { userId, currentStatus } = statusModal
      try {
        setSaving(true)
        
        // Mostrar en consola lo que se está haciendo
        console.log(`🔄 Cambiando estado del usuario ${userId} de ${currentStatus} a ${currentStatus === 'active' ? 'inactive' : 'active'}`)
        
        if (currentStatus === 'active') {
          // Desactivar usuario
          await patchUserRequest(userId, { status: false })
          showToast('success', 'Usuario desactivado correctamente')
        } else {
          // Reactivar usuario
          await reactivateUserRequest(userId)
          showToast('success', 'Usuario reactivado correctamente')
        }
        
        // Forzar un refresh inmediato de la lista con un pequeño delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Limpiar cache del localStorage si existe
        localStorage.removeItem('usersCache')
        
        // Recargar lista de usuarios
        await fetchUsers()
        
        // Verificar si el cambio se reflejó
        console.log(`✅ Estado del usuario ${userId} actualizado. Recargando lista...`)
        
      } catch (err) {
        console.error('Error changing status:', err)
        showToast('danger', 'Error al cambiar estado: ' + (err.message || 'Intente nuevamente'))
      } finally {
        setSaving(false)
        setStatusModal({ visible: false, userId: null, currentStatus: '', userName: '' })
      }
    }

    const handleSave = async (e) => {
      e.preventDefault()
      try {
        setSaving(true)
        
        // Preparar datos para enviar
        const dataToSend = { ...formUser }
        
        // Validaciones básicas
        if (!dataToSend.dni || !dataToSend.first_name || !dataToSend.last_name || !dataToSend.email) {
          showToast('danger', 'Por favor complete todos los campos requeridos')
          setSaving(false)
          return
        }
        
        if (!editingId && !dataToSend.password) {
          showToast('danger', 'La contraseña es requerida para nuevos usuarios')
          setSaving(false)
          return
        }
        
        if (dataToSend.password && dataToSend.password.length < 6) {
          showToast('danger', 'La contraseña debe tener al menos 6 caracteres')
          setSaving(false)
          return
        }
        
        // Si es edición y no hay password, eliminar el campo
        if (editingId && (!dataToSend.password || dataToSend.password === '')) {
          delete dataToSend.password
        }
        
        // Convertir id_role a número
        dataToSend.id_role = parseInt(dataToSend.id_role) || dataToSend.id_role
        
        if (editingId) {
          // Actualizar usuario
          await updateUserRequest(editingId, dataToSend)
          showToast('success', 'Usuario actualizado correctamente')
        } else {
          // Crear nuevo usuario
          await createUserRequest(dataToSend)
          showToast('success', 'Usuario creado correctamente')
        }
        
        setModalVisible(false)
        setFormUser(emptyForm)
        fetchUsers()
      } catch (err) {
        console.error('Error saving user:', err)
        showToast('danger', 'Error al guardar: ' + (err.message || 'Verifique los datos e intente nuevamente'))
      } finally {
        setSaving(false)
      }
    }

    // FUNCIÓN MEJORADA PARA DETERMINAR SI UN USUARIO ESTÁ ACTIVO
    const isUserActive = (user) => {
      // Verificar primero el campo procesado is_active
      if (user.is_active !== undefined) {
        return user.is_active
      }
      
      // Si no, verificar el campo status procesado
      if (user.status !== undefined) {
        const status = typeof user.status === 'string' ? user.status.toLowerCase() : user.status
        return status === 'activo' || status === 'active' || status === true || status === 1
      }
      
      // Por último, verificar campos del objeto original si existen
      const rawStatus = user.status
      const rawIsActive = user.is_active
      
      if (rawStatus !== undefined && rawStatus !== null) {
        const status = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : rawStatus
        return status === 'activo' || status === 'active' || status === true || status === 1
      }
      
      if (rawIsActive !== undefined && rawIsActive !== null) {
        if (typeof rawIsActive === 'string') {
          return rawIsActive.toLowerCase() === 'true' || rawIsActive === '1'
        }
        return rawIsActive === true || rawIsActive === 1
      }
      
      // Por defecto, asumir activo
      console.warn(`⚠️ Usuario ${user.id} sin estado claro, asumiendo activo`)
      return true
    }

    // --- RENDERIZADO ---
    return (
      <CContainer fluid className="px-4 pb-4">
        <style>
          {`
            .main-card-users {
              background: ${colors.cardBg} !important;
              border-radius: 20px !important;
              border: 1px solid ${colors.border} !important;
              box-shadow: ${isDarkMode ? 'none' : '0 4px 20px rgba(0, 45, 114, 0.05)'} !important;
              color: ${colors.text} !important;
              min-height: 500px;
            }
            .custom-table thead th {
              background-color: ${colors.tableHead} !important;
              color: ${colors.text} !important;
              border: none !important;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
            }
            .custom-table td {
              color: ${isDarkMode ? '#d0d0d0' : '#4f5d73'} !important;
              border-bottom: 1px solid ${colors.border} !important;
              vertical-align: middle;
            }
            .modal-content-va {
              background-color: ${colors.cardBg} !important;
              color: ${colors.text} !important;
              border: 1px solid ${colors.border} !important;
              border-radius: 10px !important;
            }
            .form-label { 
              color: ${colors.subText} !important; 
              font-weight: 600; 
              font-size: 0.875rem;
            }
            .form-control, .form-select {
              background-color: ${isDarkMode ? '#2d333f' : '#ffffff'} !important;
              border-color: ${colors.border} !important;
              color: ${colors.text} !important;
              border-radius: 8px !important;
            }
            .form-control:focus, .form-select:focus {
              border-color: ${verdeVA} !important;
              box-shadow: 0 0 0 0.2rem ${verdeVA}40 !important;
            }
            .search-input {
              border-top-right-radius: 20px !important;
              border-bottom-right-radius: 20px !important;
            }
            .search-icon {
              border-top-left-radius: 20px !important;
              border-bottom-left-radius: 20px !important;
              background-color: ${colors.tableHead} !important;
              border-color: ${colors.border} !important;
            }
            .cursor-pointer { cursor: pointer; }
            .action-btn {
              transition: all 0.2s ease;
            }
            .action-btn:hover {
              transform: scale(1.1);
            }
          `}
        </style>

        {/* TOASTS */}
        <CToaster position="top-end">
          {toasts.map((t) => (
            <CToast
              key={t.id}
              autohide
              delay={4000}
              color={t.type === 'success' ? 'success' : 'danger'}
              className="text-white"
              onClose={() => setToasts(toasts.filter(toast => toast.id !== t.id))}
            >
              <CToastHeader closeButton>
                <strong className="me-auto">
                  {t.type === 'success' ? '✅ Éxito' : '❌ Error'}
                </strong>
              </CToastHeader>
              <CToastBody>{t.message}</CToastBody>
            </CToast>
          ))}
        </CToaster>

        {/* CONTENIDO PRINCIPAL */}
        <div className="main-card-users p-4">
          {/* HEADER */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: colors.text }}>
                Gestión de <span style={{ color: verdeVA }}>Usuarios</span>
              </h3>
              <p className="small mb-0" style={{ color: colors.subText }}>
                Administre los usuarios del sistema. Total: {filteredUsers.length}
              </p>
            </div>
            
            <div className="d-flex flex-column flex-md-row gap-3 w-100 w-md-auto">
              {/* BUSCADOR */}
              <CInputGroup style={{ minWidth: '300px' }}>
                <CInputGroupText className="search-icon">
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar por cédula, nombre, email..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    backgroundColor: colors.cardBg, 
                    borderColor: colors.border, 
                    color: colors.text 
                  }}
                />
              </CInputGroup>
              
              {/* BOTÓN NUEVO */}
              <CButton
                style={{ 
                  backgroundColor: azulVA, 
                  borderColor: azulVA,
                  whiteSpace: 'nowrap'
                }}
                className="text-white px-4 py-2 rounded-pill shadow-sm fw-semibold"
                onClick={() => {
                  setEditingId(null)
                  setFormUser(emptyForm)
                  setModalVisible(true)
                }}
              >
                <CIcon icon={cilUserFollow} className="me-2" /> Nuevo Usuario
              </CButton>
            </div>
          </div>

          {/* TABLA */}
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3" style={{ color: colors.subText }}>Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <CIcon icon={cilUserFollow} size="xxl" style={{ color: colors.subText, opacity: 0.5 }} />
              <p className="mt-3" style={{ color: colors.subText }}>
                {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
              </p>
              {searchTerm && (
                <CButton
                  color="secondary"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar búsqueda
                </CButton>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <CTable align="middle" className="custom-table mb-0" hover responsive bordered={false}>
                <CTableHead>
                  <CTableRow className="text-nowrap">
                    <CTableHeaderCell className="ps-4">ID</CTableHeaderCell>
                    <CTableHeaderCell>CÉDULA</CTableHeaderCell>
                    <CTableHeaderCell>USUARIO / CORREO</CTableHeaderCell>
                    <CTableHeaderCell>DIRECCIÓN</CTableHeaderCell>
                    <CTableHeaderCell>FECHA REGISTRO</CTableHeaderCell>
                    <CTableHeaderCell>ROL</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">ESTADO</CTableHeaderCell>
                    <CTableHeaderCell className="text-center pe-4">ACCIONES</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredUsers.map((u, index) => {
                    const userId = u.id_user || u.id || `temp-${index}`
                    const isActive = isUserActive(u)
                    const userName = `${u.first_name || ''} ${u.last_name || ''}`.trim()
                    const userEmail = u.email || u.user_name || ''
                    
                    return (
                      <CTableRow key={`user-${userId}-${index}`} className="text-nowrap">
                        <CTableDataCell className="ps-4 fw-bold" style={{ color: azulVA }}>
                          #{userId}
                        </CTableDataCell>
                        <CTableDataCell className="fw-medium">
                          {u.dni || '---'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CAvatar
                              color={isActive ? 'primary' : 'secondary'}
                              size="sm"
                              className="me-2 text-white fw-bold"
                            >
                              {u.first_name?.charAt(0)?.toUpperCase() || 'U'}
                            </CAvatar>
                            <div>
                              <div
                                className="fw-bold text-capitalize"
                                style={{ fontSize: '0.9rem', color: colors.text }}
                              >
                                {userName || '---'}
                              </div>
                              <div className="small" style={{ color: colors.subText }}>
                                {userEmail}
                              </div>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small text-truncate" style={{ maxWidth: '150px' }}>
                            {u.address || '---'}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="small">
                          {u.register_creation || u.created_at
                            ? new Date(u.register_creation || u.created_at).toLocaleDateString('es-ES')
                            : '---'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge 
                            color={u.id_role === 1 ? 'danger' : u.id_role === 2 ? 'warning' : 'info'} 
                            className="fw-semibold"
                          >
                            {u.id_role === 1 ? 'Admin' : u.id_role === 2 ? 'Empleado' : u.id_role === 3 ? 'Cliente' : 'Usuario'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div
                            className="cursor-pointer d-inline-block"
                            onClick={() =>
                              setStatusModal({
                                visible: true,
                                userId,
                                currentStatus: isActive ? 'active' : 'inactive',
                                userName
                              })
                            }
                          >
                            <CBadge
                              color={isActive ? 'success' : 'danger'}
                              shape="rounded-pill"
                              className={`px-3 py-2 ${isActive ? 'text-white' : ''} fw-semibold`}
                            >
                              <CIcon icon={isActive ? cilCheckCircle : cilXCircle} className="me-1" />
                              {isActive ? 'ACTIVO' : 'INACTIVO'}
                            </CBadge>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center pe-4">
                          <div className="d-flex justify-content-center gap-2">
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              className="action-btn"
                              onClick={() => {
                                setEditingId(userId)
                                setFormUser({
                                  id_role: u.id_role || '',
                                  dni: u.dni || '',
                                  first_name: u.first_name || '',
                                  last_name: u.last_name || '',
                                  email: u.email || '',
                                  address: u.address || '',
                                  user_name: u.user_name || u.username || '',
                                  password: '', // No enviar password actual
                                  status: isActive
                                })
                                setModalVisible(true)
                              }}
                              title="Editar usuario"
                            >
                              <CIcon
                                icon={cilPencil}
                                size="lg"
                                style={{ color: isDarkMode ? '#00d4ff' : azulVA }}
                              />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              className="action-btn"
                              onClick={() => setDeleteModal({ 
                                visible: true, 
                                userId,
                                userName 
                              })}
                              title="Eliminar usuario"
                            >
                              <CIcon icon={cilTrash} size="lg" />
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </div>
          )}
        </div>

        {/* MODAL EDITAR/NUEVO USUARIO */}
        <CModal
          size="lg"
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
            setFormUser(emptyForm)
          }}
          backdrop="static"
          className="va-modal"
        >
          <CModalHeader style={{ backgroundColor: azulVA }} className="text-white border-0">
            <CModalTitle className="fw-bold">
              {editingId ? '✏️ Editar Usuario' : '👤 Nuevo Usuario'}
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="modal-content-va p-4">
            <CForm onSubmit={handleSave}>
              <CRow className="g-3">
                <CCol md={4}>
                  <CFormInput
                    label="Cédula *"
                    value={formUser.dni}
                    onChange={(e) => setFormUser({ ...formUser, dni: e.target.value })}
                    required
                    placeholder="Ej: 1234567890"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label="Nombres *"
                    value={formUser.first_name}
                    onChange={(e) => setFormUser({ ...formUser, first_name: e.target.value })}
                    required
                    placeholder="Ej: Juan"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label="Apellidos *"
                    value={formUser.last_name}
                    onChange={(e) => setFormUser({ ...formUser, last_name: e.target.value })}
                    required
                    placeholder="Ej: Pérez"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Email *"
                    type="email"
                    value={formUser.email}
                    onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                    required
                    placeholder="Ej: juan@empresa.com"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Dirección"
                    value={formUser.address}
                    onChange={(e) => setFormUser({ ...formUser, address: e.target.value })}
                    placeholder="Ej: Calle Principal 123"
                  />
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    label="Rol *"
                    value={formUser.id_role}
                    onChange={(e) => setFormUser({ ...formUser, id_role: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="1">Administrador</option>
                    <option value="2">Empleado</option>
                    <option value="3">Cliente</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label="Usuario *"
                    value={formUser.user_name}
                    onChange={(e) => setFormUser({ ...formUser, user_name: e.target.value })}
                    required={!editingId}
                    placeholder="Ej: jperez"
                    disabled={editingId} // Username no se puede cambiar después de crear
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    label={editingId ? "Nueva Contraseña (opcional)" : "Contraseña *"}
                    type="password"
                    value={formUser.password}
                    onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                    required={!editingId}
                    placeholder={editingId ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                    autoComplete="new-password"
                  />
                  <small className="text-muted">
                    {editingId ? 'Complete solo si desea cambiar la contraseña' : 'Mínimo 6 caracteres'}
                  </small>
                </CCol>
              </CRow>
              <div className="text-end mt-4 pt-3 border-top" style={{ borderColor: colors.border }}>
                <CButton
                  color="secondary"
                  variant="ghost"
                  className="me-2 px-4"
                  onClick={() => {
                    setModalVisible(false)
                    setFormUser(emptyForm)
                  }}
                  disabled={saving}
                >
                  Cancelar
                </CButton>
                <CButton
                  style={{ 
                    backgroundColor: verdeVA, 
                    borderColor: verdeVA,
                    minWidth: '120px'
                  }}
                  className="text-dark fw-bold px-4"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : editingId ? (
                    'Actualizar'
                  ) : (
                    'Crear'
                  )}
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>

        {/* MODAL CONFIRMAR CAMBIO DE ESTADO */}
        <CModal
          visible={statusModal.visible}
          onClose={() => setStatusModal({ ...statusModal, visible: false })}
          alignment="center"
        >
          <CModalBody className="modal-content-va text-center py-4 rounded-3">
            <div className="mb-3">
              <CIcon 
                icon={statusModal.currentStatus === 'active' ? cilWarning : cilCheckCircle} 
                size="xxl" 
                style={{ color: statusModal.currentStatus === 'active' ? '#ffc107' : verdeVA }} 
              />
            </div>
            <h5 className="fw-bold mb-2">
              ¿{statusModal.currentStatus === 'active' ? 'DESACTIVAR' : 'ACTIVAR'} usuario?
            </h5>
            <p className="text-muted mb-4">
              {statusModal.userName && `Usuario: ${statusModal.userName}`}
              <br />
              {statusModal.currentStatus === 'active' 
                ? 'El usuario no podrá acceder al sistema.'
                : 'El usuario podrá acceder al sistema nuevamente.'}
            </p>
            <div className="mt-4">
              <CButton
                color="secondary"
                variant="ghost"
                className="me-2 px-4"
                onClick={() => setStatusModal({ ...statusModal, visible: false })}
                disabled={saving}
              >
                Cancelar
              </CButton>
              <CButton
                color={statusModal.currentStatus === 'active' ? 'warning' : 'success'}
                className="px-4 text-white fw-bold"
                onClick={handleConfirmStatus}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Procesando...
                  </>
                ) : statusModal.currentStatus === 'active' ? (
                  'Sí, desactivar'
                ) : (
                  'Sí, activar'
                )}
              </CButton>
            </div>
          </CModalBody>
        </CModal>

        {/* MODAL CONFIRMAR ELIMINACIÓN */}
        <CModal
          visible={deleteModal.visible}
          onClose={() => setDeleteModal({ ...deleteModal, visible: false })}
          alignment="center"
        >
          <CModalBody className="modal-content-va text-center py-4 rounded-3">
            <div className="mb-3">
              <CIcon icon={cilWarning} size="xxl" style={{ color: '#dc3545' }} />
            </div>
            <h5 className="fw-bold mb-2">¿Eliminar usuario permanentemente?</h5>
            <p className="text-muted mb-4">
              {deleteModal.userName && `Usuario: ${deleteModal.userName}`}
              <br />
              <span className="text-danger fw-semibold">
                ¡Esta acción no se puede deshacer!
              </span>
            </p>
            <div className="mt-4">
              <CButton
                color="secondary"
                variant="ghost"
                className="me-2 px-4"
                onClick={() => setDeleteModal({ ...deleteModal, visible: false })}
                disabled={saving}
              >
                Cancelar
              </CButton>
              <CButton
                color="danger"
                className="px-4 text-white fw-bold"
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Eliminando...
                  </>
                ) : (
                  'Sí, eliminar'
                )}
              </CButton>
            </div>
          </CModalBody>
        </CModal>
      </CContainer>
    )
  }

  export default Users