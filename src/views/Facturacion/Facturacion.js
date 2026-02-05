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
  CCard,
  CCardBody,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilSearch, cilFile, cilCheckCircle, cilCloudUpload } from '@coreui/icons'

const API_BASE = 'http://localhost:4000'
const API_PEDIDOS = `${API_BASE}/pedidos`
const API_FACTURAS = `${API_BASE}/facturas`

export const Facturacion = () => {
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
  const [pedidoId, setPedidoId] = useState('')
  const [cart, setCart] = useState([])
  const [pedidoDatos, setPedidoDatos] = useState(null)

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])
  }

  const openModal = (type) => {
    setModalType(type)
    setModalVisible(true)
  }

  const cargarPedido = async () => {
    if (!pedidoId.trim()) {
      showToast('warning', 'Ingrese un ID de pedido.')
      return
    }
    try {
      const resp = await fetch(`${API_PEDIDOS}/${pedidoId}`)
      if (!resp.ok) {
        showToast('danger', 'Pedido no encontrado.')
        return
      }
      const pedido = await resp.json()
      const items = pedido.lines ?? pedido.productos ?? []
      const normalized = items.map((it) => ({
        nombre: it.nombre ?? it.producto ?? it.name ?? '',
        cantidad: Number(it.cantidad ?? it.qty ?? 0),
        precio: Number(it.precio ?? it.Precio_Unit ?? it.price ?? 0),
      }))
      setPedidoDatos(pedido)
      setCart(normalized)
      showToast('success', 'Datos de facturación cargados.')
    } catch (err) {
      showToast('danger', 'Error de conexión.')
    }
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
    showToast('warning', 'Ítem removido de la factura.')
  }

  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const impuesto = subtotal * 0.16
  const total = subtotal + impuesto

  const saveItem = async () => {
    const factura = {
      pedidoId,
      productos: cart,
      subtotal,
      impuesto,
      total,
      fecha: new Date().toISOString(),
    }
    try {
      const resp = await fetch(API_FACTURAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factura),
      })
      if (resp.ok) {
        showToast('success', 'Factura emitida con éxito.')
        setModalVisible(false)
        setCart([])
        setPedidoId('')
        setPedidoDatos(null)
      }
    } catch (err) {
      showToast('danger', 'Error al guardar.')
    }
  }

  return (
    <CContainer fluid className="px-4 pb-4 mt-3">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: isDarkMode ? '#fff' : azulVA }}>
          Emisión de <span style={{ color: verdeVA }}>Factura</span>
        </h2>
        <p className="text-muted">Procesamiento legal de pedidos confirmados.</p>
      </div>

      <CRow className="g-4">
        {/* PANEL IZQUIERDO: BUSCADOR Y TABLA */}
        <CCol lg={8}>
          <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
            <CCardBody className="p-4">
              <CFormLabel className="fw-bold small text-uppercase text-muted mb-3">
                Vincular Pedido Existente
              </CFormLabel>
              <CRow className="g-3 align-items-end mb-4">
                <CCol md={8}>
                  <CFormInput
                    placeholder="Ingrese el número de pedido (Ej: 102)..."
                    value={pedidoId}
                    onChange={(e) => setPedidoId(e.target.value)}
                    className="py-2 px-3 rounded-3"
                  />
                </CCol>
                <CCol md={4}>
                  <CButton
                    color="info"
                    className="w-100 text-white py-2 rounded-3 shadow-sm"
                    onClick={cargarPedido}
                  >
                    <CIcon icon={cilSearch} className="me-2" /> Buscar Pedido
                  </CButton>
                </CCol>
              </CRow>

              <h6 className="fw-bold text-uppercase mb-3 mt-2">Detalle de Líneas</h6>
              <div className="table-responsive rounded-4 border">
                <CTable hover align="middle" className="mb-0">
                  <CTableHead className={isDarkMode ? 'bg-dark' : 'bg-light'}>
                    <CTableRow>
                      <CTableHeaderCell className="ps-4">DESCRIPCIÓN</CTableHeaderCell>
                      <CTableHeaderCell>CANT.</CTableHeaderCell>
                      <CTableHeaderCell>PRECIO</CTableHeaderCell>
                      <CTableHeaderCell>SUBTOTAL</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">EXCLUIR</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {cart.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={5} className="text-center py-5 text-muted">
                          No se ha cargado ningún pedido para facturar.
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      cart.map((prod, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="ps-4 fw-medium">{prod.nombre}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="secondary" variant="outline">
                              {prod.cantidad}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>${prod.precio.toFixed(2)}</CTableDataCell>
                          <CTableDataCell className="fw-bold text-primary">
                            ${(prod.precio * prod.cantidad).toFixed(2)}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(index)}
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
            </CCardBody>
          </CCard>
        </CCol>

        {/* PANEL DERECHO: RESUMEN DE TOTALES */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
            <div style={{ backgroundColor: azulVA, padding: '20px' }} className="text-white">
              <h5 className="mb-0 fw-bold">Resumen Fiscal</h5>
            </div>
            <CCardBody className="p-4">
              {pedidoDatos && (
                <div className="mb-4">
                  <p className="small text-muted text-uppercase fw-bold mb-1">Cliente</p>
                  <h6 className="fw-bold mb-0">{pedidoDatos.cliente}</h6>
                  <p className="small mb-0">{pedidoDatos.rif}</p>
                  <hr />
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Base Imponible:</span>
                <span className="fw-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">IVA (16%):</span>
                <span className="fw-bold">${impuesto.toFixed(2)}</span>
              </div>

              <div
                className="p-3 rounded-4 mb-4"
                style={{ backgroundColor: isDarkMode ? 'rgba(88, 204, 125, 0.1)' : '#f0fff4' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">TOTAL</h5>
                  <h3 className="mb-0 fw-bold" style={{ color: verdeVA }}>
                    ${total.toFixed(2)}
                  </h3>
                </div>
              </div>

              <CButton
                color="success"
                size="lg"
                className="w-100 text-white fw-bold rounded-pill shadow-sm"
                disabled={cart.length === 0}
                onClick={() => openModal('save')}
              >
                <CIcon icon={cilFile} className="me-2" /> Generar Factura
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* TOASTER */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast
            key={t.id}
            autohide
            delay={2500}
            color={t.type}
            className="text-white border-0 shadow"
          >
            <CToastHeader closeButton className="bg-transparent text-white">
              <strong className="me-auto">V&A Facturación</strong>
            </CToastHeader>
            <CToastBody>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* MODAL DE CONFIRMACIÓN FISCAL */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        alignment="center"
        size="lg"
        backdrop="static"
      >
        <CModalHeader style={{ backgroundColor: azulVA }} className="text-white border-0">
          <CModalTitle className="fw-bold">Revisión de Documento Fiscal</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4">
          {modalType === 'save' && pedidoDatos && (
            <>
              <div className="alert alert-info border-0 rounded-4 p-3 mb-4">
                <CIcon icon={cilCheckCircle} className="me-2" />
                Verifique los datos antes de proceder. Esta acción generará una factura legal.
              </div>

              <CRow>
                <CCol md={6}>
                  <h6 className="fw-bold text-uppercase small text-muted">Datos Fiscales</h6>
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Razón Social:</strong> {pedidoDatos.cliente}
                    </p>
                    <p className="mb-1">
                      <strong>RIF:</strong> {pedidoDatos.rif}
                    </p>
                    <p className="mb-1">
                      <strong>Dirección:</strong> {pedidoDatos.direccionFactura}
                    </p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <h6 className="fw-bold text-uppercase small text-muted">Condiciones</h6>
                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Pago:</strong> {pedidoDatos.terminosPago}
                    </p>
                    <p className="mb-1">
                      <strong>Tasa:</strong> {pedidoDatos.tasa}
                    </p>
                    <p className="mb-1">
                      <strong>Transporte:</strong> {pedidoDatos.transporte}
                    </p>
                  </div>
                </CCol>
              </CRow>

              <div className="bg-light p-3 rounded-4 border mb-4 mt-2">
                <h6 className="fw-bold mb-3 text-dark">Artículos a Facturar</h6>
                {cart.map((line, idx) => (
                  <div key={idx} className="d-flex justify-content-between border-bottom pb-2 mb-2">
                    <span className="text-dark small">
                      {line.cantidad}x {line.nombre}
                    </span>
                    <span className="fw-bold text-dark small">
                      ${(line.precio * line.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="text-end pt-2">
                  <h5 className="fw-bold text-dark">Monto Final: ${total.toFixed(2)}</h5>
                </div>
              </div>

              <div className="d-flex gap-2">
                <CButton
                  color="secondary"
                  variant="ghost"
                  className="w-100 py-2"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </CButton>
                <CButton
                  color="success"
                  className="w-100 py-2 text-white fw-bold shadow"
                  onClick={saveItem}
                >
                  <CIcon icon={cilCloudUpload} className="me-2" /> Confirmar y Emitir
                </CButton>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default Facturacion
