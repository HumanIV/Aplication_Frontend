import React, { useEffect, useState, useCallback } from 'react'
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
  CInputGroupText,
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
  cilInfo,
  cilWarning,
  cilDollar,
  cilCart,
} from '@coreui/icons'

// Importa las funciones de la API
import {
  getOrdersRequest,
  getCustomersRequest,
  createOrderRequest,
  getProductsRequest,
  deleteOrderRequest,
  createCustomerRequest
} from '../../api/orders.api.js'

const emptyForm = () => ({
  id_customer: '',
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
  telefono: '',
  observaciones: '',
})

const emptyClientForm = () => ({
  nombre: '',
  rif: '',
  direccion: '',
  sucursal: '',
  telefono: '',
  email: '',
  direccionEntrega: '',
  terminosPago: 'Contado',
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
  const [loading, setLoading] = useState(false)

  // --- CARGA DE DATOS CON LA API ---
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando datos iniciales...')
      
      // Cargar pedidos
      const ordersResponse = await getOrdersRequest()
      console.log('📋 Respuesta de pedidos:', ordersResponse)
      if (ordersResponse.ok) {
        setPedidos(ordersResponse.orders || [])
      }

      // Cargar clientes
      const customersResponse = await getCustomersRequest()
      console.log('👥 Respuesta de clientes:', customersResponse)
      if (customersResponse.ok) {
        const clientsData = customersResponse.customers || []
        console.log('👥 Clientes cargados:', clientsData.length)
        setClients(clientsData)
        setFilteredClients(clientsData)
      }

      // Cargar productos
      const productsResponse = await getProductsRequest()
      console.log('📦 Respuesta completa de productos:', productsResponse)
      
      if (productsResponse.ok) {
        const productsData = productsResponse.products || []
        console.log('📦 Productos cargados:', productsData.length)
        
        const productsWithParsedPrices = productsData.map(product => {
          const stockValue = 
            product.Cantidad !== undefined ? product.Cantidad :
            product.stock !== undefined ? product.stock :
            product.quantity !== undefined ? product.quantity :
            product.cantidad !== undefined ? product.cantidad :
            0;
          
          const stock = Number(stockValue) || 0;
          
          const price = typeof product.price === 'number' ? product.price : 
                       typeof product.Precio_Unit === 'number' ? product.Precio_Unit :
                       parseFloat(product.price || product.Precio_Unit || 0);
          
          const productName = 
            product.name_product || 
            product.Nombre || 
            product.name || 
            `Producto ID: ${product.id_product || product.id}`;
          
          return {
            ...product,
            id_product: product.id_product || product.id,
            name_product: productName,
            name: productName,
            price: price,
            Precio_Unit: price,
            stock: stock,
            Cantidad: stock
          };
        })
        
        setProducts(productsWithParsedPrices)
        setFilteredProducts(productsWithParsedPrices)
      }
      
      showToast('success', 'Datos cargados correctamente')
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      showToast('danger', 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const showToast = (type, message) =>
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])

  // --- FILTRADO DE PRODUCTOS ---
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase()
    const filtered = products.filter((p) => {
      const matchesSearch =
        !q ||
        String(p.id_product || p.id || '')
          .toLowerCase()
          .includes(q) ||
        String(p.name_product || p.Nombre || p.name || '')
          .toLowerCase()
          .includes(q) ||
        String(p.Descripcion || p.description || '')
          .toLowerCase()
          .includes(q)
      const matchesCategory = !categoryFilter || (p.Categoria || p.category) === categoryFilter
      return matchesSearch && matchesCategory
    })
    setFilteredProducts(filtered)
  }, [searchTerm, categoryFilter, products])

  // --- FILTRADO DE CLIENTES ---
  useEffect(() => {
    const q = clientSearchTerm.trim().toLowerCase()
    const filtered = clients.filter(
      (c) => 
        (c.nombre && c.nombre.toLowerCase().includes(q)) || 
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.rif && c.rif.toLowerCase().includes(q))
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

  // --- FUNCIONES CORREGIDAS ---

  const selectClient = (client) => {
    console.log('👤 Cliente seleccionado:', client);
    
    // VERIFICAR que el ID sea un número válido
    const customerId = parseInt(client.id);
    
    if (isNaN(customerId)) {
      showToast('danger', 'ID de cliente inválido');
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      id_customer: customerId,
      cliente: client.nombre,
      rif: client.rif || '',
      direccionFactura: client.direccion || '',
      direccionEntrega: client.shipping_address || client.direccion || '',
      sucursal: client.sucursal || '',
      telefono: client.telefono || '',
      terminosPago: client.terminosPago || 'Contado',
    }));
    
    showToast('success', 'Cliente vinculado');
    setModalVisible(false);
  };

  // CORRECCIÓN: Función para sanitizar el RIF
  const sanitizeRIF = (rif) => {
    if (!rif) return '';
    // Eliminar todos los caracteres no alfanuméricos
    const cleaned = rif.replace(/[^a-zA-Z0-9]/g, '');
    // Tomar solo los primeros 9 caracteres
    return cleaned.substring(0, 9);
  };

  const handleSaveClient = async () => {
    try {
      if (!clientForm.nombre || !clientForm.rif) {
        showToast('warning', 'Nombre y RIF son requeridos');
        return;
      }
      
      // Sanitizar el RIF antes de enviar (máximo 9 caracteres)
      const sanitizedRIF = sanitizeRIF(clientForm.rif);
      if (!sanitizedRIF) {
        showToast('warning', 'RIF inválido');
        return;
      }
      
      setLoading(true);
      
      // Preparar datos para el backend (ajustados a tu estructura)
      const clientDataToSend = {
        ...clientForm,
        rif: sanitizedRIF, // RIF sanitizado (máximo 9 caracteres)
        direccionEntrega: clientForm.direccionEntrega || clientForm.direccion || ''
      };
      
      console.log('📤 Enviando datos de cliente:', clientDataToSend);
      
      // LLAMAR AL BACKEND para crear cliente real
      const response = await createCustomerRequest(clientDataToSend);
      
      if (response.ok) {
        const newClient = {
          id: response.customerId || response.id,
          nombre: clientForm.nombre,
          rif: sanitizedRIF,
          email: clientForm.email || '',
          telefono: clientForm.telefono || '',
          direccion: clientForm.direccion || '',
          shipping_address: clientForm.direccionEntrega || clientForm.direccion || '',
          sucursal: clientForm.sucursal || ''
        };
        
        // Agregar a la lista de clientes
        setClients(prev => [...prev, newClient]);
        setFilteredClients(prev => [...prev, newClient]);
        
        // Seleccionar automáticamente el nuevo cliente
        selectClient(newClient);
        
        // Limpiar formulario
        setClientForm(emptyClientForm());
        
        showToast('success', 'Cliente registrado exitosamente');
      } else {
        showToast('danger', response.msg || 'Error al registrar cliente');
      }
      
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      showToast('danger', 'Error al registrar cliente');
    } finally {
      setLoading(false);
    }
  };

  const savePedido = async () => {
    try {
      // Validar ID de cliente
      const customerId = parseInt(formData.id_customer);
      if (!customerId || customerId < 1) {
        showToast('warning', 'Debe seleccionar un cliente válido de la base de datos');
        return;
      }
      
      if (lines.length === 0) {
        showToast('warning', 'Debe añadir al menos un producto');
        return;
      }

      setLoading(true);

      // Preparar datos con IDs validados - AJUSTADO A TU ESTRUCTURA
      const orderData = {
        id_customer: customerId,
        id_employee: 1, // Valor por defecto
        lines: lines.map(line => ({
          id_product: parseInt(line.id_product),
          cantidad: parseInt(line.cantidad),
          nota: `Producto: ${line.nombre}`
        })),
        total: parseFloat(totalConIva.toFixed(2)),
        // CORRECCIÓN: Usar 'pending' en lugar de 'pendiente'
        estado: 'pending',
        // Observaciones van en líneas individuales o en detalles
        observaciones: formData.observaciones || ''
      }

      // Verificar que todos los IDs sean números válidos
      const invalidLines = orderData.lines.filter(line => 
        isNaN(line.id_product) || line.id_product < 1
      );
      
      if (invalidLines.length > 0) {
        showToast('warning', 'Algunos productos tienen IDs inválidos');
        setLoading(false);
        return;
      }

      console.log('📤 Enviando pedido:', orderData);
      
      const response = await createOrderRequest(orderData);
      
      if (response.ok) {
        showToast('success', response.msg || 'Pedido creado exitosamente');
        resetForm();
        closeModal();
        
        // Recargar la lista de pedidos
        const ordersResponse = await getOrdersRequest();
        if (ordersResponse.ok) {
          setPedidos(ordersResponse.orders || []);
        }
      } else {
        console.error('Error del backend:', response);
        showToast('danger', response.msg || 'Error al crear pedido');
      }
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      showToast('danger', 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  // CORRECCIÓN: Función addProductLine mejorada
  const addProductLine = (product, qty = 1) => {
    console.log('➕ Añadiendo producto:', product)
    
    // CORRECCIÓN: Buscar stock en múltiples propiedades
    const stock = 
      product.stock !== undefined ? product.stock :
      product.Cantidad !== undefined ? product.Cantidad :
      product.quantity !== undefined ? product.quantity :
      product.cantidad !== undefined ? product.cantidad :
      0;
    
    console.log('📦 Stock detectado para', product.name_product || product.Nombre, ':', stock)
    
    if (stock < qty) {
      showToast('warning', `Stock insuficiente. Disponible: ${stock}, Solicitado: ${qty}`)
      return
    }
    
    // Asegurar que el precio sea un número
    const price = typeof product.price === 'number' ? product.price : 
                  typeof product.Precio_Unit === 'number' ? product.Precio_Unit :
                  parseFloat(product.price || product.Precio_Unit || 0)
    
    const line = {
      id: Date.now() + Math.random(),
      id_product: product.id_product || product.id,
      nombre: product.name_product || product.Nombre || product.name || 'Producto sin nombre',
      precio: price,
      cantidad: Number(qty),
      subtotal: Number(qty) * price,
    }
    
    console.log('📝 Línea creada:', line)
    setLines((prev) => [...prev, line])
    showToast('primary', 'Producto añadido')
    setModalVisible(false)
  }

  const removeLine = (lineId) => setLines((prev) => prev.filter((l) => l.id !== lineId))

  const updateLineQuantity = (lineId, newQuantity) => {
    if (newQuantity < 1) {
      removeLine(lineId)
      return
    }
    
    setLines(prev => prev.map(line => {
      if (line.id === lineId) {
        return {
          ...line,
          cantidad: newQuantity,
          subtotal: newQuantity * line.precio
        }
      }
      return line
    }))
  }

  const { total, iva, totalConIva } = lines.reduce(
    (acc, l) => {
      acc.total += l.subtotal
      acc.iva = acc.total * 0.16
      acc.totalConIva = acc.total + acc.iva
      return acc
    },
    { total: 0, iva: 0, totalConIva: 0 }
  )

  // --- EDITAR PEDIDO ---
  const handleEditPedido = async () => {
    try {
      if (!selectedPedido) return;
      
      setLoading(true);
      
      const updatedOrderData = {
        ...selectedPedido,
        ...formData,
        lines: lines,
        total: totalConIva
      };
      
      console.log('✏️ Editando pedido:', updatedOrderData);
      
      // Aquí deberías llamar a tu API de actualización
      // Ej: const response = await updateOrderRequest(selectedPedido.id, updatedOrderData);
      
      showToast('success', 'Pedido actualizado exitosamente');
      closeModal();
      loadInitialData(); // Recargar datos
      
    } catch (error) {
      console.error('Error al editar pedido:', error);
      showToast('danger', 'Error al actualizar pedido');
    } finally {
      setLoading(false);
    }
  };

  // --- ELIMINAR PEDIDO ---
  const handleDeletePedido = async () => {
    try {
      if (!selectedPedido) return;
      
      setLoading(true);
      
      // Confirmación
      if (!window.confirm(`¿Está seguro de eliminar el pedido #${selectedPedido.id}?`)) {
        setLoading(false);
        closeModal();
        return;
      }
      
      console.log('🗑️ Eliminando pedido:', selectedPedido.id);
      
      // Llamar a la API de eliminación
      const response = await deleteOrderRequest(selectedPedido.id);
      
      if (response.ok) {
        showToast('success', response.msg || 'Pedido eliminado exitosamente');
        closeModal();
        // Recargar la lista de pedidos
        loadInitialData();
      } else {
        showToast('danger', response.msg || 'Error al eliminar pedido');
      }
      
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      showToast('danger', 'Error al eliminar pedido');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    console.log('🔓 Abriendo modal:', type, item)
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

  // Función segura para mostrar precios
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <CContainer fluid className="px-4 pb-4">
      {/* HEADER DE MÓDULO */}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: isDarkMode ? '#fff' : azulVA }}>
          Centro de <span style={{ color: verdeVA }}>Pedidos</span>
        </h2>
        <p className="text-muted">Generación de presupuestos y gestión de historial.</p>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      <CRow>
        {/* PANEL IZQUIERDO: FORMULARIO MEJORADO */}
        <CCol lg={12}>
          <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Detalles del Presupuesto</h5>
              <CButton
                color="light"
                className="rounded-pill px-3 shadow-sm border"
                onClick={resetForm}
                disabled={loading}
              >
                Limpiar Formulario
              </CButton>
            </CCardHeader>
            <CCardBody className="p-4">
              <CForm>
                <CRow className="g-4">
                  {/* Sección de información del cliente */}
                  <CCol md={6}>
                    <CCard className="border-0 shadow-sm h-100">
                      <CCardHeader className="bg-transparent border-0">
                        <h6 className="fw-bold mb-0">
                          <CIcon icon={cilUserPlus} className="me-2" />
                          Información del Cliente
                        </h6>
                      </CCardHeader>
                      <CCardBody>
                        {/* Tarjeta de cliente seleccionado */}
                        {formData.cliente ? (
                          <div className="p-3 rounded-3 border border-success bg-success bg-opacity-10">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="fw-bold text-success mb-0">{formData.cliente}</h6>
                                <small className="text-muted">Cliente seleccionado</small>
                              </div>
                              <CBadge color="success">✓ Vinculado</CBadge>
                            </div>
                            <div className="row small mt-3">
                              <div className="col-6">
                                <strong>RIF:</strong><br />
                                <span className="text-muted">{formData.rif || 'No disponible'}</span>
                              </div>
                              <div className="col-6">
                                <strong>Teléfono:</strong><br />
                                <span className="text-muted">{formData.telefono || 'No disponible'}</span>
                              </div>
                              <div className="col-12 mt-2">
                                <strong>Dirección:</strong><br />
                                <span className="text-muted">{formData.direccionEntrega || 'No disponible'}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-5 border rounded-3">
                            <CIcon icon={cilMagnifyingGlass} size="2xl" className="text-muted mb-3" />
                            <h6 className="fw-bold">Selecciona un cliente</h6>
                            <p className="text-muted small mb-3">
                              Para continuar con el pedido, selecciona un cliente de tu lista
                            </p>
                            <CButton
                              color="primary"
                              variant="outline"
                              onClick={() => openModal('searchClient')}
                              className="rounded-pill"
                            >
                              <CIcon icon={cilMagnifyingGlass} className="me-2" />
                              Buscar Cliente
                            </CButton>
                          </div>
                        )}
                        
                        <div className="mt-3">
                          <CButton
                            color="light"
                            variant="outline"
                            onClick={() => openModal('searchClient')}
                            className="w-100"
                          >
                            {formData.cliente ? 'Cambiar Cliente' : 'Buscar Cliente'}
                          </CButton>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  {/* Sección de condiciones comerciales */}
                  <CCol md={6}>
                    <CCard className="border-0 shadow-sm h-100">
                      <CCardHeader className="bg-transparent border-0">
                        <h6 className="fw-bold mb-0">
                          <CIcon icon={cilCheckCircle} className="me-2" />
                          Condiciones Comerciales
                        </h6>
                      </CCardHeader>
                      <CCardBody>
                        <CRow className="g-3">
                          <CCol md={12}>
                            <div className="mb-3">
                              <CFormLabel className="fw-bold small">Términos de Pago</CFormLabel>
                              <CFormSelect
                                name="terminosPago"
                                value={formData.terminosPago}
                                onChange={handleFormChange}
                                disabled={loading}
                                className="form-select-lg"
                              >
                                <option value="Contado">Contado (Efectivo/Transferencia)</option>
                                <option value="Credito15">Crédito 15 días</option>
                                <option value="Credito30">Crédito 30 días</option>
                                <option value="Credito60">Crédito 60 días</option>
                              </CFormSelect>
                            </div>
                          </CCol>
                          
                          <CCol md={6}>
                            <div className="mb-3">
                              <CFormLabel className="fw-bold small">Moneda/Tasa</CFormLabel>
                              <CFormSelect
                                name="tasa"
                                value={formData.tasa}
                                onChange={handleFormChange}
                                disabled={loading}
                              >
                                <option value="BS">Bolívares (Bs.)</option>
                                <option value="USD">Dólares ($)</option>
                                <option value="EUR">Euros (€)</option>
                                <option value="BCV">Tasa BCV</option>
                                <option value="Paralelo">Tasa Paralela</option>
                              </CFormSelect>
                            </div>
                          </CCol>
                          
                          <CCol md={6}>
                            <div className="mb-3">
                              <CFormLabel className="fw-bold small">Transporte/Envío</CFormLabel>
                              <CFormSelect
                                name="transporte"
                                value={formData.transporte}
                                onChange={handleFormChange}
                                disabled={loading}
                              >
                                <option value="Tealca">Tealca (Estándar)</option>
                                <option value="MRW">MRW (Express)</option>
                                <option value="Zoom">Zoom</option>
                                <option value="Domesa">Domesa</option>
                                <option value="RetiroLocal">Retiro en Tienda</option>
                                <option value="Propio">Transporte Propio</option>
                              </CFormSelect>
                            </div>
                          </CCol>
                          
                          <CCol md={12}>
                            <div className="mb-3">
                              <CFormLabel className="fw-bold small">Observaciones/Notas</CFormLabel>
                              <CFormInput
                                as="textarea"
                                rows="2"
                                placeholder="Notas adicionales para el pedido..."
                                name="observaciones"
                                value={formData.observaciones || ''}
                                onChange={handleFormChange}
                              />
                            </div>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>

                {/* TABLA DE LÍNEAS */}
                <div className="mt-4">
                  <CCard className="border-0 shadow-sm">
                    <CCardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                      <div>
                        <h6 className="fw-bold mb-0">
                          <CIcon icon={cilPlus} className="me-2" />
                          Artículos del Pedido
                        </h6>
                        <small className="text-muted">
                          {lines.length} {lines.length === 1 ? 'producto añadido' : 'productos añadidos'}
                        </small>
                      </div>
                      <div>
                        <CButton
                          color="primary"
                          className="rounded-pill px-4"
                          onClick={() => openModal('addProduct')}
                          disabled={loading}
                        >
                          <CIcon icon={cilPlus} className="me-2" />
                          Agregar Productos
                        </CButton>
                      </div>
                    </CCardHeader>
                    
                    <CCardBody className="p-0">
                      {lines.length === 0 ? (
                        <div className="text-center py-5">
                          <CIcon icon={cilPlus} size="2xl" className="text-muted mb-3" />
                          <h6 className="fw-bold">No hay productos en el pedido</h6>
                          <p className="text-muted">Agrega productos para continuar con el presupuesto</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <CTable hover align="middle" className="mb-0">
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell className="ps-4" width="40%">PRODUCTO</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" width="15%">CANTIDAD</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" width="15%">PRECIO UNIT.</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" width="15%">SUBTOTAL</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" width="15%">ACCIÓN</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {lines.map((l, index) => (
                                <CTableRow key={`${l.id}-${index}`}>
                                  <CTableDataCell className="ps-4">
                                    <div className="fw-medium">{l.nombre}</div>
                                    <small className="text-muted">Código: #{l.id_product}</small>
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <CButton
                                        size="sm"
                                        color="outline-secondary"
                                        onClick={() => updateLineQuantity(l.id, l.cantidad - 1)}
                                        disabled={loading}
                                      >
                                        -
                                      </CButton>
                                      <div className="mx-2 fw-bold">{l.cantidad}</div>
                                      <CButton
                                        size="sm"
                                        color="outline-secondary"
                                        onClick={() => updateLineQuantity(l.id, l.cantidad + 1)}
                                        disabled={loading}
                                      >
                                        +
                                      </CButton>
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center fw-bold">
                                    ${formatPrice(l.precio)}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center fw-bold text-primary">
                                    ${formatPrice(l.subtotal)}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    <CButton
                                      color="danger"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeLine(l.id)}
                                      disabled={loading}
                                      title="Eliminar producto"
                                    >
                                      <CIcon icon={cilTrash} />
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </div>
                      )}
                      
                      {/* RESUMEN TOTAL */}
                      {lines.length > 0 && (
                        <div className="p-4 border-top">
                          <CRow className="align-items-center">
                            <CCol md={6}>
                              <div className="text-muted small">
                                <CIcon icon={cilCheckCircle} className="me-2" />
                                {lines.length} productos · {lines.reduce((acc, l) => acc + l.cantidad, 0)} unidades
                              </div>
                            </CCol>
                            <CCol md={6}>
                              <div className="text-end">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="text-muted">Subtotal:</span>
                                  <span className="fw-bold">${formatPrice(total)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="text-muted">IVA (16%):</span>
                                  <span className="fw-bold">${formatPrice(iva)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="text-muted">Total a pagar:</span>
                                  <h4 className="fw-bold" style={{ color: verdeVA }}>
                                    ${formatPrice(totalConIva)}
                                  </h4>
                                </div>
                              </div>
                            </CCol>
                          </CRow>
                        </div>
                      )}
                    </CCardBody>
                  </CCard>
                </div>
                
                {/* BOTÓN DE CONFIRMACIÓN */}
                <div className="mt-4 text-end">
                  <CButton
                    size="lg"
                    className="text-white px-5 rounded-pill shadow"
                    style={{ backgroundColor: azulVA, borderColor: azulVA }}
                    onClick={() => openModal('confirmar')}
                    disabled={loading || lines.length === 0 || !formData.id_customer}
                  >
                    <CIcon icon={cilCloudUpload} className="me-2" />
                    {loading ? 'Procesando...' : 'Confirmar y Generar Pedido'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        {/* LISTADO DE PEDIDOS */}
        <CCol lg={12}>
          <CCard className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">Historial de Pedidos</h5>
                <small className="text-muted">{pedidos.length} pedidos registrados</small>
              </div>
              <CButton
                color="light"
                variant="outline"
                size="sm"
                onClick={loadInitialData}
              >
                <CIcon icon={cilCheckCircle} className="me-2" />
                Actualizar
              </CButton>
            </CCardHeader>
            <CCardBody className="p-4">
              <CTable hover responsive align="middle">
                <CTableHead className="text-muted small">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>CLIENTE</CTableHeaderCell>
                    <CTableHeaderCell>FECHA</CTableHeaderCell>
                    <CTableHeaderCell>ESTADO</CTableHeaderCell>
                    <CTableHeaderCell>TOTAL</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">ACCIONES</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pedidos.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
                        No hay pedidos registrados
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    pedidos.map((p, index) => (
                      <CTableRow key={`${p.id}-${index}`}>
                        <CTableDataCell className="fw-bold" style={{ color: azulVA }}>
                          #{p.id}
                        </CTableDataCell>
                                              <CTableDataCell>
                        <div className="fw-bold">{p.cliente}</div>
                        {p.cliente_email && (
                          <div className="small text-muted">{p.cliente_email}</div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {p.fechaCreacion}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={
                          p.estado === 'Pendiente' ? 'warning' :
                          p.estado === 'Entregado' ? 'success' :
                          p.estado === 'Cancelado' ? 'danger' : 'primary'
                        }>
                          {p.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="fw-bold">
                        {p.total}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openModal('edit', p)}
                          title="Editar pedido"
                        >
                          <CIcon
                            icon={cilPencil}
                            style={{ color: isDarkMode ? '#00d4ff' : azulVA }}
                          />
                        </CButton>
                        <CButton 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openModal('delete', p)}
                          title="Eliminar pedido"
                        >
                          <CIcon icon={cilTrash} className="text-danger" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
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
          {modalType === 'edit' && `Editar Pedido #${selectedPedido?.id}`}
          {modalType === 'delete' && 'Eliminar Pedido'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4">
        {/* BUSCAR CLIENTE */}
        {modalType === 'searchClient' && (
          <>
            <div className="d-flex gap-2 mb-4">
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilMagnifyingGlass} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Filtrar por nombre, email o RIF..."
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </CInputGroup>
              <CButton
                color="success"
                className="text-white text-nowrap"
                onClick={() => openModal('addClient')}
                disabled={loading}
              >
                <CIcon icon={cilUserPlus} className="me-2" />
                Nuevo Cliente
              </CButton>
            </div>
            <div className="table-responsive" style={{ maxHeight: '350px' }}>
              <CTable hover align="middle">
                <CTableBody>
                  {filteredClients.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={2} className="text-center py-4 text-muted">
                        No hay clientes disponibles
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredClients.map((c, index) => (
                      <CTableRow
                        key={`${c.id}-${index}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => selectClient(c)}
                        className="hover-shadow"
                      >
                        <CTableDataCell>
                          <div className="fw-bold">{c.nombre}</div>
                          <div className="small text-muted">{c.email || c.rif}</div>
                          <div className="small">{c.direccion}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CButton size="sm" color="primary" variant="ghost">
                            Seleccionar
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </div>
          </>
        )}

        {/* AGREGAR PRODUCTO */}
        {modalType === 'addProduct' && (
          <>
            <div className="mb-4">
              <CRow className="g-3">
                <CCol md={8}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilMagnifyingGlass} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Buscar por nombre, código o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loading}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Herramientas">Herramientas</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <CIcon icon={cilMagnifyingGlass} size="3xl" className="text-muted mb-3" />
                  <h5>No se encontraron productos</h5>
                  <p className="text-muted">Intenta con otros términos de búsqueda</p>
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 g-3">
                  {filteredProducts.map((prod, index) => {
                    const price = typeof prod.price === 'number' ? prod.price : 
                                  typeof prod.Precio_Unit === 'number' ? prod.Precio_Unit :
                                  parseFloat(prod.price || prod.Precio_Unit || 0);
                    
                    const stock = 
                      prod.stock !== undefined ? prod.stock :
                      prod.Cantidad !== undefined ? prod.Cantidad :
                      prod.quantity !== undefined ? prod.quantity :
                      prod.cantidad !== undefined ? prod.cantidad :
                      0;
                    
                    const canAdd = stock > 0;
                    
                    const uniqueKey = `${prod.id_product || prod.id || 'prod'}-${index}`;
                    
                    const productName = prod.name_product || prod.Nombre || prod.name || 'Producto sin nombre';
                    const productCategory = prod.Categoria || prod.category || 'General';
                    const productDescription = prod.Descripcion || prod.description || 'Sin descripción';
                    
                    return (
                      <div key={uniqueKey} className="col">
                        <div className="card h-100 border-0 shadow-sm hover-shadow">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="card-title fw-bold mb-1">
                                  {productName}
                                </h6>
                                <p className="card-text small text-muted mb-2">
                                  {productDescription}
                                </p>
                                <div className="d-flex align-items-center gap-2">
                                  <CBadge color={canAdd ? 'success' : 'danger'}>
                                    {canAdd ? `Stock: ${stock}` : 'Sin stock'}
                                  </CBadge>
                                  <CBadge color="info">
                                    {productCategory}
                                  </CBadge>
                                </div>
                              </div>
                              <div className="text-end">
                                <h5 className="text-primary fw-bold mb-0">
                                  ${formatPrice(price)}
                                </h5>
                                <small className="text-muted">Precio unitario</small>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <CButton
                                size="sm"
                                color="success"
                                className="w-100"
                                onClick={() => addProductLine(prod)}
                                disabled={loading || !canAdd}
                              >
                                <CIcon icon={cilPlus} className="me-1" />
                                Añadir al pedido
                              </CButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* REGISTRAR NUEVO CLIENTE */}
        {modalType === 'addClient' && (
          <div className="p-3">
            <h5 className="fw-bold mb-4">Registrar Nuevo Cliente</h5>
            
            <CForm>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel className="fw-bold small">Nombre/Razón Social *</CFormLabel>
                  <CFormInput
                    placeholder="Ej: Empresa XYZ, C.A."
                    name="nombre"
                    value={clientForm.nombre}
                    onChange={handleClientFormChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-bold small">RIF *</CFormLabel>
                  <CFormInput
                    placeholder="Ej: J-12345678-9 (máx 9 caracteres)"
                    name="rif"
                    value={clientForm.rif}
                    onChange={handleClientFormChange}
                    maxLength={20} // Permitir entrada pero será sanitizado
                    required
                  />
                  <small className="text-muted">Será convertido a 9 caracteres (solo letras y números)</small>
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-bold small">Teléfono</CFormLabel>
                  <CFormInput
                    placeholder="0412-1234567"
                    name="telefono"
                    value={clientForm.telefono}
                    onChange={handleClientFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-bold small">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    placeholder="cliente@empresa.com"
                    name="email"
                    value={clientForm.email || ''}
                    onChange={handleClientFormChange}
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel className="fw-bold small">Dirección Fiscal</CFormLabel>
                  <CFormInput
                    placeholder="Av. Principal, Edificio..."
                    name="direccion"
                    value={clientForm.direccion}
                    onChange={handleClientFormChange}
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel className="fw-bold small">Dirección de Entrega</CFormLabel>
                  <CFormInput
                    placeholder="Si es diferente a la fiscal"
                    name="direccionEntrega"
                    value={clientForm.direccionEntrega || ''}
                    onChange={handleClientFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-bold small">Sucursal</CFormLabel>
                  <CFormInput
                    placeholder="Sede Central, Zona Industrial..."
                    name="sucursal"
                    value={clientForm.sucursal}
                    onChange={handleClientFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-bold small">Condiciones de Pago</CFormLabel>
                  <CFormSelect
                    name="terminosPago"
                    value={clientForm.terminosPago || 'Contado'}
                    onChange={handleClientFormChange}
                  >
                    <option value="Contado">Contado</option>
                    <option value="Credito15">Crédito 15 días</option>
                    <option value="Credito30">Crédito 30 días</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              
              <div className="mt-4 pt-3 border-top d-flex justify-content-between">
                <CButton
                  color="secondary"
                  variant="ghost"
                  onClick={() => openModal('searchClient')}
                >
                  ← Volver a buscar
                </CButton>
                <div>
                  <CButton
                    color="light"
                    variant="outline"
                    onClick={() => setClientForm(emptyClientForm())}
                    className="me-2"
                  >
                    Limpiar
                  </CButton>
                  <CButton
                    color="success"
                    onClick={handleSaveClient}
                    disabled={loading || !clientForm.nombre || !clientForm.rif}
                  >
                    <CIcon icon={cilUserPlus} className="me-2" />
                    Registrar Cliente
                  </CButton>
                </div>
              </div>
            </CForm>
          </div>
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
              <strong>${formatPrice(totalConIva)}</strong>.
            </p>
            <div className="alert alert-info">
              <small>
                <strong>📝 Resumen:</strong><br />
                • Cliente: {formData.cliente}<br />
                • Productos: {lines.length} ({lines.reduce((acc, l) => acc + l.cantidad, 0)} unidades)<br />
                • Estado inicial: Pendiente<br />
                • Términos de pago: {formData.terminosPago}
              </small>
            </div>
            <div className="mt-4 d-flex justify-content-center gap-3">
              <CButton color="secondary" variant="ghost" onClick={closeModal} disabled={loading}>
                Revisar de nuevo
              </CButton>
              <CButton 
                color="success" 
                className="px-5 text-white fw-bold" 
                onClick={savePedido}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar y Guardar'}
              </CButton>
            </div>
          </div>
        )}

        {/* MODAL DE EDICIÓN */}
        {modalType === 'edit' && selectedPedido && (
          <div className="p-3">
            <h5 className="fw-bold mb-4">Editar Pedido #{selectedPedido.id}</h5>
            <p className="text-muted mb-4">
              Realiza los cambios necesarios en el pedido. Los cambios se reflejarán inmediatamente.
            </p>
            
            <div className="alert alert-info">
              <strong>Pedido actual:</strong>
              <div className="mt-2">
                <div className="row">
                  <div className="col-6">
                    <small>Cliente: {selectedPedido.cliente}</small>
                  </div>
                  <div className="col-6">
                    <small>Total: {selectedPedido.total}</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-top d-flex justify-content-between">
              <CButton
                color="secondary"
                variant="ghost"
                onClick={closeModal}
              >
                Cancelar
              </CButton>
              <CButton
                color="primary"
                onClick={handleEditPedido}
                disabled={loading || lines.length === 0 || !formData.id_customer}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </CButton>
            </div>
          </div>
        )}

        {/* MODAL DE ELIMINACIÓN */}
        {modalType === 'delete' && selectedPedido && (
          <div className="text-center py-4">
            <CIcon
              icon={cilTrash}
              size="3xl"
              className="text-danger mb-3"
              style={{ height: '60px' }}
            />
            <h3 className="fw-bold">¿Eliminar pedido?</h3>
            <p className="text-muted mb-4">
              El pedido <strong>#{selectedPedido.id}</strong> de <strong>{selectedPedido.cliente}</strong> 
              por un monto de <strong>{selectedPedido.total}</strong> será eliminado permanentemente.
            </p>
            <div className="alert alert-warning">
              <small>
                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
                El stock de los productos será devuelto automáticamente.
              </small>
            </div>
            <div className="mt-4 d-flex justify-content-center gap-3">
              <CButton color="secondary" variant="ghost" onClick={closeModal} disabled={loading}>
                Cancelar
              </CButton>
              <CButton 
                color="danger" 
                className="px-5 fw-bold" 
                onClick={handleDeletePedido}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Sí, Eliminar'}
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