    import React, { useEffect, useState } from 'react'
    import {
    CCard, CCardBody, CCardHeader, CContainer, CRow, CCol, CForm, CFormLabel, CFormInput,
    CFormSelect, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody,
    CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CToast, CToastBody,
    CToastHeader, CToaster, CInputGroup
    } from '@coreui/react'
    import CIcon from '@coreui/icons-react'
    import { cilTrash, cilPlus, cilPencil, cilMagnifyingGlass, cilUserPlus } from '@coreui/icons'

    const API_BASE = 'http://localhost:4000'
    const API_PRODUCTS = `${API_BASE}/products`
    const API_PEDIDOS = `${API_BASE}/pedidos`
    const API_CLIENTS = `${API_BASE}/clients`

    // Estado inicial del PEDIDO
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
    transporte: 'Tealca'
    })

    // Estado inicial para NUEVO CLIENTE
    const emptyClientForm = () => ({
    nombre: '',
    rif: '',
    direccion: '',
    sucursal: '',
    telefono: ''
    })

    const Pedidos = () => {
    // --- ESTADOS ---
    const [toasts, setToasts] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState(null) 
    const [selectedPedido, setSelectedPedido] = useState(null)

    // Datos del Formulario Pedido
    const [formData, setFormData] = useState(emptyForm())
    const [lines, setLines] = useState([])

    // Datos del Formulario Nuevo Cliente
    const [clientForm, setClientForm] = useState(emptyClientForm())

    // Data Global
    const [products, setProducts] = useState([])
    const [clients, setClients] = useState([])
    const [pedidos, setPedidos] = useState([])

    // Filtros y Listas Filtradas
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filteredClients, setFilteredClients] = useState([])
    
    const [searchTerm, setSearchTerm] = useState('') // Buscador Productos
    const [categoryFilter, setCategoryFilter] = useState('')
    const [clientSearchTerm, setClientSearchTerm] = useState('') // Buscador Clientes

    // --- CARGA INICIAL ---
    useEffect(() => {
        loadProducts()
        loadPedidos()
        loadClients()
    }, [])

    // --- HELPERS DE CARGA ---
    const showToast = (type, message) => {
        setToasts((prev) => [...prev, { id: Date.now(), type, message }])
    }

    const loadProducts = async () => {
        try {
        const res = await fetch(API_PRODUCTS)
        const data = await res.json()
        setProducts(data)
        setFilteredProducts(data)
        } catch (err) { console.error(err) }
    }

    const loadPedidos = async () => {
        try {
        const res = await fetch(API_PEDIDOS)
        setPedidos(await res.json())
        } catch (err) { console.error(err) }
    }

    const loadClients = async () => {
        try {
        const res = await fetch(API_CLIENTS)
        const data = await res.json()
        setClients(data)
        setFilteredClients(data)
        } catch (err) { console.error(err) }
    }

    // --- FILTROS (Effects) ---
    useEffect(() => {
        const q = searchTerm.trim().toLowerCase()
        const filtered = products.filter((p) => {
        const matchesSearch = !q || String(p.ID ?? p.id).toLowerCase().includes(q) || (String(p.Nombre || p.name || '').toLowerCase().includes(q))
        const matchesCategory = !categoryFilter || (p.Categoria || p.category) === categoryFilter
        return matchesSearch && matchesCategory
        })
        setFilteredProducts(filtered)
    }, [searchTerm, categoryFilter, products])

    useEffect(() => {
        const q = clientSearchTerm.trim().toLowerCase()
        const filtered = clients.filter(c => 
        c.nombre.toLowerCase().includes(q) || c.rif.toLowerCase().includes(q)
        )
        setFilteredClients(filtered)
    }, [clientSearchTerm, clients])


    // --- MANEJO DE FORMULARIOS ---
    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Manejo específico para el formulario de nuevo cliente
    const handleClientFormChange = (e) => {
        const { name, value } = e.target
        setClientForm((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setFormData(emptyForm())
        setLines([])
        setSelectedPedido(null)
    }

    // --- LÓGICA DE NEGOCIO ---

    // 1. Seleccionar Cliente existente
    const selectClient = (client) => {
        setFormData((prev) => ({
        ...prev,
        clienteId: client.id,
        cliente: client.nombre,
        rif: client.rif,
        direccionFactura: client.direccionFactura || '',
        direccionEntrega: client.direccionEntrega || '', // Asumimos misma dirección por defecto
        sucursal: client.sucursal || '',
        // Estos valores vienen del cliente si existen, sino default
        terminosPago: client.terminosPago || 'Contado',
        transporte: client.transporte || 'Tealca'
        }))
        showToast('success', 'Cliente seleccionado')
        setModalVisible(false)
    }

    // 2. Guardar Nuevo Cliente (y seleccionarlo automáticamente)
    const saveNewClient = async () => {
        if (!clientForm.nombre || !clientForm.rif) {
        showToast('danger', 'Nombre y RIF son obligatorios')
        return
        }
        try {
        const res = await fetch(API_CLIENTS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientForm)
        })
        const newClient = await res.json()
        
        await loadClients() // Recargar lista
        selectClient(newClient) // Seleccionarlo automáticamente en el pedido
        showToast('success', 'Cliente creado y seleccionado')
        } catch (err) {
        console.error(err)
        showToast('danger', 'Error creando cliente')
        }
    }

    // 3. Guardar Pedido
    const savePedido = async () => {
        if (!formData.cliente) return showToast('danger', 'Cliente obligatorio')
        if (lines.length === 0) return showToast('danger', 'Faltan productos')

        const payload = { ...formData, lines, fechaCreacion: new Date().toISOString() }

        try {
        await fetch(API_PEDIDOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        showToast('success', 'Pedido guardado')
        closeModal()
        loadPedidos()
        resetForm()
        } catch (err) { console.error(err) }
    }

    // 4. Eliminar Pedido
    const deletePedido = async () => {
        if (!selectedPedido) return
        try {
        await fetch(`${API_PEDIDOS}/${selectedPedido.id}`, { method: 'DELETE' })
        showToast('danger', 'Pedido eliminado')
        loadPedidos()
        closeModal()
        } catch (err) { console.error(err) }
    }

    // 5. Lógica de Líneas de Producto
    const addProductLine = (product, qty = 1) => {
        const existing = lines.find((l) => l.productoId === product.id)
        if (existing) {
        setLines((prev) => prev.map((l) => l.productoId === product.id ? { ...l, cantidad: l.cantidad + qty, subtotal: (l.cantidad + qty) * parseFloat(l.precio) } : l))
        } else {
        const line = {
            id: Date.now(),
            productoId: product.id,
            nombre: product.Nombre || product.name || 'Sin nombre',
            categoria: product.Categoria || product.category || '',
            precio: Number(product.Precio_Unit ?? product.price ?? 0),
            cantidad: Number(qty),
            subtotal: Number(qty) * Number(product.Precio_Unit ?? product.price ?? 0)
        }
        setLines((prev) => [...prev, line])
        }
        showToast('primary', 'Producto agregado')
        setModalVisible(false)
    }

    const removeLine = (lineId) => {
        setLines((prev) => prev.filter((l) => l.id !== lineId))
    }

    const { total } = lines.reduce((acc, l) => {
        acc.subtotal += l.subtotal
        acc.total += l.subtotal // + impuestos si hubiera
        return acc
    }, { subtotal: 0, total: 0 })


    // --- CONTROL DE MODALES ---
    const openModal = (type, item = null) => {
        setModalType(type)
        setModalVisible(true)

        if (type === 'create') resetForm()

        if (type === 'edit' && item) {
        setSelectedPedido(item)
        setFormData({ ...item })
        setLines(item.lines || [])
        }
        
        if (type === 'delete' && item) setSelectedPedido(item)
        
        if (type === 'addProduct') {
        setSearchTerm('')
        setCategoryFilter('')
        setFilteredProducts(products)
        }
        
        if (type === 'searchClient') {
        setClientSearchTerm('')
        setFilteredClients(clients)
        }

        // AQUÍ ESTA LO QUE PEDISTE: Limpiamos el formulario de cliente nuevo
        if (type === 'addClient') {
        setClientForm(emptyClientForm())
        }
    }

    const closeModal = () => {
        setModalVisible(false)
        setModalType(null)
        setSelectedPedido(null)
    }

    // ================= RENDER =================
    return (
        <>
        <CContainer>
            {/* TARJETA 1: FORMULARIO PEDIDO */}
            <CCard className="mb-4">
            <CCardHeader>
                <strong>Nuevo Presupuesto / Pedidos</strong>
                <CButton color="primary" className="float-end" onClick={resetForm}>
                Nuevo (Limpiar)
                </CButton>
            </CCardHeader>

            <CCardBody>
                <CForm>
                <CRow className="mb-4">
                    <CCol md={6}>
                    <CFormLabel>Cliente</CFormLabel>
                    <CInputGroup className="mb-3">
                        <CFormInput 
                        name="cliente" 
                        value={formData.cliente} 
                        onChange={handleFormChange} 
                        placeholder="Buscar..."
                        readOnly // OBLIGA A USAR LA LUPA
                        onClick={() => openModal('searchClient')}
                        />
                        <CButton type="button" color="info" variant="outline" onClick={() => openModal('searchClient')}>
                        <CIcon icon={cilMagnifyingGlass} /> Buscar
                        </CButton>
                    </CInputGroup>

                    <CFormLabel>RIF</CFormLabel>
                    <CFormInput name="rif" value={formData.rif} readOnly className="mb-3 " />

                    <CFormLabel>Dirección de factura</CFormLabel>
                    <CFormInput name="direccionFactura" value={formData.direccionFactura} readOnly className="mb-3 " />

                    <CFormLabel>Dirección de entrega</CFormLabel>
                    <CFormInput name="direccionEntrega" value={formData.direccionEntrega} readOnly className="mb-3 " />

                    <CFormLabel>Sucursal</CFormLabel>
                    <CFormInput name="sucursal" value={formData.sucursal} readOnly className="mb-3" />
                    </CCol>

                    <CCol md={6}>

                    {/* SELECTS: Disabled para obligar a usar datos del cliente */}
                    <CFormLabel>Términos de Pago</CFormLabel>
                    <CFormSelect name="terminosPago" value={formData.terminosPago} onChange={handleFormChange} className="mb-3" >
                        <option>Contado</option>
                        <option>Crédito 15 días</option>
                    </CFormSelect>

                    <CFormLabel>Tasa</CFormLabel>
                    <CFormSelect name="tasa" value={formData.tasa} onChange={handleFormChange} className="mb-3">
                        <option>BCV</option>
                        <option>Divisa</option>
                    </CFormSelect>

                    <CFormLabel>Transporte</CFormLabel>
                    <CFormSelect name="transporte" value={formData.transporte} onChange={handleFormChange} className="mb-3" >
                        <option>Tealca</option>
                        <option>Opcional</option>
                    </CFormSelect>
                    </CCol>
                </CRow>

                {/* TABLA DE LÍNEAS */}
                <CCard className="mt-4">
                    <CCardHeader><strong>Líneas del pedido</strong></CCardHeader>
                    <CCardBody>
                    <CTable hover bordered color="dark">
                        <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Producto</CTableHeaderCell>
                            <CTableHeaderCell>Cant.</CTableHeaderCell>
                            <CTableHeaderCell>Total</CTableHeaderCell>
                            <CTableHeaderCell>Acción</CTableHeaderCell>
                        </CTableRow>
                        </CTableHead>
                        <CTableBody>
                        {lines.length === 0 ? (
                            <CTableRow><CTableDataCell colSpan={4} className="text-center">Agrega productos</CTableDataCell></CTableRow>
                        ) : (
                            lines.map(l => (
                            <CTableRow key={l.id}>
                                <CTableDataCell>{l.nombre}</CTableDataCell>
                                <CTableDataCell>{l.cantidad}</CTableDataCell>
                                <CTableDataCell>{l.subtotal.toFixed(2)}</CTableDataCell>
                                <CTableDataCell>
                                <CButton size="sm" color="danger" onClick={()=>removeLine(l.id)}><CIcon icon={cilTrash}/></CButton>
                                </CTableDataCell>
                            </CTableRow>
                            ))
                        )}
                        </CTableBody>
                    </CTable>
                    <div className="d-flex justify-content-between align-items-center">
                        <CButton color="success" 
                        onClick={() => {
                            setModalVisible(false)
                            setTimeout(() => openModal('addProduct'), 150)
                        }}
                    >
                    <CIcon icon={cilPlus} className="me-2"/>Agregar Producto
                    </CButton>







                    
                        <h4>Total: {total.toFixed(2)}</h4>
                    </div>
                    </CCardBody>
                </CCard>

                <div className="mt-4 text-end">
                    <CButton type='button' size="lg" color="success" onClick={() => openModal('confirmar')}>Guardar Presupuesto</CButton>
                </div>
                </CForm>
            </CCardBody>
            </CCard>

            {/* TARJETA 2: LISTA PEDIDOS */}
            <CCard className="mb-4">
            <CCardHeader><strong>Historial de Pedidos Guardados</strong></CCardHeader>
            <CCardBody>
                <CTable hover bordered striped>
                <CTableHead>
                    <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Sucursal</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {pedidos.map((p) => (
                    <CTableRow key={p.id}>
                        <CTableDataCell>{p.id}</CTableDataCell>
                        <CTableDataCell>{p.cliente}</CTableDataCell>
                        <CTableDataCell>{p.sucursal}</CTableDataCell>
                        <CTableDataCell>{p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString() : '-'}</CTableDataCell>
                        <CTableDataCell className="text-center">
                        <CButton size="sm" color="primary" className="me-2" onClick={() => openModal('edit', p)}>
                            <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton size="sm" color="danger" onClick={() => openModal('delete', p)}>
                            <CIcon icon={cilTrash} />
                        </CButton>
                        </CTableDataCell>
                    </CTableRow>
                    ))}
                    {pedidos.length === 0 && <CTableRow><CTableDataCell colSpan={5} className="text-center">No hay pedidos.</CTableDataCell></CTableRow>}
                </CTableBody>
                </CTable>
            </CCardBody>
            </CCard>
        </CContainer>

        <CToaster placement="top-end">
            {toasts.map((t) => (
            <CToast key={t.id} autohide delay={3000} color={t.type} visible>
                <CToastHeader closeButton><strong>Notificación</strong></CToastHeader>
                <CToastBody>{t.message}</CToastBody>
            </CToast>
            ))}
        </CToaster>

        {/* --- MODALES --- */}
        <CModal visible={modalVisible} onClose={closeModal} size="lg">
            <CModalHeader>
            <CModalTitle>
                {modalType === 'searchClient' && 'Buscar Cliente'}
                {modalType === 'addClient' && 'Nuevo Cliente'}
                {modalType === 'addProduct' && 'Agregar Producto'}
                {modalType === 'confirmar' && 'Confirmar Pedido'}
                {modalType === 'delete' && 'Eliminar Pedido'}
            </CModalTitle>
            </CModalHeader>
            <CModalBody>
            
            {/* 1. BUSCADOR DE CLIENTES */}
            {modalType === 'searchClient' && (
                <>
                <div className="d-flex gap-2 mb-3">
                    <CFormInput 
                    placeholder="Buscar por nombre o RIF..." 
                    value={clientSearchTerm} 
                    onChange={(e) => setClientSearchTerm(e.target.value)} 
                    />
                    <CButton color="success" onClick={() => openModal('addClient')}>
                    <CIcon icon={cilUserPlus} className="me-2"/>Crear Nuevo
                    </CButton>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <CTable hover>
                    <CTableHead>
                        <CTableRow>
                        <CTableHeaderCell>Nombre</CTableHeaderCell>
                        <CTableHeaderCell>RIF</CTableHeaderCell>
                        <CTableHeaderCell>Acción</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {filteredClients.map(client => (
                        <CTableRow key={client.id}>
                            <CTableDataCell>{client.nombre}</CTableDataCell>
                            <CTableDataCell>{client.rif}</CTableDataCell>
                            <CTableDataCell>
                            <CButton size="sm" color="primary" onClick={() => selectClient(client)}>Seleccionar</CButton>
                            </CTableDataCell>
                        </CTableRow>
                        ))}
                    </CTableBody>
                    </CTable>
                </div>
                </>
            )}

            {/* 2. AGREGAR NUEVO CLIENTE (FORMULARIO SEPARADO) */}
            {modalType === "addClient" && (
                <CForm>
                <CRow className="mb-4">
                    <CCol md={6}>
                    <CFormLabel>Nombre / Razón Social</CFormLabel>
                    <CFormInput name="nombre" value={clientForm.nombre} onChange={handleClientFormChange} className="mb-3" placeholder="Ej: Inversiones..." />

                    <CFormLabel>RIF</CFormLabel>
                    <CFormInput name="rif" value={clientForm.rif} onChange={handleClientFormChange} className="mb-3" placeholder="Ej: J-123456" />

                    <CFormLabel>Dirección Fiscal</CFormLabel>
                    <CFormInput name="direccion" value={clientForm.direccion} onChange={handleClientFormChange} className="mb-3" />
                    </CCol>
                    <CCol md={6}>
                    <CFormLabel>Sucursal</CFormLabel>
                    <CFormInput name="sucursal" value={clientForm.sucursal} onChange={handleClientFormChange} className="mb-3" />
                    
                    <CFormLabel>Teléfono</CFormLabel>
                    <CFormInput name="telefono" value={clientForm.telefono} onChange={handleClientFormChange} className="mb-3" />
                    </CCol>
                </CRow>
                <div className="text-end">
                    <CButton color="primary" onClick={saveNewClient}>Guardar y Seleccionar</CButton>
                    <CButton color="secondary" className="ms-2" onClick={() => openModal('searchClient')}>Volver</CButton>
                </div>
                </CForm>
            )}

            {/* 3. BUSCADOR PRODUCTOS */}
            {modalType === 'addProduct' && (
                <>
                <CRow className="mb-3">
                    <CCol><CFormInput placeholder="Buscar producto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></CCol>
                    <CCol>
                    <CFormSelect value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {[...new Set(products.map(p => p.Categoria || p.category).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
                    </CFormSelect>
                    </CCol>
                </CRow>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <CTable hover>
                    <CTableBody>
                        {filteredProducts.map((prod) => (
                        <CTableRow key={prod.id}>
                            <CTableDataCell>{prod.Nombre || prod.name}</CTableDataCell>
                            <CTableDataCell>{prod.Precio_Unit || prod.price}</CTableDataCell>
                            <CTableDataCell><CButton size="sm" onClick={() => addProductLine(prod)}>Agregar</CButton></CTableDataCell>
                        </CTableRow>
                        ))}
                    </CTableBody>
                    </CTable>
                </div>
                </>
            )}

            {/* 4. CONFIRMACIÓN */}
            {modalType === 'confirmar' && (
                <div className="text-center">
                <h5>¿Confirmar pedido para {formData.cliente}?</h5>
                <p className="display-6">Total: {total.toFixed(2)}</p>
                <div className="mt-4">
                    <CButton color="success" onClick={savePedido} className="me-2">Sí, Guardar</CButton>
                    <CButton color="secondary" onClick={closeModal}>Cancelar</CButton>
                </div>
                </div>
            )}

            {/* 5. ELIMINAR */}
            {modalType === 'delete' && (
                <div className="text-center">
                <h5>¿Eliminar pedido #{selectedPedido?.id}?</h5>
                <div className="mt-4">
                    <CButton color="danger" onClick={deletePedido} className="me-2">Eliminar</CButton>
                    <CButton color="secondary" onClick={closeModal}>Cancelar</CButton>
                </div>
                </div>
            )}

            </CModalBody>
        </CModal>
        </>
    )
    }

    export default Pedidos