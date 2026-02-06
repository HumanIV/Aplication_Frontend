// Products.js - VERSIÓN CORREGIDA CON API Y MANEJO DE ERRORES
import React, { useEffect, useState } from 'react'
import {
  CButton,
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
  CForm,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CSpinner,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilCheckCircle, cilWarning, cilSearch, cilBan } from '@coreui/icons'

// IMPORTAR LAS FUNCIONES DE LA API
import {
  getProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  getCategoriesRequest,
  searchProductsRequest
} from '../../api/products.api.js'

const Products = () => {
  // --- LÓGICA DE TEMA ---
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
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    Nombre: '',
    Categoria: '',
    Descripcion: '',
    Precio_Unit: '',
    Cantidad: '0',
    id_category: '',
    id_department: '1'
  })
  const [selectedItem, setSelectedItem] = useState(null)

  // ---------------------- FUNCIONES DE TOAST ---------------------- //
  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { 
      id: Date.now() + Math.random(), // Clave única
      type, 
      message 
    }])
  }

  // ---------------------- FUNCIONES API ---------------------- //
  const loadProducts = async () => {
    setLoading(true)
    try {
      console.log('📦 Products - Cargando productos...')
      const response = await getProductsRequest()
      
      if (response.ok) {
        setProducts(response.products || [])
        console.log(`✅ Products - ${response.products?.length || 0} productos cargados`)
      } else {
        throw new Error(response.msg || 'Error al cargar productos')
      }
    } catch (err) {
      console.error('❌ Products - Error cargando productos:', err)
      showToast('danger', err.message || 'Error al conectar con el servidor')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      console.log('📂 Products - Cargando categorías...')
      const response = await getCategoriesRequest()
      
      if (response.ok) {
        setCategories(response.categories || [])
        console.log(`✅ Products - ${response.categories?.length || 0} categorías cargadas`)
      }
    } catch (err) {
      console.error('❌ Products - Error cargando categorías:', err)
      // No mostrar toast para esto, solo cargar opciones por defecto
      setCategories([
        { id: 1, name: 'Tecnología' },
        { id: 2, name: 'Mobiliario' },
        { id: 3, name: 'Oficina' },
        { id: 4, name: 'Electrónica' },
        { id: 5, name: 'Hogar' }
      ])
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProducts()
      return
    }
    
    setLoading(true)
    try {
      console.log(`🔍 Products - Buscando: "${searchTerm}"`)
      const response = await searchProductsRequest(searchTerm)
      
      if (response.ok) {
        setProducts(response.products || [])
      } else {
        throw new Error(response.msg || 'Error en la búsqueda')
      }
    } catch (err) {
      console.error('❌ Products - Error en búsqueda:', err)
      showToast('warning', 'Error en la búsqueda de productos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    try {
      console.log('📝 Products - Creando producto:', formData)
      const response = await createProductRequest(formData)
      
      if (response.ok) {
        showToast('success', response.msg || 'Producto creado exitosamente')
        setModalVisible(false)
        loadProducts()
      } else {
        throw new Error(response.msg || 'Error al crear producto')
      }
    } catch (err) {
      console.error('❌ Products - Error creando producto:', err)
      showToast('danger', err.message)
    }
  }

  const handleUpdateProduct = async () => {
    try {
      console.log(`✏️ Products - Actualizando producto ID: ${selectedItem.id}`, formData)
      const response = await updateProductRequest(selectedItem.id, formData)
      
      if (response.ok) {
        showToast('info', response.msg || 'Producto actualizado exitosamente')
        setModalVisible(false)
        loadProducts()
      } else {
        throw new Error(response.msg || 'Error al actualizar producto')
      }
    } catch (err) {
      console.error('❌ Products - Error actualizando producto:', err)
      showToast('danger', err.message)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      console.log(`🗑️ Products - Eliminando producto ID: ${selectedItem.id}`)
      const response = await deleteProductRequest(selectedItem.id)
      
      if (response.ok) {
        showToast('danger', response.msg || 'Producto eliminado exitosamente')
        setModalVisible(false)
        loadProducts()
      } else {
        // Manejar error específico de producto con movimientos de stock
        const errorMsg = response.msg || 'Error al eliminar producto'
        const suggestion = response.suggestion || ''
        
        if (errorMsg.includes('No se puede eliminar un producto con movimientos de stock')) {
          // Cerrar modal de confirmación
          setModalVisible(false)
          
          // Mostrar mensaje informativo en modal específico
          showToast('warning', `${errorMsg}. ${suggestion}`)
          
          // Mostrar alerta adicional para mayor claridad
          setTimeout(() => {
            alert(`${errorMsg}\n\n${suggestion}\n\nConsidere desactivar el producto en lugar de eliminarlo.`)
          }, 300)
        } else {
          // Para otros errores, lanzar excepción para ser capturada por catch
          throw new Error(errorMsg)
        }
      }
    } catch (err) {
      console.error('❌ Products - Error eliminando producto:', err)
      
      // Verificar si es el error específico de stock
      if (err.message.includes('No se puede eliminar un producto con movimientos de stock')) {
        showToast('warning', `${err.message}. Desactive el producto en lugar de eliminarlo.`)
      } else {
        showToast('danger', err.message)
      }
    }
  }

  // ---------------------- EFFECTS ---------------------- //
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // ---------------------- HANDLERS ---------------------- //
  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    
    if (item) {
      setFormData({
        Nombre: item.Nombre || '',
        Categoria: item.Categoria || '',
        Descripcion: item.Descripcion || '',
        Precio_Unit: item.Precio_Unit?.replace('$', '') || '',
        Cantidad: item.Cantidad?.toString() || '0',
        id_category: item.id_category || '',
        id_department: item.id_department || '1'
      })
    } else {
      setFormData({
        Nombre: '',
        Categoria: '',
        Descripcion: '',
        Precio_Unit: '',
        Cantidad: '0',
        id_category: '',
        id_department: '1'
      })
    }
    
    setStep(1)
    setModalVisible(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    if (modalType === 'create') {
      handleCreateProduct()
    } else if (modalType === 'edit') {
      handleUpdateProduct()
    }
  }

  // ---------------------- RENDER ---------------------- //
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

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: isDarkMode ? '#fff' : azulVA }}>
          Gestión de <span style={{ color: verdeVA }}>Productos</span>
        </h2>
        <p className="text-muted">Control de inventario y precios V&A.</p>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
        <CCardBody className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="w-100 me-3">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Buscar productos por nombre, categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </div>
            <CButton
              style={{ backgroundColor: azulVA, borderColor: azulVA }}
              className="text-white px-4 py-2 rounded-pill shadow-sm"
              onClick={() => openModal('create')}
            >
              <CIcon icon={cilPlus} className="me-2" /> Nuevo Producto
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* TABLA PRINCIPAL */}
      <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Listado de Existencias</h5>
            <div className="text-muted small">
              {loading ? 'Cargando...' : `${products.length} productos encontrados`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Cargando productos...</p>
            </div>
          ) : (
            <>
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
                    {products.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center py-5">
                          <CAlert color="info">
                            No se encontraron productos
                            {searchTerm && (
                              <div className="mt-2">
                                <small>Intenta con otro término de búsqueda o crea un nuevo producto.</small>
                              </div>
                            )}
                          </CAlert>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      products.map((item) => (
                        <CTableRow key={item.id}>
                          <CTableDataCell className="ps-4">
                            <div className="fw-bold">{item.Nombre}</div>
                            <div className="small text-muted">ID: #{item.id}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="secondary" variant="outline" className="fw-normal">
                              {item.Categoria || 'Sin categoría'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge
                              color={item.Estatus === 'Disponible' ? 'success' : 
                                    item.Estatus === 'Bajo Stock' ? 'warning' : 'danger'}
                              shape="rounded-pill"
                              className="text-white"
                            >
                              {item.Estatus}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="fw-medium">
                            {item.Cantidad} uds.
                          </CTableDataCell>
                          <CTableDataCell className="fw-bold text-primary">
                            {item.Precio_Unit}
                          </CTableDataCell>
                          <CTableDataCell className="text-end pe-4">
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              onClick={() => openModal('edit', item)}
                              className="me-2"
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
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>
              <CCardFooter className="bg-transparent border-0 text-muted small ps-4 pb-4">
                Mostrando {products.length} productos en sistema
              </CCardFooter>
            </>
          )}
        </CCardBody>
      </CCard>

      {/* MODAL DINÁMICO */}
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
                icon={selectedItem?.Cantidad > 0 ? cilWarning : cilTrash}
                size="3xl"
                className={selectedItem?.Cantidad > 0 ? "text-warning mb-3" : "text-danger mb-3"}
                style={{ height: '60px' }}
              />
              
              {selectedItem?.Cantidad > 0 ? (
                <>
                  <h4 className="fw-bold text-warning">Restricción de Eliminación</h4>
                  <p className="text-muted">
                    El producto <strong>"{selectedItem?.Nombre}"</strong> tiene {selectedItem?.Cantidad} unidades en stock.
                  </p>
                  <div className="alert alert-warning">
                    <small>
                      <strong>⚠️ No se puede eliminar:</strong> Este producto tiene movimientos de stock registrados 
                      en el sistema para mantener la integridad de los datos históricos.
                    </small>
                    <br />
                    <small>
                      <strong>💡 Alternativa:</strong> Puede desactivar el producto para que no aparezca en las 
                      nuevas operaciones, pero manteniendo los registros históricos.
                    </small>
                  </div>
                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <CButton 
                      color="secondary" 
                      variant="ghost" 
                      onClick={() => setModalVisible(false)}
                    >
                      Cancelar
                    </CButton>
                    <CButton 
                      color="warning" 
                      className="px-4 text-dark"
                      onClick={() => {
                        showToast('info', 'Función de desactivación pendiente de implementación')
                        setModalVisible(false)
                      }}
                    >
                      <CIcon icon={cilBan} className="me-2" />
                      Desactivar Producto
                    </CButton>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="fw-bold">¿Deseas eliminar este registro?</h4>
                  <p className="text-muted">
                    Estás a punto de borrar: <strong>"{selectedItem?.Nombre}"</strong>
                  </p>
                  <p className="text-danger small">
                    ⚠️ Esta acción no se puede deshacer
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <CButton color="secondary" variant="ghost" onClick={() => setModalVisible(false)}>
                      Cancelar
                    </CButton>
                    <CButton color="danger" className="px-4 text-white" onClick={handleDeleteProduct}>
                      Sí, Eliminar
                    </CButton>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <CNav
                variant="pills"
                className="flex-column flex-sm-row mb-4 p-1 rounded-pill"
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
                  <CForm>
                    <CRow className="g-3">
                      <CCol md={12}>
                        <CFormLabel>Nombre del producto *</CFormLabel>
                        <CFormInput
                          name="Nombre"
                          value={formData.Nombre}
                          onChange={handleChange}
                          placeholder="Ej: Laptop Dell Inspiron 15"
                          required
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormLabel>Categoría</CFormLabel>
                        <CFormSelect
                          name="Categoria"
                          value={formData.Categoria}
                          onChange={handleChange}
                        >
                          <option value="">Seleccione una categoría...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={12}>
                        <CFormLabel>Descripción</CFormLabel>
                        <CFormTextarea
                          name="Descripcion"
                          value={formData.Descripcion}
                          onChange={handleChange}
                          placeholder="Descripción detallada del producto..."
                          rows="3"
                        />
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>

                <CTabPane visible={step === 2}>
                  <CForm>
                    <CRow className="g-3">
                      <CCol md={6}>
                        <CFormLabel>Precio Unitario ($) *</CFormLabel>
                        <CFormInput
                          type="number"
                          step="0.01"
                          min="0"
                          name="Precio_Unit"
                          value={formData.Precio_Unit}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Cantidad Inicial</CFormLabel>
                        <CFormInput
                          type="number"
                          min="0"
                          name="Cantidad"
                          value={formData.Cantidad}
                          onChange={handleChange}
                          placeholder="0"
                        />
                      </CCol>
                      <CCol md={12}>
                        <div className="alert alert-info small mt-2">
                          💡 <strong>Nota:</strong> La cantidad inicial se registrará como stock de entrada.
                          Puede actualizarla después desde movimientos de inventario.
                        </div>
                      </CCol>
                    </CRow>
                  </CForm>
                </CTabPane>

                <CTabPane visible={step === 3} className="text-center py-4">
                  <CIcon
                    icon={cilCheckCircle}
                    size="3xl"
                    style={{ color: verdeVA, height: '60px' }}
                    className="mb-3"
                  />
                  <h5>Resumen del Producto</h5>
                  <div className="text-start p-3 rounded mt-3">
                    <p><strong>Nombre:</strong> {formData.Nombre || '(No especificado)'}</p>
                    <p><strong>Categoría:</strong> {formData.Categoria || '(No especificada)'}</p>
                    <p><strong>Precio:</strong> ${parseFloat(formData.Precio_Unit || 0).toFixed(2)}</p>
                    <p><strong>Cantidad inicial:</strong> {formData.Cantidad} unidades</p>
                  </div>
                  <p className="text-muted small mt-3">
                    Verifica que toda la información sea correcta antes de guardar.
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
                    disabled={!formData.Nombre || !formData.Precio_Unit}
                  >
                    Siguiente
                  </CButton>
                ) : (
                  <CButton
                    style={{ backgroundColor: verdeVA, borderColor: verdeVA }}
                    className="text-dark fw-bold px-4"
                    onClick={handleSubmit}
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