import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CBadge,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus, cilSearch, cilFilter, cilSave } from '@coreui/icons'

const API_BASE = 'http://localhost:4000'
const API_PRODUCTS = `${API_BASE}/products`

export const Stock = () => {
  // ------------------ ESTADOS ------------------
  const [toasts, setToasts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [productos, setProductos] = useState([])
  const [productoEdit, setProductoEdit] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const [formData, setFormData] = useState({
    Nombre: '',
    Categoria: '',
    Precio_Unit: '',
    Cantidad: '',
    stockMinimo: 0,
    codigo: '',
    Estatus: 'Disponible',
  })

  // ------------------ LOGICA API ------------------
  const cargarProductos = async () => {
    try {
      const resp = await fetch(API_PRODUCTS)
      if (!resp.ok) throw new Error()
      const data = await resp.json()
      setProductos(data)
    } catch (err) {
      showToast('danger', 'Error de conexión con el servidor.')
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])
  }

  // ------------------ MANEJADORES ------------------
  const openModal = (type, producto = null) => {
    setModalType(type)
    if (type === 'edit' && producto) {
      setProductoEdit(producto)
      setFormData({
        Nombre: producto.Nombre || '',
        Categoria: producto.Categoria || '',
        Precio_Unit: producto.Precio_Unit ?? '',
        Cantidad: producto.Cantidad ?? '',
        stockMinimo: producto.stockMinimo ?? 0,
        codigo: producto.codigo || producto.id || '',
        Estatus: producto.Estatus || 'Disponible',
      })
    } else {
      setProductoEdit(null)
      setFormData({
        Nombre: '',
        Categoria: '',
        Precio_Unit: '',
        Cantidad: '',
        stockMinimo: 0,
        codigo: '',
        Estatus: 'Disponible',
      })
    }
    setModalVisible(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const guardarProducto = async () => {
    if (!formData.Nombre.trim() || formData.Precio_Unit === '' || formData.Cantidad === '') {
      showToast('warning', 'Campos obligatorios incompletos.')
      return
    }

    const productoData = {
      ...formData,
      Precio_Unit: Number(formData.Precio_Unit),
      Cantidad: Number(formData.Cantidad),
      stockMinimo: Number(formData.stockMinimo) || 0,
    }

    try {
      const method = modalType === 'edit' ? 'PUT' : 'POST'
      const url = modalType === 'edit' ? `${API_PRODUCTS}/${productoEdit.id}` : API_PRODUCTS
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
      })

      if (resp.ok) {
        showToast('success', `Producto ${modalType === 'edit' ? 'actualizado' : 'guardado'}.`)
        setModalVisible(false)
        cargarProductos()
      }
    } catch (err) {
      showToast('danger', 'Error al procesar la solicitud.')
    }
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      const resp = await fetch(`${API_PRODUCTS}/${id}`, { method: 'DELETE' })
      if (resp.ok) {
        showToast('warning', 'Producto eliminado.')
        cargarProductos()
      }
    } catch (err) {
      showToast('danger', 'Error al eliminar.')
    }
  }

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      (p.Nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      String(p.codigo || p.id)
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    const coincideCat = !categoriaFiltro || p.Categoria === categoriaFiltro
    return coincideBusqueda && coincideCat
  })

  const categorias = [...new Set(productos.map((p) => p.Categoria).filter(Boolean))]

  return (
    <div className="stock-container">
      <CContainer fluid className="py-4">
        {/* HEADER DINÁMICO */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0 text-gradient-primary">Gestión de Inventario</h2>
            <p className="text-secondary small">Monitoreo de existencias en tiempo real</p>
          </div>
          <CButton color="primary" className="shadow-sm fw-bold" onClick={() => openModal('add')}>
            <CIcon icon={cilPlus} className="me-2" /> Nuevo Producto
          </CButton>
        </div>

        {/* FILTROS TIPO DASHBOARD */}
        <CCard className="mb-4 border-0 shadow-sm custom-card">
          <CCardBody>
            <CRow className="g-3">
              <CCol md={7}>
                <CInputGroup>
                  <CInputGroupText className="bg-transparent border-end-0 text-secondary">
                    <CIcon icon={cilSearch} />
                  </CInputGroupText>
                  <CFormInput
                    className="border-start-0 ps-0 search-input"
                    placeholder="Buscar por nombre, código o SKU..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={5}>
                <CInputGroup>
                  <CInputGroupText className="bg-transparent border-end-0 text-secondary">
                    <CIcon icon={cilFilter} />
                  </CInputGroupText>
                  <CFormSelect
                    className="border-start-0 ps-0 filter-select"
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                  >
                    <option value="">Todas las Categorías</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* TABLA ESTILIZADA */}
        <CCard className="border-0 shadow-sm custom-card overflow-hidden">
          <CCardBody className="p-0">
            <div className="table-responsive">
              <CTable hover align="middle" className="mb-0 custom-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="ps-4">Código</CTableHeaderCell>
                    <CTableHeaderCell>Producto</CTableHeaderCell>
                    <CTableHeaderCell>Categoría</CTableHeaderCell>
                    <CTableHeaderCell>Precio</CTableHeaderCell>
                    <CTableHeaderCell>Existencia</CTableHeaderCell>
                    <CTableHeaderCell className="text-center pe-4">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {productosFiltrados.map((producto) => {
                    const stockBajo = Number(producto.Cantidad) <= Number(producto.stockMinimo)
                    return (
                      <CTableRow key={producto.id} className={stockBajo ? 'row-warning' : ''}>
                        <CTableDataCell className="ps-4">
                          <span className="text-secondary fw-medium">
                            {producto.codigo || producto.id}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-bold">{producto.Nombre}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info" variant="outline" className="px-2 py-1">
                            {producto.Categoria || 'General'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="fw-bold text-success">
                          ${Number(producto.Precio_Unit ?? 0).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className={`fw-bold ${stockBajo ? 'text-danger' : 'text-primary'}`}>
                            {producto.Cantidad}
                            <span className="text-secondary fw-normal small ms-1">
                              / min: {producto.stockMinimo}
                            </span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center pe-4">
                          <CButton
                            color="warning"
                            size="sm"
                            variant="ghost"
                            className="me-1"
                            onClick={() => openModal('edit', producto)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            variant="ghost"
                            onClick={() => eliminarProducto(producto.id)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>

        {/* MODAL ADAPTATIVO */}
        <CModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          alignment="center"
          size="lg"
        >
          <CModalHeader className="border-0">
            <CModalTitle className="fw-bold">
              {modalType === 'edit' ? '✏️ Editar Producto' : '📦 Nuevo Producto'}
            </CModalTitle>
          </CModalHeader>
          <CModalBody className="px-4 pb-4">
            <CForm className="row g-3">
              <CCol md={8}>
                <CFormLabel className="fw-bold small">Nombre del Producto *</CFormLabel>
                <CFormInput name="Nombre" value={formData.Nombre} onChange={handleInputChange} />
              </CCol>
              <CCol md={4}>
                <CFormLabel className="fw-bold small">Código / SKU</CFormLabel>
                <CFormInput name="codigo" value={formData.codigo} onChange={handleInputChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-bold small">Categoría</CFormLabel>
                <CFormInput
                  name="Categoria"
                  value={formData.Categoria}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-bold small">Precio Unitario ($)</CFormLabel>
                <CFormInput
                  type="number"
                  name="Precio_Unit"
                  value={formData.Precio_Unit}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-bold small">Stock Actual</CFormLabel>
                <CFormInput
                  type="number"
                  name="Cantidad"
                  value={formData.Cantidad}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-bold small">Stock Mínimo Alerta</CFormLabel>
                <CFormInput
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={12} className="mt-4">
                <CButton
                  color="primary"
                  className="w-100 fw-bold py-2 shadow-sm"
                  onClick={guardarProducto}
                >
                  <CIcon icon={cilSave} className="me-2" />
                  {modalType === 'edit' ? 'Guardar Cambios' : 'Registrar en Inventario'}
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
        </CModal>

        {/* TOASTER */}
        <CToaster placement="top-end">
          {toasts.map((t) => (
            <CToast
              key={t.id}
              autohide
              delay={3000}
              color={t.type}
              visible
              className="text-white border-0 shadow"
            >
              <div className="d-flex">
                <CToastBody className="fw-bold">{t.message}</CToastBody>
                <CButton
                  close
                  className="me-2 m-auto"
                  onClick={() => setToasts(toasts.filter((x) => x.id !== t.id))}
                />
              </div>
            </CToast>
          ))}
        </CToaster>
      </CContainer>

      {/* --- ESTILOS DINÁMICOS CLARO/OSCURO --- */}
      <style jsx>{`
        .stock-container {
          min-height: 100vh;
          background: var(--cui-body-bg);
          transition: all 0.3s ease;
        }

        .text-gradient-primary {
          background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .custom-card {
          background: var(--cui-card-bg);
          border: 1px solid var(--cui-border-color) !important;
          border-radius: 12px;
        }

        .custom-table thead th {
          background-color: var(--cui-tertiary-bg);
          color: var(--cui-secondary-color);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
          border-bottom: 1px solid var(--cui-border-color);
          padding: 15px 10px;
        }

        .custom-table tbody td {
          padding: 15px 10px;
          color: var(--cui-body-color);
          border-bottom: 1px solid var(--cui-border-color);
        }

        .row-warning {
          background-color: rgba(255, 193, 7, 0.05) !important;
        }

        /* Ajuste para inputs en modo oscuro */
        .search-input,
        .filter-select,
        .form-control {
          background-color: var(--cui-input-bg) !important;
          color: var(--cui-input-color) !important;
          border-color: var(--cui-input-border-color) !important;
        }

        .search-input:focus {
          border-color: #20c997 !important;
          box-shadow: 0 0 0 0.25rem rgba(32, 201, 151, 0.2) !important;
        }

        [data-coreui-theme='dark'] .row-warning {
          background-color: rgba(255, 193, 7, 0.1) !important;
        }

        [data-coreui-theme='dark'] .custom-card {
          background: #1d1e22;
        }
      `}</style>
    </div>
  )
}

export default Stock
