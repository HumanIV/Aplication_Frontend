import React, { useEffect, useState } from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CContainer,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilCheckCircle, cilWarning } from '@coreui/icons'

const Products = () => {
  // --- LÓGICA DE TEMA (Detección para estilos específicos) ---
  const [isDarkMode, setIsDarkMode] = useState(false)
  const azulVA = '#002d72'
  const verdeVA = '#58cc7d'

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

  // ---------------------- ESTADOS ---------------------- //
  const [toasts, setToasts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [step, setStep] = useState(1)
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    Nombre: '',
    Categoria: '',
    Estatus: '',
    Cantidad: '',
    Precio_Unit: '',
  })
  const [selectedItem, setSelectedItem] = useState(null)

  const API = 'http://localhost:4000/products'

  const showToast = (type, message) =>
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])

  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    setFormData(item || { Nombre: '', Categoria: '', Estatus: '', Cantidad: '', Precio_Unit: '' })
    setStep(1)
    setModalVisible(true)
  }

  const loadProducts = async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      showToast('danger', 'Error al conectar con el servidor')
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Operaciones CRUD (Simplificadas para el ejemplo)
  const saveItem = async () => {
    /* fetch POST... */ showToast('success', 'Producto registrado')
    setModalVisible(false)
    loadProducts()
  }
  const updateItem = async () => {
    /* fetch PUT... */ showToast('info', 'Producto actualizado')
    setModalVisible(false)
    loadProducts()
  }
  const deleteItem = async () => {
    /* fetch DELETE... */ showToast('danger', 'Producto eliminado')
    setModalVisible(false)
    loadProducts()
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <CContainer fluid className="px-4 pb-4">
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={2600} color={t.type} className="text-white">
            <CToastHeader closeButton>
              <strong>Notificación</strong>
            </CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: isDarkMode ? '#fff' : azulVA }}>
          Gestión de <span style={{ color: verdeVA }}>Productos</span>
        </h2>
        <p className="text-muted">Control de inventario y precios V&A.</p>
      </div>

      {/* ---------- TABLA PRINCIPAL ---------- */}
      <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Listado de Existencias</h5>
            <CButton
              style={{ backgroundColor: azulVA, borderColor: azulVA }}
              className="text-white px-4 py-2 rounded-pill shadow-sm"
              onClick={() => openModal('create')}
            >
              <CIcon icon={cilPlus} className="me-2" /> Nuevo Producto
            </CButton>
          </div>

          <div className="table-responsive">
            <CTable hover align="middle" borderless className="mb-0">
              <CTableHead className={isDarkMode ? 'bg-dark' : 'bg-light'}>
                <CTableRow>
                  <CTableHeaderCell className="ps-4">PRODUCTO</CTableHeaderCell>
                  <CTableHeaderCell>CATEGORÍA</CTableHeaderCell>
                  <CTableHeaderCell>ESTATUS</CTableHeaderCell>
                  <CTableHeaderCell>CANTIDAD</CTableHeaderCell>
                  <CTableHeaderCell>PRECIO UNIT.</CTableHeaderCell>
                  <CTableHeaderCell className="text-end pe-4">ACCIONES</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell className="ps-4">
                      <div className="fw-bold">{item.Nombre}</div>
                      <div className="small text-muted">ID: #{item.id}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="secondary" variant="outline" className="fw-normal">
                        {item.Categoria}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={item.Estatus === 'Disponible' ? 'success' : 'warning'}
                        shape="rounded-pill"
                        className={item.Estatus === 'Disponible' ? 'text-white' : 'text-dark'}
                      >
                        {item.Estatus}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="fw-medium">{item.Cantidad} uds.</CTableDataCell>
                    <CTableDataCell className="fw-bold text-primary">
                      {item.Precio_Unit}
                    </CTableDataCell>
                    <CTableDataCell className="text-end pe-4">
                      <CButton
                        color="info"
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal('edit', item)}
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
                        onClick={() => openModal('delete', item)}
                      >
                        <CIcon icon={cilTrash} size="lg" />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
        <CCardFooter className="bg-transparent border-0 text-muted small ps-4 pb-4">
          Mostrando {products.length} productos en sistema
        </CCardFooter>
      </CCard>

      {/* ---------- MODAL DINÁMICO ---------- */}
      <CModal
        size="lg"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        alignment="center"
      >
        <CModalHeader
          style={{ backgroundColor: modalType === 'delete' ? '#e55353' : azulVA }}
          className="text-white border-0"
        >
          <CModalTitle className="fw-bold">
            {modalType === 'create' && 'Registrar Nuevo Producto'}
            {modalType === 'edit' && 'Actualizar Producto'}
            {modalType === 'delete' && 'Confirmar Eliminación'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody className="p-4">
          {modalType === 'delete' ? (
            <div className="text-center py-3">
              <CIcon
                icon={cilWarning}
                size="3xl"
                className="text-danger mb-3"
                style={{ height: '60px' }}
              />
              <h4 className="fw-bold">¿Deseas eliminar este registro?</h4>
              <p className="text-muted">
                Estás a punto de borrar: <strong>{selectedItem?.Nombre}</strong>
              </p>
              <div className="d-flex justify-content-center gap-2 mt-4">
                <CButton color="secondary" variant="ghost" onClick={() => setModalVisible(false)}>
                  Cancelar
                </CButton>
                <CButton color="danger" className="px-4 text-white" onClick={deleteItem}>
                  Sí, Eliminar
                </CButton>
              </div>
            </div>
          ) : (
            <>
              <CNav
                variant="pills"
                className="flex-column flex-sm-row mb-4 bg-light p-1 rounded-pill"
              >
                <CNavItem className="flex-sm-fill text-center">
                  <CNavLink
                    active={step === 1}
                    onClick={() => setStep(1)}
                    style={{ cursor: 'pointer', borderRadius: '20px' }}
                  >
                    1. Información
                  </CNavLink>
                </CNavItem>
                <CNavItem className="flex-sm-fill text-center">
                  <CNavLink
                    active={step === 2}
                    onClick={() => setStep(2)}
                    style={{ cursor: 'pointer', borderRadius: '20px' }}
                  >
                    2. Valores
                  </CNavLink>
                </CNavItem>
                <CNavItem className="flex-sm-fill text-center">
                  <CNavLink
                    active={step === 3}
                    onClick={() => setStep(3)}
                    style={{ cursor: 'pointer', borderRadius: '20px' }}
                  >
                    3. Confirmar
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent>
                <CTabPane visible={step === 1}>
                  <CRow className="g-3">
                    <CCol md={12}>
                      <CFormInput
                        label="Nombre del producto"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        placeholder="Ej: Laptop Dell"
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormSelect
                        label="Categoría"
                        name="Categoria"
                        value={formData.Categoria}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione...</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Mobiliario">Mobiliario</option>
                        <option value="Oficina">Oficina</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CTabPane>

                <CTabPane visible={step === 2}>
                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormSelect
                        label="Estatus"
                        name="Estatus"
                        value={formData.Estatus}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione...</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Agotado">Agotado</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="number"
                        label="Cantidad"
                        name="Cantidad"
                        value={formData.Cantidad}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={12}>
                      <CFormInput
                        label="Precio Unitario"
                        name="Precio_Unit"
                        value={formData.Precio_Unit}
                        onChange={handleChange}
                        placeholder="Ej: 120$"
                      />
                    </CCol>
                  </CRow>
                </CTabPane>

                <CTabPane visible={step === 3} className="text-center py-2">
                  <CIcon
                    icon={cilCheckCircle}
                    size="3xl"
                    style={{ color: verdeVA, height: '60px' }}
                    className="mb-3"
                  />
                  <h5>Todo listo para guardar</h5>
                  <p className="text-muted small">
                    Verifica que el precio y las cantidades sean correctos antes de finalizar.
                  </p>
                </CTabPane>
              </CTabContent>

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <CButton
                  color="secondary"
                  variant="ghost"
                  disabled={step === 1}
                  onClick={() => setStep(step - 1)}
                >
                  Atrás
                </CButton>
                {step < 3 ? (
                  <CButton
                    style={{ backgroundColor: azulVA }}
                    className="text-white px-4"
                    onClick={() => setStep(step + 1)}
                  >
                    Siguiente
                  </CButton>
                ) : (
                  <CButton
                    style={{ backgroundColor: verdeVA, borderColor: verdeVA }}
                    className="text-dark fw-bold px-4"
                    onClick={modalType === 'create' ? saveItem : updateItem}
                  >
                    {modalType === 'create' ? 'Guardar Producto' : 'Actualizar Cambios'}
                  </CButton>
                )}
              </div>
            </>
          )}
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default Products
