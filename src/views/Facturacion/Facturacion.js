import React, { useState, useEffect, useRef } from 'react'
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
  CFormSelect,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilSearch, cilFile, cilCheckCircle, cilCloudUpload, cilFilter, cilPrint } from '@coreui/icons'
import { invoiceApi } from '../../api/invoice.api'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

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
  const [pedidosPendientes, setPedidosPendientes] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('Contado')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPedidos, setFilteredPedidos] = useState([])
  const [generatingInvoice, setGeneratingInvoice] = useState(false)
  const [generatedInvoice, setGeneratedInvoice] = useState(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')

  // Ref para capturar el modal como imagen para PDF
  const modalRef = useRef(null)

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])
  }

  const openModal = (type) => {
    setModalType(type)
    setModalVisible(true)
  }

  // Cargar pedidos pendientes al iniciar
  useEffect(() => {
    loadPendingOrders()
  }, [])

  // Filtrar pedidos cuando cambia searchTerm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPedidos(pedidosPendientes)
    } else {
      const filtered = pedidosPendientes.filter(pedido => {
        const searchLower = searchTerm.toLowerCase()
        return (
          (pedido.customer_name && pedido.customer_name.toLowerCase().includes(searchLower)) ||
          (pedido.id_order && pedido.id_order.toString().includes(searchTerm)) ||
          (pedido.customer_rif && pedido.customer_rif.toLowerCase().includes(searchLower))
        )
      })
      setFilteredPedidos(filtered)
    }
  }, [searchTerm, pedidosPendientes])

  const loadPendingOrders = async () => {
    try {
      setLoading(true)
      const response = await invoiceApi.getPendingOrdersRequest()
      if (response.ok) {
        const orders = response.orders || []
        setPedidosPendientes(orders)
        setFilteredPedidos(orders)
      }
    } catch (error) {
      console.error('Error al cargar pedidos pendientes:', error)
      showToast('danger', 'Error al cargar pedidos pendientes')
    } finally {
      setLoading(false)
    }
  }

  const cargarPedido = async () => {
    // Si hay un pedido seleccionado de la lista, usar su ID
    const orderIdToLoad = selectedOrder ? selectedOrder.id_order : pedidoId
    
    if (!orderIdToLoad) {
      showToast('warning', 'Seleccione o ingrese un ID de pedido.')
      return
    }
    
    try {
      setLoading(true)
      const response = await invoiceApi.getOrderForInvoiceRequest(orderIdToLoad)
      
      if (!response.ok) {
        showToast('danger', response.msg || 'Pedido no encontrado.')
        return
      }

      const pedido = response.order
      
      // Normalizar datos del cliente
      const clienteNombre = pedido.customer_name || 
                           pedido.cliente || 
                           `${pedido.first_name || ''} ${pedido.last_name || ''}`.trim() ||
                           'Cliente sin nombre'
      
      const clienteRif = pedido.customer_rif || 
                        pedido.rif || 
                        pedido.dni || 
                        'Sin RIF'
      
      const clienteEmail = pedido.customer_email || 
                         pedido.email || 
                         ''
      
      const clienteAddress = pedido.customer_address || 
                           pedido.address || 
                           'Sin dirección'
      
      const clientePhone = pedido.customer_phone || 
                          pedido.phone_number || 
                          'Sin teléfono'

      // Normalizar líneas del pedido
      const items = pedido.lines || []
      const normalized = items.map((it) => ({
        id_product: it.id_product,
        nombre: it.product_name || it.name_product || it.nombre || it.product_description || 'Producto',
        cantidad: Number(it.quantity || it.cantidad || 1),
        precio: Number(it.unit_price || it.product_price || it.price || 0),
        line_total: it.line_total || (Number(it.quantity || 1) * Number(it.product_price || 0))
      }))

      // Estructurar datos del pedido
      const pedidoNormalizado = {
        ...pedido,
        id_order: pedido.id_order || orderIdToLoad,
        cliente: clienteNombre,
        rif: clienteRif,
        email: clienteEmail,
        direccionFactura: clienteAddress,
        telefono: clientePhone,
        employee_name: pedido.employee_name || '',
        order_date: pedido.order_date || new Date().toISOString().split('T')[0],
        state: pedido.state || 'pending'
      }

      setPedidoDatos(pedidoNormalizado)
      setCart(normalized)
      setPedidoId(orderIdToLoad.toString()) // Asegurar que sea string
      showToast('success', `Pedido #${orderIdToLoad} cargado correctamente.`)
    } catch (error) {
      console.error('Error al cargar pedido:', error)
      showToast('danger', 'Error al conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const selectPendingOrder = (order) => {
    setSelectedOrder(order)
    setPedidoId(order.id_order.toString())
    showToast('info', `Pedido #${order.id_order} seleccionado.`)
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
    showToast('warning', 'Ítem removido de la factura.')
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
  const impuesto = subtotal * 0.16
  const total = subtotal + impuesto

  const generarFactura = async () => {
    if (cart.length === 0) {
      showToast('warning', 'No hay productos para facturar.')
      return
    }

    const orderIdToUse = selectedOrder ? selectedOrder.id_order : pedidoId
    if (!orderIdToUse) {
      showToast('warning', 'No hay un pedido seleccionado.')
      return
    }

    try {
      setGeneratingInvoice(true)
      // Preparar datos de la factura según tu API
      const invoiceData = {
        id_order: orderIdToUse,
        lines: cart.map(item => ({
          id_product: item.id_product,
          quantity: item.cantidad,
          unit_price: item.precio,
          line_total: item.precio * item.cantidad
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(impuesto.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        payment_method: paymentMethod,
        notes: notes
      }

      console.log('📤 Enviando datos de factura:', invoiceData)
      
      const response = await invoiceApi.createInvoiceRequest(invoiceData)

      if (response.ok) {
        setInvoiceNumber(response.invoice_number)
        setGeneratedInvoice({
          ...invoiceData,
          invoice_number: response.invoice_number,
          issue_date: new Date().toISOString(),
          customer: pedidoDatos,
        })
        
        showToast('success', `✅ Factura creada exitosamente. Número: ${response.invoice_number}`)
        
        // Limpiar estado
        setModalVisible(false)
        setCart([])
        setPedidoId('')
        setPedidoDatos(null)
        setSelectedOrder(null)
        setPaymentMethod('Contado')
        setNotes('')
        setSearchTerm('')
        
        // Recargar pedidos pendientes
        await loadPendingOrders()
        
        // Mostrar opción para descargar PDF
        setTimeout(() => {
          showToast('info', '¿Desea descargar la factura en PDF? Haga clic en "Descargar PDF"')
        }, 2000)
      } else {
        showToast('danger', response.msg || 'Error al crear factura.')
      }
    } catch (error) {
      console.error('Error al generar factura:', error)
      showToast('danger', 'Error al conectar con el servidor.')
    } finally {
      setGeneratingInvoice(false)
    }
  }

  const generarPDF = () => {
    if (!generatedInvoice || !generatedInvoice.customer) {
      showToast('warning', 'No hay factura generada para descargar.')
      return
    }

    try {
      setLoading(true)
      
      // Crear nuevo documento PDF
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      
      // Configurar fuente y tamaño base
      doc.setFont('helvetica')
      doc.setFontSize(10)
      
      // --- ENCABEZADO DE LA FACTURA ---
      doc.setFillColor(0, 45, 114) // Azul V&A
      doc.rect(0, 0, pageWidth, 40, 'F')
      
      // Logo y nombre de la empresa
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('V&A IMPORTACIONES', pageWidth / 2, 15, { align: 'center' })
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.text('Sistema de Facturación', pageWidth / 2, 25, { align: 'center' })
      
      doc.setFontSize(10)
      doc.text('RIF: J-12345678-9', pageWidth / 2, 32, { align: 'center' })
      
      // --- INFORMACIÓN DE LA FACTURA ---
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('FACTURA', margin, 55)
      
      // Número de factura y fecha
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`N°: ${invoiceNumber || generatedInvoice.invoice_number || 'FACT-0001'}`, pageWidth - margin, 55, { align: 'right' })
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin, 60, { align: 'right' })
      
      // --- INFORMACIÓN DEL CLIENTE ---
      doc.setFont('helvetica', 'bold')
      doc.text('DATOS DEL CLIENTE', margin, 75)
      
      doc.setFont('helvetica', 'normal')
      doc.text(`Cliente: ${generatedInvoice.customer.cliente || 'N/A'}`, margin, 82)
      doc.text(`RIF: ${generatedInvoice.customer.rif || 'N/A'}`, margin, 87)
      doc.text(`Dirección: ${generatedInvoice.customer.direccionFactura || 'N/A'}`, margin, 92)
      doc.text(`Email: ${generatedInvoice.customer.email || 'N/A'}`, margin, 97)
      doc.text(`Teléfono: ${generatedInvoice.customer.telefono || 'N/A'}`, margin, 102)
      
      // --- INFORMACIÓN DEL PEDIDO ---
      doc.setFont('helvetica', 'bold')
      doc.text('DATOS DEL PEDIDO', pageWidth / 2, 75)
      
      doc.setFont('helvetica', 'normal')
      doc.text(`Pedido #: ${generatedInvoice.id_order}`, pageWidth / 2, 82)
      doc.text(`Fecha Pedido: ${formatDate(generatedInvoice.customer.order_date)}`, pageWidth / 2, 87)
      doc.text(`Método de Pago: ${generatedInvoice.payment_method}`, pageWidth / 2, 92)
      doc.text(`Vendedor: ${generatedInvoice.customer.employee_name || 'N/A'}`, pageWidth / 2, 97)
      
      // --- TABLA DE PRODUCTOS ---
      const startY = 115
      
      // Encabezado de la tabla
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, startY, pageWidth - (margin * 2), 10, 'F')
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.text('Producto', margin + 5, startY + 7)
      doc.text('Cant.', margin + 100, startY + 7)
      doc.text('Precio Unit.', margin + 130, startY + 7)
      doc.text('Subtotal', margin + 170, startY + 7)
      
      // Líneas de productos
      let currentY = startY + 15
      doc.setFont('helvetica', 'normal')
      
      cart.forEach((item, index) => {
        if (currentY > pageHeight - 60) {
          doc.addPage()
          currentY = margin + 15
        }
        
        doc.text(item.nombre.substring(0, 40), margin + 5, currentY)
        doc.text(item.cantidad.toString(), margin + 100, currentY)
        doc.text(`$${item.precio.toFixed(2)}`, margin + 130, currentY)
        doc.text(`$${(item.precio * item.cantidad).toFixed(2)}`, margin + 170, currentY)
        
        currentY += 8
      })
      
      // --- TOTALES ---
      const totalY = currentY + 10
      
      doc.setFont('helvetica', 'bold')
      doc.text('RESUMEN DE TOTALES', margin, totalY)
      
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, totalY + 5, pageWidth - margin, totalY + 5)
      
      doc.setFont('helvetica', 'normal')
      doc.text('Base Imponible:', margin + 100, totalY + 15)
      doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin, totalY + 15, { align: 'right' })
      
      doc.text('IVA (16%):', margin + 100, totalY + 23)
      doc.text(`$${impuesto.toFixed(2)}`, pageWidth - margin, totalY + 23, { align: 'right' })
      
      doc.setFont('helvetica', 'bold')
      doc.text('TOTAL:', margin + 100, totalY + 33)
      doc.setTextColor(88, 204, 125) // Verde V&A
      doc.text(`$${total.toFixed(2)}`, pageWidth - margin, totalY + 33, { align: 'right' })
      
      // --- NOTAS Y PIE DE PÁGINA ---
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      
      if (generatedInvoice.notes) {
        doc.text(`Notas: ${generatedInvoice.notes}`, margin, pageHeight - 30, { maxWidth: pageWidth - (margin * 2) })
      }
      
      doc.text('Gracias por su compra. Esta factura es un documento legal.', margin, pageHeight - 20)
      doc.text('V&A IMPORTACIONES - Todos los derechos reservados', margin, pageHeight - 15)
      doc.text('Tel: (123) 456-7890 | Email: contacto@vaimportaciones.com', margin, pageHeight - 10)
      
      // Guardar PDF
      const fileName = `factura_${invoiceNumber || generatedInvoice.invoice_number || 'temp'}.pdf`
      doc.save(fileName)
      
      showToast('success', '✅ PDF generado y descargado exitosamente.')
    } catch (error) {
      console.error('Error al generar PDF:', error)
      showToast('danger', 'Error al generar el PDF.')
    } finally {
      setLoading(false)
    }
  }

  const generarPDFDesdeModal = async () => {
    if (!modalRef.current) {
      showToast('warning', 'No se puede capturar la vista previa.')
      return
    }

    try {
      setLoading(true)
      
      // Capturar el contenido del modal como imagen
      const canvas = await html2canvas(modalRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      
      // Crear PDF
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      
      // Calcular dimensiones de la imagen
      const imgWidth = pageWidth - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Agregar imagen al PDF
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      
      // Agregar información adicional
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Factura generada: ${new Date().toLocaleString()}`, 10, imgHeight + 20)
      doc.text(`Número de factura: ${invoiceNumber || 'Pendiente'}`, 10, imgHeight + 25)
      
      // Guardar PDF
      const fileName = `factura_previsualizacion_${new Date().getTime()}.pdf`
      doc.save(fileName)
      
      showToast('success', '✅ Previsualización descargada en PDF.')
    } catch (error) {
      console.error('Error al generar PDF desde modal:', error)
      showToast('danger', 'Error al generar PDF desde vista previa.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return dateString
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
              {/* BÚSQUEDA POR NOMBRE O ID */}
              <div className="mb-4">
                <CFormLabel className="fw-bold small text-uppercase text-muted mb-3">
                  Búsqueda de Pedidos
                </CFormLabel>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilFilter} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Buscar por nombre de cliente, RIF o ID de pedido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-3"
                    disabled={loading}
                  />
                  <CButton 
                    color="secondary" 
                    onClick={() => setSearchTerm('')}
                    disabled={!searchTerm || loading}
                  >
                    Limpiar
                  </CButton>
                </CInputGroup>
              </div>

              {/* Lista de pedidos pendientes */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CFormLabel className="fw-bold small text-uppercase text-muted mb-0">
                    Pedidos Pendientes de Facturar
                  </CFormLabel>
                  <div className="d-flex align-items-center gap-2">
                    {loading && <CSpinner size="sm" />}
                    <CBadge color="info" shape="rounded-pill">
                      {filteredPedidos.length} encontrados
                    </CBadge>
                  </div>
                </div>
                
                {filteredPedidos.length > 0 ? (
                  <div className="border rounded-4 p-3 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredPedidos.map((order) => (
                      <div 
                        key={order.id_order} 
                        className={`d-flex justify-content-between align-items-center mb-2 p-3 rounded-3 cursor-pointer ${selectedOrder?.id_order === order.id_order ? 'bg-info bg-opacity-25 border border-info' : 'hover-bg'}`}
                        onClick={() => selectPendingOrder(order)}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: selectedOrder?.id_order === order.id_order ? '2px solid var(--cui-info)' : '1px solid transparent'
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <CBadge color="warning" className="me-3">
                            #{order.id_order}
                          </CBadge>
                          <div>
                            <div className="fw-bold">{order.customer_name || 'Cliente'}</div>
                            <small className="text-muted">RIF: {order.customer_rif || 'No disponible'}</small>
                            <br />
                            <small className="text-muted">
                              <strong>Total:</strong> ${Number(order.total || 0).toFixed(2)}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted d-block">
                            {formatDate(order.order_date)}
                          </small>
                          <CBadge color="success" shape="rounded-pill">
                            Listo
                          </CBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-muted border rounded-4">
                    {loading ? 'Cargando pedidos...' : 'No se encontraron pedidos pendientes'}
                  </div>
                )}
              </div>

              {/* Búsqueda manual por ID */}
              <CFormLabel className="fw-bold small text-uppercase text-muted mb-3">
                O buscar manualmente por ID
              </CFormLabel>
              <CRow className="g-3 align-items-end mb-4">
                <CCol md={8}>
                  <CFormInput
                    placeholder="Ingrese el ID del pedido..."
                    value={pedidoId}
                    onChange={(e) => {
                      setPedidoId(e.target.value)
                      setSelectedOrder(null) // Limpiar selección si se escribe manualmente
                    }}
                    className="py-2 px-3 rounded-3"
                    disabled={loading}
                  />
                </CCol>
                <CCol md={4}>
                  <CButton
                    color="info"
                    className="w-100 text-white py-2 rounded-3 shadow-sm"
                    onClick={cargarPedido}
                    disabled={loading || (!pedidoId && !selectedOrder)}
                  >
                    {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} className="me-2" />}
                    {loading ? 'Cargando...' : 'Cargar Pedido'}
                  </CButton>
                </CCol>
              </CRow>

              {cart.length > 0 && (
                <>
                  <h6 className="fw-bold text-uppercase mb-3 mt-2">Detalle de Líneas</h6>
                  <div className="table-responsive rounded-4 border">
                    <CTable hover align="middle" className="mb-0">
                      <CTableHead className={isDarkMode ? 'bg-dark' : 'bg-light'}>
                        <CTableRow>
                          <CTableHeaderCell className="ps-4">PRODUCTO</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">CANT.</CTableHeaderCell>
                          <CTableHeaderCell className="text-end">PRECIO UNIT.</CTableHeaderCell>
                          <CTableHeaderCell className="text-end">SUBTOTAL</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">ACCIÓN</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {cart.map((prod, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell className="ps-4 fw-medium">{prod.nombre}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CBadge color="secondary" variant="outline">
                                {prod.cantidad}
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">${prod.precio.toFixed(2)}</CTableDataCell>
                            <CTableDataCell className="text-end fw-bold text-primary">
                              ${(prod.precio * prod.cantidad).toFixed(2)}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButton
                                color="danger"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(index)}
                                disabled={loading}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                        <CTableRow>
                          <CTableDataCell colSpan={3} className="text-end fw-bold">
                            Subtotal:
                          </CTableDataCell>
                          <CTableDataCell className="text-end fw-bold">
                            ${subtotal.toFixed(2)}
                          </CTableDataCell>
                          <CTableDataCell></CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan={3} className="text-end">
                            IVA (16%):
                          </CTableDataCell>
                          <CTableDataCell className="text-end">
                            ${impuesto.toFixed(2)}
                          </CTableDataCell>
                          <CTableDataCell></CTableDataCell>
                        </CTableRow>
                        <CTableRow className="fw-bold">
                          <CTableDataCell colSpan={3} className="text-end">
                            TOTAL:
                          </CTableDataCell>
                          <CTableDataCell className="text-end" style={{ color: verdeVA }}>
                            ${total.toFixed(2)}
                          </CTableDataCell>
                          <CTableDataCell></CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </div>

                  {/* Configuración adicional de factura */}
                  <div className="mt-4">
                    <CRow className="g-3">
                      <CCol md={6}>
                        <CFormLabel className="fw-bold small text-muted">Método de Pago</CFormLabel>
                        <CFormSelect
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="rounded-3"
                          disabled={loading}
                        >
                          <option value="Contado">Contado</option>
                          <option value="Crédito">Crédito</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel className="fw-bold small text-muted">Notas (Opcional)</CFormLabel>
                        <CFormInput
                          placeholder="Notas adicionales..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="rounded-3"
                          disabled={loading}
                        />
                      </CCol>
                    </CRow>
                  </div>
                </>
              )}
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
                  <h6 className="fw-bold mb-2">{pedidoDatos.cliente}</h6>
                  <div className="small">
                    <p className="mb-1">
                      <strong>RIF:</strong> {pedidoDatos.rif}
                    </p>
                    {pedidoDatos.email && (
                      <p className="mb-1">
                        <strong>Email:</strong> {pedidoDatos.email}
                      </p>
                    )}
                    {pedidoDatos.telefono && (
                      <p className="mb-1">
                        <strong>Tel:</strong> {pedidoDatos.telefono}
                      </p>
                    )}
                    <p className="mb-1">
                      <strong>Dirección:</strong> {pedidoDatos.direccionFactura}
                    </p>
                  </div>
                  <hr />
                  <div className="small">
                    <p className="mb-1">
                      <strong>Pedido #:</strong> {pedidoDatos.id_order}
                    </p>
                    <p className="mb-1">
                      <strong>Fecha:</strong> {formatDate(pedidoDatos.order_date)}
                    </p>
                    <p className="mb-1">
                      <strong>Estado:</strong> <CBadge color="warning">{pedidoDatos.state}</CBadge>
                    </p>
                  </div>
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
                className="w-100 text-white fw-bold rounded-pill shadow-sm mb-3"
                disabled={cart.length === 0 || loading || generatingInvoice}
                onClick={() => openModal('save')}
              >
                {generatingInvoice ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Generando...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilFile} className="me-2" />
                    Generar Factura
                  </>
                )}
              </CButton>

              {/* Botón para descargar PDF si hay factura generada */}
              {generatedInvoice && (
                <CButton
                  color="primary"
                  size="lg"
                  className="w-100 text-white fw-bold rounded-pill shadow-sm"
                  onClick={generarPDF}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilPrint} className="me-2" />
                      Descargar PDF
                    </>
                  )}
                </CButton>
              )}
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
            delay={3000}
            color={t.type}
            className="text-white border-0 shadow"
            onClose={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
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
          <CModalTitle className="fw-bold">Confirmar Emisión de Factura</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4" ref={modalRef}>
          {modalType === 'save' && pedidoDatos && (
            <>
              <div className="alert alert-info border-0 rounded-4 p-3 mb-4">
                <CIcon icon={cilCheckCircle} className="me-2" />
                Revise cuidadosamente los datos antes de generar la factura legal.
              </div>

              <div className="text-center mb-4">
                <h4 style={{ color: azulVA }}>V&A IMPORTACIONES</h4>
                <h5 style={{ color: verdeVA }}>FACTURA</h5>
                {invoiceNumber && (
                  <p className="fw-bold">Número de Factura: {invoiceNumber}</p>
                )}
                <p className="text-muted">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
              </div>

              <CRow>
                <CCol md={6}>
                  <h6 className="fw-bold text-uppercase small text-muted mb-3">Datos Fiscales del Cliente</h6>
                  <div className="card border mb-3">
                    <div className="card-body">
                      <p className="mb-2">
                        <strong>Razón Social:</strong> {pedidoDatos.cliente}
                      </p>
                      <p className="mb-2">
                        <strong>RIF:</strong> {pedidoDatos.rif}
                      </p>
                      <p className="mb-2">
                        <strong>Dirección Fiscal:</strong> {pedidoDatos.direccionFactura}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {pedidoDatos.email}
                      </p>
                      <p className="mb-2">
                        <strong>Teléfono:</strong> {pedidoDatos.telefono}
                      </p>
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <h6 className="fw-bold text-uppercase small text-muted mb-3">Información de Factura</h6>
                  <div className="card border mb-3">
                    <div className="card-body">
                      <p className="mb-2">
                        <strong>Pedido #:</strong> {pedidoDatos.id_order}
                      </p>
                      <p className="mb-2">
                        <strong>Fecha del Pedido:</strong> {formatDate(pedidoDatos.order_date)}
                      </p>
                      <p className="mb-2">
                        <strong>Método de Pago:</strong> {paymentMethod}
                      </p>
                      <p className="mb-2">
                        <strong>Vendedor:</strong> {pedidoDatos.employee_name || 'No especificado'}
                      </p>
                      <p className="mb-2">
                        <strong>Estado:</strong> <CBadge color="warning">{pedidoDatos.state}</CBadge>
                      </p>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <div className="card border mb-4">
                <div className="card-header">
                  <h6 className="fw-bold mb-0">Artículos a Facturar</h6>
                </div>
                <div className="card-body p-0">
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Descripción del Producto</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Cantidad</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Precio Unitario</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Subtotal</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {cart.map((line, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{line.nombre}</CTableDataCell>
                          <CTableDataCell className="text-center">{line.cantidad}</CTableDataCell>
                          <CTableDataCell className="text-end">${line.precio.toFixed(2)}</CTableDataCell>
                          <CTableDataCell className="text-end">${(line.precio * line.cantidad).toFixed(2)}</CTableDataCell>
                        </CTableRow>
                      ))}
                      <CTableRow >
                        <CTableDataCell colSpan={3} className="text-end fw-bold">
                          Subtotal:
                        </CTableDataCell>
                        <CTableDataCell className="text-end fw-bold">
                          ${subtotal.toFixed(2)}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell colSpan={3} className="text-end">
                          IVA (16%):
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          ${impuesto.toFixed(2)}
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow className="fw-bold">
                        <CTableDataCell colSpan={3} className="text-end">
                          TOTAL A PAGAR:
                        </CTableDataCell>
                        <CTableDataCell className="text-end" style={{ color: verdeVA }}>
                          ${total.toFixed(2)}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </div>
              </div>

              {notes && (
                <div className="alert alert-warning border-0 rounded-4 mb-4">
                  <strong>Notas adicionales:</strong> {notes}
                </div>
              )}

              <div className="d-flex gap-2">
                <CButton
                  color="secondary"
                  variant="ghost"
                  className="w-100 py-2"
                  onClick={() => setModalVisible(false)}
                  disabled={generatingInvoice}
                >
                  Cancelar
                </CButton>
                <CButton
                  color="success"
                  className="w-100 py-2 text-white fw-bold shadow"
                  onClick={generarFactura}
                  disabled={generatingInvoice}
                >
                  {generatingInvoice ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Generando Factura...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      Confirmar y Emitir Factura
                    </>
                  )}
                </CButton>
              </div>

              {/* Opción para descargar previsualización */}
              <div className="mt-3 text-center">
                <CButton
                  color="info"
                  variant="outline"
                  className="w-100"
                  onClick={generarPDFDesdeModal}
                  disabled={loading}
                >
                  <CIcon icon={cilPrint} className="me-2" />
                  Descargar Previsualización en PDF
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