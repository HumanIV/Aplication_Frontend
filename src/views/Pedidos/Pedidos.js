import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CInputGroup,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilTrash,
  cilPlus,
  cilPencil,
  cilMagnifyingGlass,
  cilUserPlus,
  cilCheckCircle,
  cilCloudUpload,
} from '@coreui/icons'

const API_BASE = 'http://localhost:4000'
const API_PRODUCTS = `${API_BASE}/products`
const API_PEDIDOS = `${API_BASE}/pedidos`
const API_CLIENTS = `${API_BASE}/clients`

const emptyForm = () => ({
  clienteId: '',
  cliente: '',
  rif: '',
  direccionFactura: '',
  direccionEntrega: '',
  sucursal: '',
  fechaCancelacion: '',
  expiracion: '',
  terminosPago: 'Contado',
  tasa: 'BCV',
  transporte: 'Tealca',
})

const emptyClientForm = () => ({
  nombre: '',
  rif: '',
  direccion: '',
  sucursal: '',
  telefono: '',
})

const Pedidos = () => {
  // --- DETECCIÓN DE TEMA Y COLORES V&A ---
  const [isDarkMode, setIsDarkMode] = useState(false)
  const azulVA = '#002d72'
  const verdeVA = '#58cc7d'

  useEffect(() => {
    const checkTheme = () =>
      setIsDarkMode(document.documentElement.getAttribute('data-coreui-theme') === 'dark')
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-coreui-theme'],
    })
    return () => observer.disconnect()
  }, [])

  // --- ESTADOS ---
  const [toasts, setToasts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [formData, setFormData] = useState(emptyForm())
  const [lines, setLines] = useState([])
  const [clientForm, setClientForm] = useState(emptyClientForm())
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [clientSearchTerm, setClientSearchTerm] = useState('')

  // --- CARGA Y LÓGICA (Se mantiene tu lógica funcional original) ---
  useEffect(() => {
    loadProducts()
    loadPedidos()
    loadClients()
  }, [])

  const showToast = (type, message) =>
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])

  const loadProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS)
      const data = await res.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (err) {
      console.error(err)
    }
  }
  const loadPedidos = async () => {
    try {
      const res = await fetch(API_PEDIDOS)
      setPedidos(await res.json())
    } catch (err) {
      console.error(err)
    }
  }
  const loadClients = async () => {
    try {
      const res = await fetch(API_CLIENTS)
      const data = await res.json()
      setClients(data)
      setFilteredClients(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase()
    const filtered = products.filter((p) => {
      const matchesSearch =
        !q ||
        String(p.ID ?? p.id)
          .toLowerCase()
          .includes(q) ||
        String(p.Nombre || p.name || '')
          .toLowerCase()
          .includes(q)
      const matchesCategory = !categoryFilter || (p.Categoria || p.category) === categoryFilter
      return matchesSearch && matchesCategory
    })
    setFilteredProducts(filtered)
  }, [searchTerm, categoryFilter, products])

  useEffect(() => {
    const q = clientSearchTerm.trim().toLowerCase()
    const filtered = clients.filter(
      (c) => c.nombre.toLowerCase().includes(q) || c.rif.toLowerCase().includes(q),
    )
    setFilteredClients(filtered)
  }, [clientSearchTerm, clients])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleClientFormChange = (e) => {
    const { name, value } = e.target
    setClientForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(emptyForm())
    setLines([])
    setSelectedPedido(null)
  }

  const selectClient = (client) => {
    setFormData((prev) => ({
      ...prev,
      clienteId: client.id,
      cliente: client.nombre,
      rif: client.rif,
      direccionFactura: client.direccion || '',
      direccionEntrega: client.direccion || '',
      sucursal: client.sucursal || '',
      terminosPago: client.terminosPago || 'Contado',
      transporte: client.transporte || 'Tealca',
    }))
    showToast('success', 'Cliente vinculado')
    setModalVisible(false)
  }

  const addProductLine = (product, qty = 1) => {
    const line = {
      id: Date.now(),
      productoId: product.id,
      nombre: product.Nombre || product.name || 'Sin nombre',
      precio: Number(product.Precio_Unit ?? 0),
      cantidad: Number(qty),
      subtotal: Number(qty) * Number(product.Precio_Unit ?? 0),
    }
    setLines((prev) => [...prev, line])
    showToast('primary', 'Producto añadido')
    setModalVisible(false)
  }

  const removeLine = (lineId) => setLines((prev) => prev.filter((l) => l.id !== lineId))
  const { total } = lines.reduce(
    (acc, l) => {
      acc.total += l.subtotal
      return acc
    },
    { total: 0 },
  )

  const openModal = (type, item = null) => {
    setModalType(type)
    setModalVisible(true)
    if (type === 'edit' && item) {
      setSelectedPedido(item)
      setFormData({ ...item })
      setLines(item.lines || [])
    }
    if (type === 'delete' && item) setSelectedPedido(item)
    if (type === 'addClient') setClientForm(emptyClientForm())
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalType(null)
  }

  return (
    <CContainer fluid className="px-4 pb-4">
      {/* HEADER DE MÓDULO */}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: isDarkMode ? '#fff' : azulVA }}>
          Centro de <span style={{ color: verdeVA }}>Pedidos</span>
        </h2>
        <p className="text-muted">Generación de presupuestos y gestión de historial.</p>
      </div>

      <CRow>
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <CCol lg={12}>
          <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Detalles del Presupuesto</h5>
              <CButton
                color="light"
                className="rounded-pill px-3 shadow-sm border"
                onClick={resetForm}
              >
                Limpiar Formulario
              </CButton>
            </CCardHeader>
            <CCardBody className="p-4">
              <CForm>
                <CRow className="g-4">
                  <CCol md={7}>
                    <div
                      className="p-3 rounded-4"
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}
                    >
                      <CFormLabel className="fw-bold small text-uppercase text-muted">
                        Información del Cliente
                      </CFormLabel>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          placeholder="Haga clic en la lupa para buscar cliente..."
                          value={formData.cliente}
                          readOnly
                          style={{ cursor: 'pointer', borderRadius: '10px 0 0 10px' }}
                          onClick={() => openModal('searchClient')}
                        />
                        <CButton
                          color="info"
                          className="text-white"
                          onClick={() => openModal('searchClient')}
                        >
                          <CIcon icon={cilMagnifyingGlass} />
                        </CButton>
                      </CInputGroup>

                      <CRow className="g-2">
                        <CCol md={6}>
                          <CFormInput
                            label="RIF"
                            value={formData.rif}
                            readOnly
                            plainText
                            className="border-bottom ps-2"
                          />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput
                            label="Sucursal"
                            value={formData.sucursal}
                            readOnly
                            plainText
                            className="border-bottom ps-2"
                          />
                        </CCol>
                        <CCol md={12}>
                          <CFormInput
                            label="Dirección Fiscal"
                            value={formData.direccionFactura}
                            readOnly
                            plainText
                            className="border-bottom ps-2"
                          />
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>

                  <CCol md={5}>
                    <div className="p-3 rounded-4 border">
                      <CFormLabel className="fw-bold small text-uppercase text-muted">
                        Condiciones Comerciales
                      </CFormLabel>
                      <CRow className="g-3">
                        <CCol md={12}>
                          <CFormSelect
                            label="Términos de Pago"
                            name="terminosPago"
                            value={formData.terminosPago}
                            onChange={handleFormChange}
                          >
                            <option>Contado</option>
                            <option>Crédito 15 días</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                          <CFormSelect
                            label="Tasa"
                            name="tasa"
                            value={formData.tasa}
                            onChange={handleFormChange}
                          >
                            <option>BCV</option>
                            <option>Divisa</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                          <CFormSelect
                            label="Transporte"
                            name="transporte"
                            value={formData.transporte}
                            onChange={handleFormChange}
                          >
                            <option>Tealca</option>
                            <option>Opcional</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>
                </CRow>

                {/* TABLA DE LÍNEAS */}
                <div className="mt-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-uppercase mb-0">Artículos en Pedido</h6>
                    <CButton
                      color="info"
                      variant="outline"
                      className="rounded-pill"
                      onClick={() => openModal('addProduct')}
                    >
                      <CIcon icon={cilPlus} className="me-2" />
                      Añadir Producto
                    </CButton>
                  </div>

                  <div className="table-responsive rounded-4 border">
                    <CTable hover align="middle" className="mb-0">
                      <CTableHead className={isDarkMode ? 'bg-dark' : 'bg-light'}>
                        <CTableRow>
                          <CTableHeaderCell className="ps-4">PRODUCTO</CTableHeaderCell>
                          <CTableHeaderCell>CANTIDAD</CTableHeaderCell>
                          <CTableHeaderCell>P. UNITARIO</CTableHeaderCell>
                          <CTableHeaderCell>SUBTOTAL</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">ACCIÓN</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {lines.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan={5} className="text-center py-4 text-muted">
                              No hay productos añadidos
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          lines.map((l) => (
                            <CTableRow key={l.id}>
                              <CTableDataCell className="ps-4 fw-medium">{l.nombre}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="secondary" variant="outline">
                                  {l.cantidad} uds
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>${l.precio.toFixed(2)}</CTableDataCell>
                              <CTableDataCell className="fw-bold text-primary">
                                ${l.subtotal.toFixed(2)}
                              </CTableDataCell>
                              <CTableDataCell className="text-center">
                                <CButton
                                  color="danger"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLine(l.id)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        )}
                      </CTableBody>
                    </CTable>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <div className="text-end">
                      <p className="text-muted mb-0">Total a Pagar</p>
                      <h2 className="fw-bold" style={{ color: verdeVA }}>
                        ${total.toFixed(2)}
                      </h2>
                      <CButton
                        size="lg"
                        className="text-white px-5 mt-2 rounded-pill shadow"
                        style={{ backgroundColor: azulVA, borderColor: azulVA }}
                        onClick={() => openModal('confirmar')}
                      >
                        Confirmar y Guardar
                      </CButton>
                    </div>
                  </div>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        {/* LISTADO DE PEDIDOS */}
        <CCol lg={12}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4">
              <h5 className="fw-bold">Historial de Operaciones</h5>
            </CCardHeader>
            <CCardBody className="p-4">
              <CTable hover responsive align="middle">
                <CTableHead className="text-muted small">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>CLIENTE / SUCURSAL</CTableHeaderCell>
                    <CTableHeaderCell>FECHA</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">ACCIONES</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pedidos.map((p) => (
                    <CTableRow key={p.id}>
                      <CTableDataCell className="fw-bold" style={{ color: azulVA }}>
                        #{p.id}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-bold">{p.cliente}</div>
                        <div className="small text-muted">{p.sucursal}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString() : '-'}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton variant="ghost" size="sm" onClick={() => openModal('edit', p)}>
                          <CIcon
                            icon={cilPencil}
                            style={{ color: isDarkMode ? '#00d4ff' : azulVA }}
                          />
                        </CButton>
                        <CButton variant="ghost" size="sm" onClick={() => openModal('delete', p)}>
                          <CIcon icon={cilTrash} className="text-danger" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* TOASTER */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={3000} color={t.type} className="text-white">
            <CToastHeader closeButton>
              <strong>Notificación V&A</strong>
            </CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* MODAL UNIFICADO */}
      <CModal
        visible={modalVisible}
        onClose={closeModal}
        size="lg"
        alignment="center"
        backdrop="static"
      >
        <CModalHeader style={{ backgroundColor: azulVA }} className="text-white border-0 px-4">
          <CModalTitle className="fw-bold">
            {modalType === 'searchClient' && 'Directorio de Clientes'}
            {modalType === 'addClient' && 'Registrar Nuevo Cliente'}
            {modalType === 'addProduct' && 'Selección de Artículos'}
            {modalType === 'confirmar' && 'Validación de Pedido'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          {/* BUSCAR CLIENTE */}
          {modalType === 'searchClient' && (
            <>
              <div className="d-flex gap-2 mb-4">
                <CFormInput
                  placeholder="Filtrar por nombre o RIF..."
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                />
                <CButton
                  color="success"
                  className="text-white text-nowrap"
                  onClick={() => openModal('addClient')}
                >
                  <CIcon icon={cilUserPlus} className="me-2" />
                  Nuevo Cliente
                </CButton>
              </div>
              <div className="table-responsive" style={{ maxHeight: '350px' }}>
                <CTable hover align="middle">
                  <CTableBody>
                    {filteredClients.map((c) => (
                      <CTableRow
                        key={c.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => selectClient(c)}
                      >
                        <CTableDataCell>
                          <div className="fw-bold">{c.nombre}</div>
                          <div className="small text-muted">{c.rif}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CButton size="sm" color="primary" variant="ghost">
                            Seleccionar
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}

          {/* AGREGAR PRODUCTO */}
          {modalType === 'addProduct' && (
            <>
              <CRow className="g-3 mb-4">
                <CCol md={8}>
                  <CFormInput
                    placeholder="Nombre del producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {[
                      ...new Set(products.map((p) => p.Categoria || p.category).filter(Boolean)),
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <CTable hover align="middle">
                  <CTableBody>
                    {filteredProducts.map((prod) => (
                      <CTableRow key={prod.id}>
                        <CTableDataCell className="fw-bold">
                          {prod.Nombre || prod.name}
                        </CTableDataCell>
                        <CTableDataCell className="text-primary fw-medium">
                          ${prod.Precio_Unit || prod.price}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CButton
                            size="sm"
                            color="success"
                            variant="outline"
                            onClick={() => addProductLine(prod)}
                          >
                            Añadir
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}

          {/* CONFIRMACIÓN FINAL */}
          {modalType === 'confirmar' && (
            <div className="text-center py-4">
              <CIcon
                icon={cilCloudUpload}
                size="3xl"
                className="text-info mb-3"
                style={{ height: '60px' }}
              />
              <h3>¿Desea procesar el pedido?</h3>
              <p className="text-muted">
                Se generará un registro para <strong>{formData.cliente}</strong> por un monto de{' '}
                <strong>${total.toFixed(2)}</strong>.
              </p>
              <div className="mt-4 d-flex justify-content-center gap-3">
                <CButton color="secondary" variant="ghost" onClick={closeModal}>
                  Revisar de nuevo
                </CButton>
                <CButton color="success" className="px-5 text-white fw-bold" onClick={savePedido}>
                  Confirmar y Guardar
                </CButton>
              </div>
            </div>
          )}
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default Pedidos
