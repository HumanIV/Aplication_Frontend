// src/views/profile/Profile.js (VERSIÓN CORREGIDA)
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CSpinner,
  CAlert,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CProgress,
  CCardFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilShieldAlt,
  cilEnvelopeOpen,
  cilLockLocked,
  cilBadge,
  cilPhone,
  cilHome,
  cilWarning,
  cilCamera,
  cilCloudUpload,
  cilTrash,
  cilCheckCircle,
  cilPencil,
} from '@coreui/icons'
import { helpFetch } from '../../api/helpFetch'

const api = helpFetch()

export const Profile = () => {
  const navigate = useNavigate()
  const [modalVisible, setModalVisible] = useState(false)
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)
  const [deleteAvatarModal, setDeleteAvatarModal] = useState(false)
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  
  // Estados para el formulario de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      // Verificar autenticación
      const token = localStorage.getItem('accessToken')
      if (!token) {
        navigate('/login')
        return
      }

      // Obtener datos del perfil desde el backend
      const response = await api.get('/api/users/profile')
      
      if (response.ok && response.user) {
        console.log('📊 Datos del usuario recibidos:', response.user)
        setUserData(response.user)
        
        // Guardar datos actualizados en localStorage
        localStorage.setItem('user', JSON.stringify(response.user))
      } else {
        setError('No se pudieron cargar los datos del perfil')
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error)
      setError('Error al cargar los datos del perfil')
      
      // Si hay error de autenticación, redirigir al login
      if (error.message.includes('401') || error.message.includes('token')) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { type, message, id: Date.now() }])
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const updatePassword = async () => {
    // Validaciones
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('danger', 'Todos los campos son obligatorios')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('danger', 'La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('danger', 'Las contraseñas no coinciden')
      return
    }

    try {
      setChangingPassword(true)
      
      const response = await api.put('/api/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })

      if (response.ok) {
        showToast('success', 'Contraseña actualizada correctamente')
        setModalVisible(false)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        showToast('danger', response.msg || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error)
      showToast('danger', 'Error al cambiar la contraseña')
    } finally {
      setChangingPassword(false)
    }
  }

  // ============================================
  // FUNCIONES PARA MANEJO DE AVATAR
  // ============================================

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showToast('danger', 'Formato no válido. Solo JPG, PNG, GIF o WebP')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('danger', 'La imagen no debe superar los 5MB')
      return
    }

    setSelectedFile(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const uploadAvatar = async () => {
    if (!selectedFile) {
      showToast('danger', 'Por favor selecciona una imagen')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // Crear FormData para enviar el archivo
      const formData = new FormData()
      formData.append('avatar', selectedFile)

      // Configurar headers con el token
      const token = localStorage.getItem('accessToken')
      
      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      // Subir a Cloudinary usando la API helper
      const response = await api.upload('/api/users/upload-avatar', formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        showToast('success', 'Foto de perfil actualizada correctamente')
        
        // Actualizar datos del usuario
        const updatedUser = { ...userData, avatar_url: response.avatar_url }
        setUserData(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Cerrar modal y limpiar
        setTimeout(() => {
          setAvatarModalVisible(false)
          setSelectedFile(null)
          setPreviewUrl('')
          setUploadProgress(0)
        }, 1000)
      } else {
        showToast('danger', response.msg || 'Error al subir la imagen')
      }
    } catch (error) {
      console.error('❌ Error subiendo avatar:', error)
      showToast('danger', 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const deleteAvatar = async () => {
    try {
      const response = await api.delete('/api/users/avatar')
      
      if (response.ok) {
        showToast('success', 'Foto de perfil eliminada correctamente')
        
        // Actualizar datos del usuario
        const updatedUser = { ...userData, avatar_url: null }
        setUserData(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setDeleteAvatarModal(false)
      } else {
        showToast('danger', response.msg || 'Error al eliminar la foto')
      }
    } catch (error) {
      console.error('❌ Error eliminando avatar:', error)
      showToast('danger', 'Error al eliminar la foto')
    }
  }

  const getAvatarUrl = () => {
    if (!userData) return 'https://avatars.githubusercontent.com/u/1?v=4'
    
    if (userData.avatar_url) {
      return userData.avatar_url
    }
    
    // Avatar por defecto basado en iniciales
    const name = userData.nombre || userData.first_name || 'Usuario'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4b79ff&color=fff&bold=true`
  }

  const getRoleBadgeColor = (tipo_rol) => {
    const colors = {
      'Administrador': 'primary',
      'Gerente': 'success',
      'Empleado': 'info',
      'Cliente': 'warning',
      'Docente': 'secondary',
      'admin': 'primary',
      'gerente': 'success',
      'empleado': 'info',
      'cliente': 'warning'
    }
    return colors[tipo_rol] || 'dark'
  }

  if (loading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <CSpinner size="lg" color="primary" />
          <p className="mt-3">Cargando perfil...</p>
        </div>
      </CContainer>
    )
  }

  return (
    <div className="profile-page-wrapper py-4">
      <CContainer fluid>
        {/* HEADER DE BIENVENIDA */}
        <div className="mb-4 text-center text-md-start">
          <h2 className="fw-bold mb-0 text-color-main">Mi Perfil</h2>
          <p className="text-secondary">Gestiona tu información personal y seguridad de cuenta</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <CAlert color="danger" className="mb-4">
            <CIcon icon={cilWarning} className="me-2" />
            {error}
          </CAlert>
        )}

        <CRow className="gy-4">
          {/* COLUMNA IZQUIERDA: TARJETA DE IDENTIDAD CON AVATAR - VERSIÓN MÁS VISIBLE */}
          <CCol lg={4}>
            <CCard className="border-0 shadow-sm rounded-4 bg-card-custom h-100 overflow-hidden">
              <div className="profile-banner-accent" />
              <CCardBody className="pt-0 text-center">
                {/* Contenedor del avatar con overlay */}
                <div className="avatar-wrapper mb-3 position-relative" style={{ marginTop: '-50px' }}>
                  <CAvatar 
                    src={getAvatarUrl()} 
                    size="xxl" 
                    className="profile-avatar-premium shadow"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                  
                  {/* Overlay para acciones del avatar - MÁS VISIBLE */}
                  <div className="avatar-actions-overlay position-absolute top-50 start-50 translate-middle">
                    <CButton
                      color="primary"
                      shape="rounded-pill"
                      size="sm"
                      className="shadow-lg"
                      onClick={() => setAvatarModalVisible(true)}
                      style={{
                        backgroundColor: 'rgba(75, 121, 255, 0.9)',
                        border: '2px solid white',
                        padding: '8px 15px'
                      }}
                    >
                      <CIcon icon={cilCamera} className="me-1" />
                      Cambiar Foto
                    </CButton>
                  </div>
                </div>
                
                <h4 className="fw-bold text-color-main mb-1">
                  {userData?.nombre || userData?.first_name || 'Usuario'} {userData?.apellido || userData?.last_name || ''}
                </h4>
                
                <CBadge
                  color={getRoleBadgeColor(userData?.tipo_rol)}
                  variant="solid"
                  className="px-3 py-2 rounded-pill mb-3 shadow-sm"
                >
                  <CIcon icon={cilBadge} className="me-1" /> {userData?.tipo_rol || 'Sin rol'}
                </CBadge>

                {/* ACCIONES RÁPIDAS - MUCHO MÁS VISIBLE */}
                <CCardFooter className="border-0 bg-transparent p-0">
                  <div className="d-grid gap-2 mb-3">
                    <CButton
                      color="primary"
                      variant="outline"
                      className="fw-bold"
                      onClick={() => setAvatarModalVisible(true)}
                    >
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      Actualizar Foto de Perfil
                    </CButton>
                    
                    {userData?.avatar_url && (
                      <CButton
                        color="danger"
                        variant="ghost"
                        className="fw-bold"
                        onClick={() => setDeleteAvatarModal(true)}
                      >
                        <CIcon icon={cilTrash} className="me-2" />
                        Eliminar Foto
                      </CButton>
                    )}
                  </div>
                </CCardFooter>

                <div className="mt-3 p-3 rounded-3 text-start" style={{ backgroundColor: 'rgba(75, 121, 255, 0.05)' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-secondary">Usuario</span>
                    <span className="small fw-bold text-color-main">{userData?.username || userData?.email}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-secondary">ID</span>
                    <span className="small fw-bold text-color-main">{userData?.id || 'N/A'}</span>
                  </div>
                  {userData?.dni && (
                    <div className="d-flex justify-content-between">
                      <span className="small text-secondary">Cédula/DNI</span>
                      <span className="small fw-bold text-color-main">{userData.dni}</span>
                    </div>
                  )}
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
                        <div className="p-2 border-bottom text-color-main">
                          {(userData?.nombre || userData?.first_name || '') + ' ' + (userData?.apellido || userData?.last_name || '')}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">
                          Correo Electrónico
                        </label>
                        <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                          <CIcon icon={cilEnvelopeOpen} className="me-2 text-success" />{' '}
                          {userData?.email || 'No especificado'}
                        </div>
                      </CCol>
                      
                      {userData?.phone_number && (
                        <CCol md={6}>
                          <label className="small text-secondary d-block mb-1">Teléfono</label>
                          <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                            <CIcon icon={cilPhone} className="me-2 text-primary" /> 
                            {userData.phone_number}
                          </div>
                        </CCol>
                      )}
                      
                      {userData?.address && (
                        <CCol md={6}>
                          <label className="small text-secondary d-block mb-1">Dirección</label>
                          <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                            <CIcon icon={cilHome} className="me-2 text-warning" /> 
                            {userData.address}
                          </div>
                        </CCol>
                      )}
                      
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">Rol ID</label>
                        <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                          <CIcon icon={cilBadge} className="me-2 text-secondary" /> 
                          {userData?.Id_rol || userData?.id_role || 'N/A'}
                        </div>
                      </CCol>
                      
                      <CCol md={6}>
                        <label className="small text-secondary d-block mb-1">Nivel de Acceso</label>
                        <div className="p-2 border-bottom text-color-main d-flex align-items-center">
                          <CIcon icon={cilShieldAlt} className="me-2 text-primary" /> 
                          {userData?.tipo_rol || 'Sin rol'}
                        </div>
                      </CCol>
                    </CRow>
                    
                    {/* Información adicional si es empleado */}
                    {userData?.es_empleado && (
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold text-color-main mb-3">
                          Información de Empleado
                        </h6>
                        <CRow className="gy-2">
                          {userData?.id_employee && (
                            <CCol md={6}>
                              <label className="small text-secondary d-block mb-1">ID Empleado</label>
                              <div className="p-2 rounded text-color-main">
                                {userData.id_employee}
                              </div>
                            </CCol>
                          )}
                          {userData?.commission && (
                            <CCol md={6}>
                              <label className="small text-secondary d-block mb-1">Comisión</label>
                              <div className="p-2 rounded text-color-main">
                                {userData.commission}%
                              </div>
                            </CCol>
                          )}
                        </CRow>
                      </div>
                    )}
                    
                    {/* Información adicional si es cliente */}
                    {userData?.es_cliente && (
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold text-color-main mb-3">
                          Información de Cliente
                        </h6>
                        <CRow className="gy-2">
                          {userData?.id_customer && (
                            <CCol md={6}>
                              <label className="small text-secondary d-block mb-1">ID Cliente</label>
                              <div className="p-2 rounded text-color-main">
                                {userData.id_customer}
                              </div>
                            </CCol>
                          )}
                          {userData?.purchase_limit && (
                            <CCol md={6}>
                              <label className="small text-secondary d-block mb-1">Límite de Compra</label>
                              <div className="p-2 rounded text-color-main">
                                ${userData.purchase_limit.toLocaleString()}
                              </div>
                            </CCol>
                          )}
                        </CRow>
                      </div>
                    )}
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

      {/* MODAL PARA CAMBIAR CONTRASEÑA */}
      <CModal
        backdrop="static"
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        className="modal-premium"
      >
        <CModalHeader className="border-0 pb-0">
          <CModalTitle className="fw-bold">
            <CIcon icon={cilLockLocked} className="me-2 text-warning" /> Cambiar Contraseña
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="password"
                label="Contraseña Actual"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="bg-light-subtle py-2"
                disabled={changingPassword}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="password"
                label="Nueva Contraseña"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="bg-light-subtle py-2"
                disabled={changingPassword}
              />
              <small className="text-muted">Mínimo 6 caracteres</small>
            </div>
            <div className="mb-4">
              <CFormInput
                type="password"
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="bg-light-subtle py-2"
                disabled={changingPassword}
              />
            </div>
            <div className="d-grid">
              <CButton 
                color="primary" 
                className="py-2 fw-bold rounded-3" 
                onClick={updatePassword}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <CSpinner component="span" size="sm" className="me-2" />
                    Actualizando...
                  </>
                ) : (
                  'Guardar Nueva Contraseña'
                )}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      {/* MODAL PARA SUBIR AVATAR */}
      <CModal
        backdrop="static"
        alignment="center"
        visible={avatarModalVisible}
        onClose={() => {
          if (!uploading) {
            setAvatarModalVisible(false)
            setSelectedFile(null)
            setPreviewUrl('')
            setUploadProgress(0)
          }
        }}
        className="modal-premium"
      >
        <CModalHeader className="border-0 pb-0">
          <CModalTitle className="fw-bold">
            <CIcon icon={cilCloudUpload} className="me-2 text-primary" /> Subir Foto de Perfil
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          <div className="text-center">
            {/* Vista previa de la imagen */}
            <div className="mb-4">
              <CAvatar 
                src={previewUrl || getAvatarUrl()} 
                size="xxl" 
                className="shadow mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>

            {/* Botón para seleccionar archivo */}
            <div className="mb-4">
              <CFormInput
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="d-none"
                id="avatar-upload"
              />
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => document.getElementById('avatar-upload').click()}
                disabled={uploading}
                className="w-100 py-3"
              >
                <CIcon icon={cilCamera} className="me-2" />
                {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </CButton>
              <small className="text-muted d-block mt-2">
                Formatos: JPG, PNG, GIF, WebP • Máximo 5MB
              </small>
            </div>

            {/* Barra de progreso si está subiendo */}
            {uploading && (
              <div className="mb-3">
                <CProgress
                  color="primary"
                  value={uploadProgress}
                  className="mb-2"
                />
                <small className="text-muted">
                  Subiendo imagen... {uploadProgress}%
                </small>
              </div>
            )}

            {/* Botón para subir */}
            <div className="d-grid gap-2">
              <CButton 
                color="primary" 
                className="py-3 fw-bold rounded-3" 
                onClick={uploadAvatar}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <CSpinner component="span" size="sm" className="me-2" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    Subir Foto
                  </>
                )}
              </CButton>
              
              <CButton
                color="secondary"
                variant="ghost"
                onClick={() => {
                  setAvatarModalVisible(false)
                  setSelectedFile(null)
                  setPreviewUrl('')
                  setUploadProgress(0)
                }}
                disabled={uploading}
              >
                Cancelar
              </CButton>
            </div>
          </div>
        </CModalBody>
      </CModal>

      {/* MODAL PARA CONFIRMAR ELIMINAR AVATAR */}
      <CModal
        backdrop="static"
        alignment="center"
        visible={deleteAvatarModal}
        onClose={() => setDeleteAvatarModal(false)}
        size="sm"
      >
        <CModalBody className="p-4 text-center">
          <CIcon icon={cilWarning} size="xl" className="text-warning mb-3" />
          <h5 className="fw-bold mb-3">¿Eliminar foto de perfil?</h5>
          <p className="text-secondary mb-4">
            Se eliminará tu foto actual y se usará un avatar predeterminado.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <CButton
              color="secondary"
              variant="ghost"
              onClick={() => setDeleteAvatarModal(false)}
            >
              Cancelar
            </CButton>
            <CButton
              color="danger"
              onClick={deleteAvatar}
            >
              Sí, eliminar
            </CButton>
          </div>
        </CModalBody>
      </CModal>

      {/* ESTILOS DINÁMICOS - CORREGIDOS (sin jsx attribute) */}
      <style>
        {`
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
          position: relative;
        }
        
        .avatar-actions-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .avatar-wrapper:hover .avatar-actions-overlay {
          opacity: 1;
        }
        
        .profile-avatar-premium {
          border: 4px solid #fff;
          object-fit: cover;
        }
        
        [data-coreui-theme='dark'] .profile-avatar-premium {
          border-color: #1e2128;
        }

        .profile-page-wrapper {
          min-height: 100vh;
        }
        `}
      </style>
    </div>
  )
}

export default Profile