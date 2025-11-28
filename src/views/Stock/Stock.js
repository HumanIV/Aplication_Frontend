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
  CCloseButton,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPencil, cilPlus, cilSave, cilCalendar, cilTag, cilNotes } from '@coreui/icons'

const API_BASE = 'http://localhost:3001'
const API_STOCK = `${API_BASE}/api/stock`

export const Stock = () => {
  const [items, setItems] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [itemEdit, setItemEdit] = useState(null)

  const [formData, setFormData] = useState({
    id_product: '',
    movement_type: 'Entrada',
    quantity: '',
    movement_date: new Date().toISOString().split('T')[0],
    note_stock: '',
  })

  const cargarStock = async () => {
    try {
      const resp = await fetch(API_STOCK)
      const data = await resp.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar stock:', err)
    }
  }

  useEffect(() => {
    cargarStock()
  }, [])

  // MANEJADOR DE APERTURA DE MODAL (Corregido para cargar datos)
  const openModal = (type, item = null) => {
    setModalType(type)
    if (type === 'edit' && item) {
      setItemEdit(item)
      setFormData({
        id_product: item.id_product || '',
        movement_type: item.movement_type || 'Entrada',
        quantity: item.quantity || '',
        movement_date: item.movement_date ? item.movement_date.split('T')[0] : '',
        note_stock: item.note_stock || '',
      })
    } else {
      setItemEdit(null)
      setFormData({
        id_product: '',
        movement_type: 'Entrada',
        quantity: '',
        movement_date: new Date().toISOString().split('T')[0],
        note_stock: '',
      })
    }
    setModalVisible(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const guardarCambios = async () => {
    const metodo = modalType === 'edit' ? 'PUT' : 'POST'
    const url = modalType === 'edit' ? `${API_STOCK}/${itemEdit.id_stock}` : API_STOCK

    // Limpieza de datos antes de enviar
    const dataAEnviar = {
      ...formData,
      id_product: parseInt(formData.id_product),
      quantity: parseInt(formData.quantity),
    }

    try {
      const resp = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataAEnviar),
      })

      if (resp.ok) {
        setModalVisible(false)
        cargarStock()
      }
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }

  const eliminarRegistro = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return
    try {
      await fetch(`${API_STOCK}/${id}`, { method: 'DELETE' })
      cargarStock()
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  return (
    <div className="stock-page-wrapper">
      <CContainer fluid className="py-4">
        <div className="header-flex mb-4">
          <h2 className="text-gradient">Gestión de Movimientos</h2>
          <CButton color="primary" className="fw-bold shadow-sm" onClick={() => openModal('add')}>
            <CIcon icon={cilPlus} className="me-2" /> Nuevo Movimiento
          </CButton>
        </div>

        <CCard className="custom-card shadow-sm border-0">
          <CCardBody className="p-0">
            <CTable align="middle" hover responsive className="mb-0">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="ps-4">ID</CTableHeaderCell>
                  <CTableHeaderCell>Producto (ID)</CTableHeaderCell>
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {items.map((item) => (
                  <CTableRow key={item.id_stock}>
                    <CTableDataCell className="ps-4 text-secondary small">
                      #{item.id_stock}
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold">{item.id_product}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={item.movement_type === 'Salida' ? 'danger' : 'success'}>
                        {item.movement_type}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-primary">
                      {item.quantity}
                    </CTableDataCell>
                    <CTableDataCell className="small">
                      {item.movement_date
                        ? new Date(item.movement_date).toLocaleDateString()
                        : 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        variant="ghost"
                        color="warning"
                        size="sm"
                        onClick={() => openModal('edit', item)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        variant="ghost"
                        color="danger"
                        size="sm"
                        onClick={() => eliminarRegistro(item.id_stock)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CContainer>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader className="border-0">
          <CModalTitle className="fw-bold">
            {modalType === 'edit' ? '✏️ Editar Registro' : '📦 Nuevo Movimiento'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="px-4 pb-4">
          <CForm className="row g-3">
            <CCol md={6}>
              <CFormLabel className="small fw-bold">ID Producto</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilTag} />
                </CInputGroupText>
                <CFormInput
                  name="id_product"
                  value={formData.id_product}
                  onChange={handleInputChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormLabel className="small fw-bold">Tipo de Movimiento</CFormLabel>
              <CFormSelect
                name="movement_type"
                value={formData.movement_type}
                onChange={handleInputChange}
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel className="small fw-bold">Cantidad</CFormLabel>
              <CFormInput
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel className="small fw-bold">Fecha</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <CFormInput
                  type="date"
                  name="movement_date"
                  value={formData.movement_date}
                  onChange={handleInputChange}
                />
              </CInputGroup>
            </CCol>
            <CCol md={12}>
              <CFormLabel className="small fw-bold">Notas</CFormLabel>
              <CFormTextarea
                name="note_stock"
                rows={2}
                value={formData.note_stock}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={12} className="mt-4">
              <CButton
                color="primary"
                className="w-100 fw-bold py-2 shadow-sm"
                onClick={guardarCambios}
              >
                <CIcon icon={cilSave} className="me-2" /> Guardar Cambios
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>

      <style>
        {`
          .stock-page-wrapper { background-color: var(--cui-body-bg); min-height: 100vh; }
          .text-gradient {
            background: linear-gradient(90deg, #20c997, #0dcaf0);
            -webkit-background-clip: text;
            -webkit-fill-color: transparent;
            font-weight: 800;
          }
          .header-flex { display: flex; justify-content: space-between; align-items: center; }
          .custom-card { border-radius: 15px; overflow: hidden; background-color: var(--cui-card-bg); }
          [data-coreui-theme='dark'] .custom-card { background-color: #21222d; border: 1px solid #2f303d !important; }
        `}
      </style>
    </div>
  )
}

export default Stock
