/** SISTEMA DE INVENTARIO Y ALMACÉN — MÓDULO PROFESIONAL */
import React, { useState, useEffect, useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CWidgetStatsF,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CProgress,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CListGroup,
  CListGroupItem,
  CInputGroup,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CProgressBar,
  CTooltip,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCart,
  cilTruck,
  cilStorage,
  cilWarning,
  cilCheckCircle,
  cilPlus,
  cilPencil,
  cilTrash,
  cilMagnifyingGlass,
  cilFilter,
  cilPrint,
  cilCloudDownload,
  cilChart,
  cilTags,
  cilBarcode,
  cilList,
  cilCalculator,
  cilArrowTop,
  cilArrowBottom,
  cilReload,
  cilInfo,
  cilSpeedometer,
  cilBell,
  cilCalendar,
  cilPeople,
  cilBuilding,
  cilLocationPin,
  cilClipboard,
  cilSettings,
  cilShieldAlt,
  cilGraph,
  cilInbox,
  cilExternalLink,
  cilZoom,
  cilSync,
  cilCash,
  cilDollar,
} from '@coreui/icons'

const InventarioAlmacen = () => {
  /* ------------------ ESTADOS PRINCIPALES ------------------ */
  const [activeTab, setActiveTab] = useState('dashboard')
  const [visibleModal, setVisibleModal] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  /* ------------------ ESTADOS DE DATOS ------------------ */
  const [productos, setProductos] = useState([
    {
      id: 1,
      codigo: 'PROD-001',
      nombre: 'Laptop Dell XPS 15',
      categoria: 'Tecnología',
      subcategoria: 'Computadoras',
      descripcion: 'Laptop empresarial de alto rendimiento',
      ubicacion: 'Almacén A - Estantería 3',
      proveedor: 'Dell Technologies',
      precioCompra: 1250.0,
      precioVenta: 1899.99,
      stockActual: 15,
      stockMinimo: 5,
      stockMaximo: 30,
      unidadMedida: 'Unidad',
      sku: 'DLXPS15-2024',
      estado: 'Disponible',
      fechaIngreso: '2025-01-15',
      ultimaActualizacion: '2025-01-28',
    },
    {
      id: 2,
      codigo: 'PROD-002',
      nombre: 'Monitor 27" 4K Samsung',
      categoria: 'Tecnología',
      subcategoria: 'Monitores',
      descripcion: 'Monitor profesional 4K UHD',
      ubicacion: 'Almacén B - Estantería 1',
      proveedor: 'Samsung Electronics',
      precioCompra: 350.0,
      precioVenta: 549.99,
      stockActual: 8,
      stockMinimo: 3,
      stockMaximo: 20,
      unidadMedida: 'Unidad',
      sku: 'SMN274K-2024',
      estado: 'Stock Bajo',
      fechaIngreso: '2025-01-10',
      ultimaActualizacion: '2025-01-25',
    },
    {
      id: 3,
      codigo: 'PROD-003',
      nombre: 'Silla Ergonómica Ejecutiva',
      categoria: 'Mobiliario',
      subcategoria: 'Sillas',
      descripcion: 'Silla ergonómica para ejecutivos',
      ubicacion: 'Almacén C - Área 2',
      proveedor: 'Office Pro',
      precioCompra: 280.0,
      precioVenta: 449.99,
      stockActual: 25,
      stockMinimo: 10,
      stockMaximo: 50,
      unidadMedida: 'Unidad',
      sku: 'SCHEG-2024',
      estado: 'Disponible',
      fechaIngreso: '2025-01-05',
      ultimaActualizacion: '2025-01-20',
    },
    {
      id: 4,
      codigo: 'PROD-004',
      nombre: 'Papel Bond A4 (500 hojas)',
      categoria: 'Papelería',
      subcategoria: 'Papel',
      descripcion: 'Resma de papel bond tamaño A4',
      ubicacion: 'Almacén A - Estantería 5',
      proveedor: 'Paper Corp',
      precioCompra: 8.5,
      precioVenta: 15.99,
      stockActual: 120,
      stockMinimo: 50,
      stockMaximo: 300,
      unidadMedida: 'Resma',
      sku: 'PPA4-500',
      estado: 'Disponible',
      fechaIngreso: '2025-01-12',
      ultimaActualizacion: '2025-01-26',
    },
    {
      id: 5,
      codigo: 'PROD-005',
      nombre: 'Proyector Epson PowerLite',
      categoria: 'Tecnología',
      subcategoria: 'Proyectores',
      descripcion: 'Proyector profesional 1080p',
      ubicacion: 'Almacén B - Estantería 2',
      proveedor: 'Epson',
      precioCompra: 450.0,
      precioVenta: 699.99,
      stockActual: 3,
      stockMinimo: 2,
      stockMaximo: 10,
      unidadMedida: 'Unidad',
      sku: 'EPPL1080',
      estado: 'Stock Crítico',
      fechaIngreso: '2025-01-18',
      ultimaActualizacion: '2025-01-29',
    },
  ])

  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      tipo: 'Entrada',
      producto: 'Laptop Dell XPS 15',
      codigoProducto: 'PROD-001',
      cantidad: 10,
      ubicacionOrigen: 'Proveedor Dell',
      ubicacionDestino: 'Almacén A',
      motivo: 'Compra normal',
      usuario: 'Admin Sistema',
      fecha: '2025-01-15 10:30:00',
      referencia: 'OC-2025-001',
    },
    {
      id: 2,
      tipo: 'Salida',
      producto: 'Monitor 27" 4K Samsung',
      codigoProducto: 'PROD-002',
      cantidad: 2,
      ubicacionOrigen: 'Almacén B',
      ubicacionDestino: 'Departamento IT',
      motivo: 'Asignación equipo nuevo',
      usuario: 'Jefe IT',
      fecha: '2025-01-20 14:15:00',
      referencia: 'REQ-IT-001',
    },
    {
      id: 3,
      tipo: 'Ajuste',
      producto: 'Papel Bond A4 (500 hojas)',
      codigoProducto: 'PROD-004',
      cantidad: 5,
      ubicacionOrigen: 'Almacén A',
      ubicacionDestino: 'Almacén A',
      motivo: 'Conteo físico diferencial',
      usuario: 'Auditor Inventario',
      fecha: '2025-01-25 09:00:00',
      referencia: 'AJ-2025-001',
    },
    {
      id: 4,
      tipo: 'Transferencia',
      producto: 'Silla Ergonómica Ejecutiva',
      codigoProducto: 'PROD-003',
      cantidad: 5,
      ubicacionOrigen: 'Almacén C',
      ubicacionDestino: 'Oficina Gerencia',
      motivo: 'Mobiliario nuevo gerencial',
      usuario: 'Admin Oficinas',
      fecha: '2025-01-22 11:45:00',
      referencia: 'TRF-GER-001',
    },
  ])

  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: 'Dell Technologies',
      ruc: '20100012345',
      contacto: 'Juan Pérez',
      telefono: '+1 (800) 999-9999',
      email: 'compras@dell.com',
      direccion: 'Av. Tecnológica 123',
      categoria: 'Tecnología',
      estado: 'Activo',
      rating: 4.8,
    },
    {
      id: 2,
      nombre: 'Samsung Electronics',
      ruc: '20100054321',
      contacto: 'María García',
      telefono: '+1 (800) 888-8888',
      email: 'ventas@samsung.com',
      direccion: 'Zona Industrial Norte',
      categoria: 'Tecnología',
      estado: 'Activo',
      rating: 4.6,
    },
    {
      id: 3,
      nombre: 'Office Pro',
      ruc: '20100098765',
      contacto: 'Carlos López',
      telefono: '+1 (800) 777-7777',
      email: 'info@officepro.com',
      direccion: 'Centro Comercial Plaza',
      categoria: 'Mobiliario',
      estado: 'Activo',
      rating: 4.3,
    },
  ])

  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'Tecnología', descripcion: 'Equipos tecnológicos', productos: 45 },
    { id: 2, nombre: 'Mobiliario', descripcion: 'Muebles y equipamiento', productos: 32 },
    { id: 3, nombre: 'Papelería', descripcion: 'Material de oficina', productos: 87 },
    { id: 4, nombre: 'Limpieza', descripcion: 'Productos de limpieza', productos: 23 },
    { id: 5, nombre: 'Seguridad', descripcion: 'Equipos de seguridad', productos: 15 },
  ])

  const [ubicaciones, setUbicaciones] = useState([
    {
      id: 1,
      nombre: 'Almacén A',
      capacidad: '1000 m²',
      ocupacion: '65%',
      responsable: 'Luis Martínez',
    },
    {
      id: 2,
      nombre: 'Almacén B',
      capacidad: '800 m²',
      ocupacion: '45%',
      responsable: 'Ana Rodríguez',
    },
    {
      id: 3,
      nombre: 'Almacén C',
      capacidad: '1200 m²',
      ocupacion: '75%',
      responsable: 'Pedro Sánchez',
    },
    {
      id: 4,
      nombre: 'Bodega Central',
      capacidad: '2000 m²',
      ocupacion: '85%',
      responsable: 'Carmen López',
    },
  ])

  const [ordenesCompra, setOrdenesCompra] = useState([
    {
      id: 1,
      numero: 'OC-2025-001',
      proveedor: 'Dell Technologies',
      fecha: '2025-01-10',
      estado: 'Completada',
      total: 12500.0,
      productos: [{ nombre: 'Laptop Dell XPS 15', cantidad: 10, precio: 1250.0 }],
    },
    {
      id: 2,
      numero: 'OC-2025-002',
      proveedor: 'Samsung Electronics',
      fecha: '2025-01-12',
      estado: 'En Proceso',
      total: 2800.0,
      productos: [{ nombre: 'Monitor 27" 4K Samsung', cantidad: 8, precio: 350.0 }],
    },
  ])

  const [alertas, setAlertas] = useState([
    {
      id: 1,
      tipo: 'stock_bajo',
      producto: 'Proyector Epson PowerLite',
      mensaje: 'Stock por debajo del mínimo',
      fecha: '2025-01-29',
      prioridad: 'alta',
    },
    {
      id: 2,
      tipo: 'vencimiento',
      producto: 'Tinta Impresora HP',
      mensaje: 'Producto próximo a vencer',
      fecha: '2025-01-28',
      prioridad: 'media',
    },
    {
      id: 3,
      tipo: 'movimiento',
      producto: 'Monitor 27" 4K Samsung',
      mensaje: 'Movimiento inusual detectado',
      fecha: '2025-01-27',
      prioridad: 'baja',
    },
  ])

  const [conteosFisicos, setConteosFisicos] = useState([
    {
      id: 1,
      fecha: '2025-01-25',
      ubicacion: 'Almacén A',
      responsable: 'Auditor Inventario',
      productosContados: 45,
      productosTotales: 50,
      diferencia: 5,
      estado: 'Completado',
    },
    {
      id: 2,
      fecha: '2025-02-01',
      ubicacion: 'Almacén B',
      responsable: 'Auditor Inventario',
      productosContados: 30,
      productosTotales: 35,
      diferencia: 5,
      estado: 'En Proceso',
    },
  ])

  /* ------------------ ESTADOS DE FORMULARIOS ------------------ */
  const [formProducto, setFormProducto] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    subcategoria: '',
    descripcion: '',
    ubicacion: '',
    proveedor: '',
    precioCompra: '',
    precioVenta: '',
    stockActual: '',
    stockMinimo: '',
    stockMaximo: '',
    unidadMedida: '',
    sku: '',
    estado: 'Disponible',
  })

  const [formMovimiento, setFormMovimiento] = useState({
    tipo: 'Entrada',
    productoId: '',
    cantidad: '',
    ubicacionOrigen: '',
    ubicacionDestino: '',
    motivo: '',
    referencia: '',
  })

  const [formProveedor, setFormProveedor] = useState({
    nombre: '',
    ruc: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    categoria: '',
    estado: 'Activo',
  })

  const [formOrdenCompra, setFormOrdenCompra] = useState({
    proveedorId: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: [],
  })

  /* ------------------ EFECTOS ------------------ */
  useEffect(() => {
    // Cargar datos del localStorage
    const datosGuardados = localStorage.getItem('inventarioAlmacen')
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados)
        if (datos.productos) setProductos(datos.productos)
        if (datos.movimientos) setMovimientos(datos.movimientos)
        if (datos.proveedores) setProveedores(datos.proveedores)
        if (datos.alertas) setAlertas(datos.alertas)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Guardar datos en localStorage
    const datos = {
      productos,
      movimientos,
      proveedores,
      alertas,
    }
    try {
      localStorage.setItem('inventarioAlmacen', JSON.stringify(datos))
    } catch (error) {
      console.error('Error al guardar datos:', error)
    }
  }, [productos, movimientos, proveedores, alertas])

  /* ------------------ CÁLCULOS Y MÉTRICAS ------------------ */
  const metricas = useMemo(() => {
    const totalProductos = productos.length
    const valorTotalInventario = productos.reduce(
      (sum, p) => sum + p.precioCompra * p.stockActual,
      0,
    )
    const productosStockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo).length
    const productosStockCritico = productos.filter(
      (p) => p.stockActual <= p.stockMinimo * 0.5,
    ).length
    const rotacionPromedio =
      totalProductos > 0 ? movimientos.reduce((sum, m) => sum + m.cantidad, 0) / totalProductos : 0

    const estadoStock = productos.reduce(
      (acc, p) => {
        if (p.stockActual <= p.stockMinimo * 0.5) acc.critico++
        else if (p.stockActual <= p.stockMinimo) acc.bajo++
        else if (p.stockActual >= p.stockMaximo * 0.9) acc.alto++
        else acc.normal++
        return acc
      },
      { critico: 0, bajo: 0, normal: 0, alto: 0 },
    )

    return {
      totalProductos,
      valorTotalInventario,
      productosStockBajo,
      productosStockCritico,
      rotacionPromedio,
      estadoStock,
      ocupacionTotal:
        ubicaciones.reduce((sum, u) => sum + parseInt(u.ocupacion), 0) / ubicaciones.length,
    }
  }, [productos, movimientos, ubicaciones])

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Disponible':
        return 'success'
      case 'Stock Bajo':
        return 'warning'
      case 'Stock Crítico':
        return 'danger'
      case 'Agotado':
        return 'secondary'
      default:
        return 'info'
    }
  }

  const getTipoMovimientoColor = (tipo) => {
    switch (tipo) {
      case 'Entrada':
        return 'success'
      case 'Salida':
        return 'danger'
      case 'Transferencia':
        return 'info'
      case 'Ajuste':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  /* ------------------ FUNCIONES PRINCIPALES ------------------ */
  const handleOpenModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    setVisibleModal(true)
  }

  const handleCloseModal = () => {
    setVisibleModal(false)
    setModalType(null)
    setSelectedItem(null)
  }

  const agregarProducto = (e) => {
    e.preventDefault()
    const nuevoProducto = {
      id: productos.length + 1,
      codigo: formProducto.codigo || `PROD-${String(productos.length + 1).padStart(3, '0')}`,
      nombre: formProducto.nombre,
      categoria: formProducto.categoria,
      subcategoria: formProducto.subcategoria,
      descripcion: formProducto.descripcion,
      ubicacion: formProducto.ubicacion,
      proveedor: formProducto.proveedor,
      precioCompra: parseFloat(formProducto.precioCompra),
      precioVenta: parseFloat(formProducto.precioVenta),
      stockActual: parseInt(formProducto.stockActual),
      stockMinimo: parseInt(formProducto.stockMinimo),
      stockMaximo: parseInt(formProducto.stockMaximo),
      unidadMedida: formProducto.unidadMedida,
      sku: formProducto.sku,
      estado: formProducto.estado,
      fechaIngreso: new Date().toISOString().split('T')[0],
      ultimaActualizacion: new Date().toISOString().split('T')[0],
    }

    setProductos([...productos, nuevoProducto])

    // Registrar movimiento de entrada
    const nuevoMovimiento = {
      id: movimientos.length + 1,
      tipo: 'Entrada',
      producto: nuevoProducto.nombre,
      codigoProducto: nuevoProducto.codigo,
      cantidad: nuevoProducto.stockActual,
      ubicacionOrigen: 'Nuevo Ingreso',
      ubicacionDestino: nuevoProducto.ubicacion,
      motivo: 'Alta de nuevo producto',
      usuario: 'Administrador',
      fecha: new Date().toLocaleString(),
      referencia: 'ALTA-PROD',
    }

    setMovimientos([nuevoMovimiento, ...movimientos])
    setFormProducto({
      codigo: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      descripcion: '',
      ubicacion: '',
      proveedor: '',
      precioCompra: '',
      precioVenta: '',
      stockActual: '',
      stockMinimo: '',
      stockMaximo: '',
      unidadMedida: '',
      sku: '',
      estado: 'Disponible',
    })

    handleCloseModal()
    alert('✅ Producto agregado exitosamente')
  }

  const registrarMovimiento = (e) => {
    e.preventDefault()

    const producto = productos.find((p) => p.id === parseInt(formMovimiento.productoId))
    if (!producto) {
      alert('❌ Producto no encontrado')
      return
    }

    const nuevoMovimiento = {
      id: movimientos.length + 1,
      tipo: formMovimiento.tipo,
      producto: producto.nombre,
      codigoProducto: producto.codigo,
      cantidad: parseInt(formMovimiento.cantidad),
      ubicacionOrigen: formMovimiento.ubicacionOrigen,
      ubicacionDestino: formMovimiento.ubicacionDestino,
      motivo: formMovimiento.motivo,
      usuario: 'Usuario Actual',
      fecha: new Date().toLocaleString(),
      referencia: formMovimiento.referencia || 'MOV-' + Date.now(),
    }

    // Actualizar stock del producto
    const nuevoStock =
      formMovimiento.tipo === 'Entrada'
        ? producto.stockActual + parseInt(formMovimiento.cantidad)
        : producto.stockActual - parseInt(formMovimiento.cantidad)

    if (nuevoStock < 0) {
      alert('❌ Stock insuficiente para realizar la salida')
      return
    }

    setProductos(
      productos.map((p) =>
        p.id === producto.id
          ? {
              ...p,
              stockActual: nuevoStock,
              estado:
                nuevoStock <= p.stockMinimo
                  ? 'Stock Bajo'
                  : nuevoStock <= p.stockMinimo * 0.5
                    ? 'Stock Crítico'
                    : 'Disponible',
              ultimaActualizacion: new Date().toISOString().split('T')[0],
            }
          : p,
      ),
    )

    setMovimientos([nuevoMovimiento, ...movimientos])
    setFormMovimiento({
      tipo: 'Entrada',
      productoId: '',
      cantidad: '',
      ubicacionOrigen: '',
      ubicacionDestino: '',
      motivo: '',
      referencia: '',
    })

    handleCloseModal()
    alert('✅ Movimiento registrado exitosamente')
  }

  const agregarProveedor = (e) => {
    e.preventDefault()

    const nuevoProveedor = {
      id: proveedores.length + 1,
      nombre: formProveedor.nombre,
      ruc: formProveedor.ruc,
      contacto: formProveedor.contacto,
      telefono: formProveedor.telefono,
      email: formProveedor.email,
      direccion: formProveedor.direccion,
      categoria: formProveedor.categoria,
      estado: formProveedor.estado,
      rating: 4.0,
    }

    setProveedores([...proveedores, nuevoProveedor])
    setFormProveedor({
      nombre: '',
      ruc: '',
      contacto: '',
      telefono: '',
      email: '',
      direccion: '',
      categoria: '',
      estado: 'Activo',
    })

    handleCloseModal()
    alert('✅ Proveedor agregado exitosamente')
  }

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter((p) => p.id !== id))
      alert('✅ Producto eliminado exitosamente')
    }
  }

  const generarReporte = (tipo) => {
    setLoading(true)
    setTimeout(() => {
      alert(`📊 Reporte ${tipo} generado exitosamente`)
      setLoading(false)
    }, 1500)
  }

  const realizarConteoFisico = (ubicacion) => {
    handleOpenModal('conteo', { ubicacion })
  }

  /* ------------------ FILTROS Y BÚSQUEDA ------------------ */
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const matchesSearch =
        !searchTerm ||
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.sku.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !selectedCategory || producto.categoria === selectedCategory
      const matchesLocation = !selectedLocation || producto.ubicacion.includes(selectedLocation)
      const matchesStatus = !selectedStatus || producto.estado === selectedStatus

      return matchesSearch && matchesCategory && matchesLocation && matchesStatus
    })
  }, [productos, searchTerm, selectedCategory, selectedLocation, selectedStatus])

  /* ------------------ RENDER ------------------ */
  return (
    <div className="inventario-almacen" style={{ backgroundColor: 'black' }}>
      {/* Header Principal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1 text-gradient-primary">
            <CIcon icon={cilStorage} className="me-2" />
            Sistema de Inventario y Almacén
          </h1>
          <p className="text-muted mb-0">Gestión integral de inventarios, almacenes y logística</p>
        </div>
        <div className="d-flex gap-2">
          <CDropdown>
            <CDropdownToggle color="primary">
              <CIcon icon={cilCloudDownload} className="me-2" />
              Reportes
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => generarReporte('Stock Actual')}>
                Stock Actual
              </CDropdownItem>
              <CDropdownItem onClick={() => generarReporte('Movimientos')}>
                Movimientos
              </CDropdownItem>
              <CDropdownItem onClick={() => generarReporte('Valuación')}>Valuación</CDropdownItem>
              <CDropdownItem onClick={() => generarReporte('Rotación')}>Rotación</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CButton color="success" onClick={() => handleOpenModal('producto')}>
            <CIcon icon={cilPlus} className="me-2" />
            Nuevo Producto
          </CButton>
        </div>
      </div>

      {/* KPI Cards - Dashboard */}
      <CRow className="mb-4 g-4">
        <CCol md={3}>
          <CWidgetStatsF
            color="info"
            icon={<CIcon icon={cilStorage} height={36} />}
            value={metricas.totalProductos.toString()}
            title="Total Productos"
            footer={`${productosFiltrados.length} mostrados`}
          />
        </CCol>
        <CCol md={3}>
          <CWidgetStatsF
            color="success"
            icon={<CIcon icon={cilDollar} height={36} />}
            value={`$${metricas.valorTotalInventario.toLocaleString()}`}
            title="Valor Inventario"
            footer="Valor en compra"
          />
        </CCol>
        <CCol md={3}>
          <CWidgetStatsF
            color="warning"
            icon={<CIcon icon={cilWarning} height={36} />}
            value={metricas.productosStockBajo.toString()}
            title="Stock Bajo"
            footer={`${metricas.productosStockCritico} críticos`}
          />
        </CCol>
        <CCol md={3}>
          <CWidgetStatsF
            color="primary"
            icon={<CIcon icon={cilSpeedometer} height={36} />}
            value={metricas.rotacionPromedio.toFixed(1)}
            title="Rotación Promedio"
            footer="Movimientos/producto"
          />
        </CCol>
      </CRow>

      {/* Alertas y Notificaciones */}
      {alertas.length > 0 && (
        <CCard className="mb-4 border-warning">
          <CCardBody className="p-3">
            <div className="d-flex align-items-center">
              <CIcon icon={cilBell} className="text-warning me-3" size="lg" />
              <div className="flex-grow-1">
                <h6 className="mb-1">Alertas del Sistema</h6>
                <div className="d-flex gap-3">
                  {alertas.slice(0, 3).map((alerta) => (
                    <CBadge
                      key={alerta.id}
                      color={
                        alerta.prioridad === 'alta'
                          ? 'danger'
                          : alerta.prioridad === 'media'
                            ? 'warning'
                            : 'info'
                      }
                      className="px-3 py-2"
                    >
                      <CIcon icon={cilWarning} className="me-1" />
                      {alerta.mensaje}
                    </CBadge>
                  ))}
                </div>
              </div>
              <CButton size="sm" color="warning" variant="outline">
                Ver Todas
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      )}

      {/* Navegación por pestañas */}
      <CCard className="shadow-sm border-0">
        <CCardHeader className="border-0 pt-3">
          <CNav variant="tabs" role="tablist" className="border-0">
            <CNavItem>
              <CNavLink
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                className="border-0"
              >
                <CIcon icon={cilSpeedometer} className="me-2" />
                Dashboard
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'productos'}
                onClick={() => setActiveTab('productos')}
                className="border-0"
              >
                <CIcon icon={cilStorage} className="me-2" />
                Productos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'movimientos'}
                onClick={() => setActiveTab('movimientos')}
                className="border-0"
              >
                <CIcon icon={cilTruck} className="me-2" />
                Movimientos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'proveedores'}
                onClick={() => setActiveTab('proveedores')}
                className="border-0"
              >
                <CIcon icon={cilPeople} className="me-2" />
                Proveedores
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'ordenes'}
                onClick={() => setActiveTab('ordenes')}
                className="border-0"
              >
                <CIcon icon={cilCart} className="me-2" />
                Órdenes Compra
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'ubicaciones'}
                onClick={() => setActiveTab('ubicaciones')}
                className="border-0"
              >
                <CIcon icon={cilLocationPin} className="me-2" />
                Ubicaciones
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'conteos'}
                onClick={() => setActiveTab('conteos')}
                className="border-0"
              >
                <CIcon icon={cilClipboard} className="me-2" />
                Conteos Físicos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'reportes'}
                onClick={() => setActiveTab('reportes')}
                className="border-0"
              >
                <CIcon icon={cilGraph} className="me-2" />
                Reportes
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>

        <CCardBody className="pt-4">
          <CTabContent>
            {/* Pestaña: Dashboard */}
            <CTabPane visible={activeTab === 'dashboard'}>
              <CRow>
                <CCol md={8}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h6 className="mb-0">Estado del Stock por Categoría</h6>
                    </CCardHeader>
                    <CCardBody>
                      <div className="table-responsive">
                        <CTable hover>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Categoría</CTableHeaderCell>
                              <CTableHeaderCell>Productos</CTableHeaderCell>
                              <CTableHeaderCell>Valor Total</CTableHeaderCell>
                              <CTableHeaderCell>Rotación</CTableHeaderCell>
                              <CTableHeaderCell>Estado</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {categorias.map((cat) => {
                              const productosCat = productos.filter(
                                (p) => p.categoria === cat.nombre,
                              )
                              const valorCat = productosCat.reduce(
                                (sum, p) => sum + p.precioCompra * p.stockActual,
                                0,
                              )
                              const stockBajoCat = productosCat.filter(
                                (p) => p.stockActual <= p.stockMinimo,
                              ).length

                              return (
                                <CTableRow key={cat.id}>
                                  <CTableDataCell className="fw-semibold">
                                    {cat.nombre}
                                  </CTableDataCell>
                                  <CTableDataCell>{productosCat.length} productos</CTableDataCell>
                                  <CTableDataCell className="fw-bold">
                                    ${valorCat.toLocaleString()}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 me-3">
                                        <CProgress value={60} color="info" />
                                      </div>
                                      <small>60%</small>
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color={stockBajoCat > 0 ? 'warning' : 'success'}>
                                      {stockBajoCat > 0 ? `${stockBajoCat} bajo` : 'Óptimo'}
                                    </CBadge>
                                  </CTableDataCell>
                                </CTableRow>
                              )
                            })}
                          </CTableBody>
                        </CTable>
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard>
                    <CCardHeader>
                      <h6 className="mb-0">Movimientos Recientes</h6>
                    </CCardHeader>
                    <CCardBody>
                      <CListGroup>
                        {movimientos.slice(0, 5).map((mov) => (
                          <CListGroupItem
                            key={mov.id}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <div className="fw-semibold">{mov.producto}</div>
                              <small className="text-muted">
                                {mov.tipo} • {mov.fecha} • {mov.usuario}
                              </small>
                            </div>
                            <div className="text-end">
                              <CBadge color={getTipoMovimientoColor(mov.tipo)} className="mb-1">
                                {mov.cantidad} unidades
                              </CBadge>
                              <div className="small text-muted">{mov.referencia}</div>
                            </div>
                          </CListGroupItem>
                        ))}
                      </CListGroup>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h6 className="mb-0">Resumen de Stock</h6>
                    </CCardHeader>
                    <CCardBody>
                      <div className="text-center mb-4">
                        <h3 className="fw-bold">{metricas.totalProductos}</h3>
                        <small className="text-muted">Productos Totales</small>
                      </div>
                      <CProgress
                        className="mb-3"
                        color="success"
                        value={metricas.estadoStock.normal}
                        max={metricas.totalProductos}
                      />
                      <CProgress
                        className="mb-3"
                        color="warning"
                        value={metricas.estadoStock.bajo}
                        max={metricas.totalProductos}
                      />
                      <CProgress
                        className="mb-3"
                        color="danger"
                        value={metricas.estadoStock.critico}
                        max={metricas.totalProductos}
                      />
                      <CProgress
                        color="info"
                        value={metricas.estadoStock.alto}
                        max={metricas.totalProductos}
                      />

                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-success">Normal</small>
                          <small>{metricas.estadoStock.normal}</small>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-warning">Bajo</small>
                          <small>{metricas.estadoStock.bajo}</small>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-danger">Crítico</small>
                          <small>{metricas.estadoStock.critico}</small>
                        </div>
                        <div className="d-flex justify-content-between">
                          <small className="text-info">Alto</small>
                          <small>{metricas.estadoStock.alto}</small>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard>
                    <CCardHeader>
                      <h6 className="mb-0">Ocupación de Almacenes</h6>
                    </CCardHeader>
                    <CCardBody>
                      {ubicaciones.map((ubic) => (
                        <div key={ubic.id} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">{ubic.nombre}</span>
                            <span>{ubic.ocupacion}</span>
                          </div>
                          <CProgress
                            value={parseInt(ubic.ocupacion)}
                            color={
                              parseInt(ubic.ocupacion) > 80
                                ? 'danger'
                                : parseInt(ubic.ocupacion) > 60
                                  ? 'warning'
                                  : 'success'
                            }
                          />
                          <small className="text-muted">{ubic.responsable}</small>
                        </div>
                      ))}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>

            {/* Pestaña: Productos */}
            <CTabPane visible={activeTab === 'productos'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilStorage} className="me-2" />
                    Catálogo de Productos
                  </h5>
                  <p className="text-muted mb-0">
                    {productosFiltrados.length} de {productos.length} productos
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <CFormInput
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '250px' }}
                  />
                  <CFormSelect
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ width: '150px' }}
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormSelect
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ width: '150px' }}
                  >
                    <option value="">Todos los estados</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Stock Bajo">Stock Bajo</option>
                    <option value="Stock Crítico">Stock Crítico</option>
                    <option value="Agotado">Agotado</option>
                  </CFormSelect>
                  <CButton color="primary" onClick={() => handleOpenModal('producto')}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Nuevo
                  </CButton>
                </div>
              </div>

              <div className="table-responsive">
                <CTable hover striped className="align-middle">
                  <CTableHead className="table-light">
                    <CTableRow>
                      <CTableHeaderCell>Código</CTableHeaderCell>
                      <CTableHeaderCell>Producto</CTableHeaderCell>
                      <CTableHeaderCell>Categoría</CTableHeaderCell>
                      <CTableHeaderCell>Stock</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Precio Compra</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Precio Venta</CTableHeaderCell>
                      <CTableHeaderCell>Ubicación</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Acciones</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {productosFiltrados.map((producto) => {
                      const porcentajeStock = (producto.stockActual / producto.stockMaximo) * 100
                      const esStockBajo = producto.stockActual <= producto.stockMinimo
                      const esStockCritico = producto.stockActual <= producto.stockMinimo * 0.5

                      return (
                        <CTableRow
                          key={producto.id}
                          className={
                            esStockCritico
                              ? 'table-danger-light'
                              : esStockBajo
                                ? 'table-warning-light'
                                : ''
                          }
                        >
                          <CTableDataCell>
                            <div className="fw-semibold">{producto.codigo}</div>
                            <small className="text-muted">{producto.sku}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="fw-semibold">{producto.nombre}</div>
                            <small className="text-muted">{producto.descripcion}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="info">{producto.categoria}</CBadge>
                            <div className="small text-muted">{producto.subcategoria}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="mb-1">
                              <strong>{producto.stockActual}</strong> / {producto.stockMaximo}{' '}
                              {producto.unidadMedida}
                            </div>
                            <CProgress
                              value={porcentajeStock}
                              color={
                                esStockCritico ? 'danger' : esStockBajo ? 'warning' : 'success'
                              }
                              className="mb-1"
                            />
                            <small className="text-muted">Mín: {producto.stockMinimo}</small>
                          </CTableDataCell>
                          <CTableDataCell className="text-end fw-bold">
                            ${producto.precioCompra.toFixed(2)}
                          </CTableDataCell>
                          <CTableDataCell className="text-end fw-bold text-success">
                            ${producto.precioVenta.toFixed(2)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{producto.ubicacion}</div>
                            <small className="text-muted">{producto.proveedor}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getEstadoColor(producto.estado)}>
                              {producto.estado}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="btn-group btn-group-sm">
                              <CButton
                                size="sm"
                                color="info"
                                variant="outline"
                                onClick={() => handleOpenModal('detalle', producto)}
                              >
                                <CIcon icon={cilMagnifyingGlass} />
                              </CButton>
                              <CButton
                                size="sm"
                                color="warning"
                                variant="outline"
                                onClick={() => handleOpenModal('editar', producto)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                variant="outline"
                                onClick={() => eliminarProducto(producto.id)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                              <CButton
                                size="sm"
                                color="primary"
                                variant="outline"
                                onClick={() => handleOpenModal('movimiento', producto)}
                              >
                                <CIcon icon={cilTruck} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>

            {/* Pestaña: Movimientos */}
            <CTabPane visible={activeTab === 'movimientos'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilTruck} className="me-2" />
                    Registro de Movimientos
                  </h5>
                  <p className="text-muted mb-0">
                    Historial completo de entradas, salidas y transferencias
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <CButton color="success" onClick={() => handleOpenModal('movimiento')}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Nuevo Movimiento
                  </CButton>
                  <CButton color="primary" variant="outline">
                    <CIcon icon={cilFilter} className="me-1" />
                    Filtrar
                  </CButton>
                </div>
              </div>

              <div className="table-responsive">
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha/Hora</CTableHeaderCell>
                      <CTableHeaderCell>Tipo</CTableHeaderCell>
                      <CTableHeaderCell>Producto</CTableHeaderCell>
                      <CTableHeaderCell>Cantidad</CTableHeaderCell>
                      <CTableHeaderCell>Ubicaciones</CTableHeaderCell>
                      <CTableHeaderCell>Motivo/Referencia</CTableHeaderCell>
                      <CTableHeaderCell>Usuario</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {movimientos.map((mov) => (
                      <CTableRow key={mov.id}>
                        <CTableDataCell>
                          <div>{mov.fecha.split(' ')[0]}</div>
                          <small className="text-muted">{mov.fecha.split(' ')[1]}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getTipoMovimientoColor(mov.tipo)}>{mov.tipo}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold">{mov.producto}</div>
                          <small className="text-muted">{mov.codigoProducto}</small>
                        </CTableDataCell>
                        <CTableDataCell className="fw-bold">{mov.cantidad} unidades</CTableDataCell>
                        <CTableDataCell>
                          <div className="small">
                            <div>Origen: {mov.ubicacionOrigen}</div>
                            <div>Destino: {mov.ubicacionDestino}</div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{mov.motivo}</div>
                          <small className="text-muted">{mov.referencia}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <small className="text-muted">{mov.usuario}</small>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>

            {/* Pestaña: Proveedores */}
            <CTabPane visible={activeTab === 'proveedores'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilPeople} className="me-2" />
                    Gestión de Proveedores
                  </h5>
                  <p className="text-muted mb-0">Catálogo y evaluación de proveedores</p>
                </div>
                <CButton color="success" onClick={() => handleOpenModal('proveedor')}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Nuevo Proveedor
                </CButton>
              </div>

              <CRow>
                {proveedores.map((prov) => (
                  <CCol md={4} key={prov.id} className="mb-4">
                    <CCard className="h-100">
                      <CCardBody>
                        <div className="text-center mb-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-2">
                            <CIcon icon={cilBuilding} size="xl" className="text-primary" />
                          </div>
                          <h5 className="fw-bold mb-1">{prov.nombre}</h5>
                          <small className="text-muted">RUC: {prov.ruc}</small>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilTags} className="me-2 text-muted" />
                            <span>{prov.categoria}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilPeople} className="me-2 text-muted" />
                            <span>{prov.contacto}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <CIcon icon={cilLocationPin} className="me-2 text-muted" />
                            <span className="small">{prov.direccion}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilCash} className="me-2 text-muted" />
                            <span>Rating: {prov.rating}/5.0</span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <CBadge color={prov.estado === 'Activo' ? 'success' : 'secondary'}>
                            {prov.estado}
                          </CBadge>
                          <div className="btn-group">
                            <CButton size="sm" color="info" variant="outline">
                              <CIcon icon={cilMagnifyingGlass} />
                            </CButton>
                            <CButton size="sm" color="warning" variant="outline">
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </CTabPane>

            {/* Pestaña: Órdenes de Compra */}
            <CTabPane visible={activeTab === 'ordenes'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilCart} className="me-2" />
                    Órdenes de Compra
                  </h5>
                  <p className="text-muted mb-0">Gestión de compras y pedidos a proveedores</p>
                </div>
                <CButton color="success" onClick={() => handleOpenModal('orden')}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Nueva Orden
                </CButton>
              </div>

              <div className="table-responsive">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Número</CTableHeaderCell>
                      <CTableHeaderCell>Proveedor</CTableHeaderCell>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Productos</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Acciones</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {ordenesCompra.map((orden) => (
                      <CTableRow key={orden.id}>
                        <CTableDataCell className="fw-semibold">{orden.numero}</CTableDataCell>
                        <CTableDataCell>
                          <div>{orden.proveedor}</div>
                          <small className="text-muted">ID: {orden.id}</small>
                        </CTableDataCell>
                        <CTableDataCell>{orden.fecha}</CTableDataCell>
                        <CTableDataCell>
                          <div className="small">
                            {orden.productos.map((p, idx) => (
                              <div key={idx}>
                                {p.cantidad} x {p.nombre}
                              </div>
                            ))}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-end fw-bold">
                          ${orden.total.toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={orden.estado === 'Completada' ? 'success' : 'warning'}>
                            {orden.estado}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="btn-group btn-group-sm">
                            <CButton size="sm" color="info" variant="outline">
                              Ver
                            </CButton>
                            <CButton size="sm" color="warning" variant="outline">
                              Editar
                            </CButton>
                            <CButton size="sm" color="success" variant="outline">
                              Recibir
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>

            {/* Pestaña: Ubicaciones */}
            <CTabPane visible={activeTab === 'ubicaciones'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    Gestión de Ubicaciones
                  </h5>
                  <p className="text-muted mb-0">Administración de almacenes y bodegas</p>
                </div>
                <CButton color="primary" variant="outline">
                  <CIcon icon={cilPlus} className="me-2" />
                  Nueva Ubicación
                </CButton>
              </div>

              <CRow>
                {ubicaciones.map((ubic) => {
                  const productosUbic = productos.filter((p) => p.ubicacion.includes(ubic.nombre))
                  const valorUbic = productosUbic.reduce(
                    (sum, p) => sum + p.precioCompra * p.stockActual,
                    0,
                  )

                  return (
                    <CCol md={6} key={ubic.id} className="mb-4">
                      <CCard className="h-100">
                        <CCardHeader>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{ubic.nombre}</h6>
                            <CBadge
                              color={
                                parseInt(ubic.ocupacion) > 80
                                  ? 'danger'
                                  : parseInt(ubic.ocupacion) > 60
                                    ? 'warning'
                                    : 'success'
                              }
                            >
                              {ubic.ocupacion} ocupado
                            </CBadge>
                          </div>
                        </CCardHeader>
                        <CCardBody>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <small>Capacidad</small>
                              <small>{ubic.capacidad}</small>
                            </div>
                            <CProgress
                              value={parseInt(ubic.ocupacion)}
                              color={
                                parseInt(ubic.ocupacion) > 80
                                  ? 'danger'
                                  : parseInt(ubic.ocupacion) > 60
                                    ? 'warning'
                                    : 'success'
                              }
                            />
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <div className="text-center p-2 border rounded">
                                <div className="fw-bold">{productosUbic.length}</div>
                                <small className="text-muted">Productos</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-center p-2 border rounded">
                                <div className="fw-bold">${valorUbic.toLocaleString()}</div>
                                <small className="text-muted">Valor</small>
                              </div>
                            </div>
                          </div>

                          <div className="small text-muted">
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilPeople} className="me-2" />
                              <span>Responsable: {ubic.responsable}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <CButton
                              color="primary"
                              size="sm"
                              className="w-100"
                              onClick={() => realizarConteoFisico(ubic)}
                            >
                              <CIcon icon={cilClipboard} className="me-2" />
                              Realizar Conteo
                            </CButton>
                          </div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  )
                })}
              </CRow>
            </CTabPane>

            {/* Pestaña: Conteos Físicos */}
            <CTabPane visible={activeTab === 'conteos'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilClipboard} className="me-2" />
                    Conteos Físicos de Inventario
                  </h5>
                  <p className="text-muted mb-0">Control y auditoría de inventarios</p>
                </div>
                <CButton color="success" onClick={() => handleOpenModal('conteo')}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Nuevo Conteo
                </CButton>
              </div>

              <div className="table-responsive">
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Ubicación</CTableHeaderCell>
                      <CTableHeaderCell>Responsable</CTableHeaderCell>
                      <CTableHeaderCell>Productos</CTableHeaderCell>
                      <CTableHeaderCell>Diferencia</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Acciones</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {conteosFisicos.map((conteo) => (
                      <CTableRow key={conteo.id}>
                        <CTableDataCell>{conteo.fecha}</CTableDataCell>
                        <CTableDataCell className="fw-semibold">{conteo.ubicacion}</CTableDataCell>
                        <CTableDataCell>{conteo.responsable}</CTableDataCell>
                        <CTableDataCell>
                          <div>
                            {conteo.productosContados} de {conteo.productosTotales}
                          </div>
                          <CProgress
                            value={(conteo.productosContados / conteo.productosTotales) * 100}
                          />
                        </CTableDataCell>
                        <CTableDataCell
                          className={
                            conteo.diferencia > 0 ? 'text-danger fw-bold' : 'text-success fw-bold'
                          }
                        >
                          {conteo.diferencia > 0 ? `+${conteo.diferencia}` : conteo.diferencia}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={conteo.estado === 'Completado' ? 'success' : 'warning'}>
                            {conteo.estado}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton size="sm" color="info" variant="outline">
                            Ver Detalle
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>

            {/* Pestaña: Reportes */}
            <CTabPane visible={activeTab === 'reportes'}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">
                    <CIcon icon={cilGraph} className="me-2" />
                    Reportes y Análisis
                  </h5>
                  <p className="text-muted mb-0">Generación de reportes y análisis de inventario</p>
                </div>
                <CButton color="primary">
                  <CIcon icon={cilPrint} className="me-2" />
                  Imprimir Todos
                </CButton>
              </div>

              <CRow>
                <CCol md={4} className="mb-4">
                  <CCard className="h-100 text-center">
                    <CCardBody className="d-flex flex-column">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                        <CIcon icon={cilStorage} size="xl" className="text-primary" />
                      </div>
                      <h5 className="fw-bold">Reporte de Stock</h5>
                      <p className="text-muted mb-4">Estado actual de inventario con valores</p>
                      <CButton
                        color="primary"
                        className="mt-auto"
                        onClick={() => generarReporte('Stock Actual')}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" /> : 'Generar Reporte'}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4} className="mb-4">
                  <CCard className="h-100 text-center">
                    <CCardBody className="d-flex flex-column">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                        <CIcon icon={cilTruck} size="xl" className="text-success" />
                      </div>
                      <h5 className="fw-bold">Movimientos</h5>
                      <p className="text-muted mb-4">Historial completo de transacciones</p>
                      <CButton
                        color="success"
                        className="mt-auto"
                        onClick={() => generarReporte('Movimientos')}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" /> : 'Generar Reporte'}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4} className="mb-4">
                  <CCard className="h-100 text-center">
                    <CCardBody className="d-flex flex-column">
                      <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                        <CIcon icon={cilChart} size="xl" className="text-warning" />
                      </div>
                      <h5 className="fw-bold">Rotación</h5>
                      <p className="text-muted mb-4">Análisis de rotación de inventario</p>
                      <CButton
                        color="warning"
                        className="mt-auto"
                        onClick={() => generarReporte('Rotación')}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" /> : 'Generar Reporte'}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4} className="mb-4">
                  <CCard className="h-100 text-center">
                    <CCardBody className="d-flex flex-column">
                      <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                        <CIcon icon={cilDollar} size="xl" className="text-info" />
                      </div>
                      <h5 className="fw-bold">Valuación</h5>
                      <p className="text-muted mb-4">Valoración económica del inventario</p>
                      <CButton
                        color="info"
                        className="mt-auto"
                        onClick={() => generarReporte('Valuación')}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" /> : 'Generar Reporte'}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4} className="mb-4">
                  <CCard className="h-100 text-center">
                    <CCardBody className="d-flex flex-column">
                      <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                        <CIcon icon={cilWarning} size="xl" className="text-danger" />
                      </div>
                      <h5 className="fw-bold">Alertas</h5>
                      <p className="text-muted mb-4">Reporte de productos con stock bajo</p>
                      <CButton
                        color="danger"
                        className="mt-auto"
                        onClick={() => generarReporte('Alertas')}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" /> : 'Generar Reporte'}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4} className="mb-4">
                  <CCard className="h-100 text-center">
                    <CCardBody className="d-flex flex-column">
                      <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                        <CIcon icon={cilClipboard} size="xl" className="text-secondary" />
                      </div>
                      <h5 className="fw-bold">Conteos</h5>
                      <p className="text-muted mb-4">Resultados de conteos físicos</p>
                      <CButton
                        color="secondary"
                        className="mt-auto"
                        onClick={() => generarReporte('Conteos')}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" /> : 'Generar Reporte'}
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Modales */}
      <CModal
        visible={visibleModal}
        onClose={handleCloseModal}
        size={
          modalType === 'detalle' || modalType === 'orden'
            ? 'lg'
            : modalType === 'conteo'
              ? 'xl'
              : 'md'
        }
      >
        <CModalHeader closeButton>
          <CModalTitle>
            {modalType === 'producto' && '📦 Nuevo Producto'}
            {modalType === 'editar' && '✏️ Editar Producto'}
            {modalType === 'detalle' && '🔍 Detalle del Producto'}
            {modalType === 'movimiento' && '🚚 Nuevo Movimiento'}
            {modalType === 'proveedor' && '🏢 Nuevo Proveedor'}
            {modalType === 'orden' && '🛒 Nueva Orden de Compra'}
            {modalType === 'conteo' && '📋 Nuevo Conteo Físico'}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {modalType === 'producto' && (
            <CForm onSubmit={agregarProducto}>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Código del Producto</CFormLabel>
                  <CFormInput
                    value={formProducto.codigo}
                    onChange={(e) => setFormProducto({ ...formProducto, codigo: e.target.value })}
                    placeholder="PROD-001"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>SKU</CFormLabel>
                  <CFormInput
                    value={formProducto.sku}
                    onChange={(e) => setFormProducto({ ...formProducto, sku: e.target.value })}
                    placeholder="SKU-UNICO"
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Nombre del Producto</CFormLabel>
                  <CFormInput
                    value={formProducto.nombre}
                    onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                    placeholder="Nombre completo del producto"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Categoría</CFormLabel>
                  <CFormSelect
                    value={formProducto.categoria}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, categoria: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Subcategoría</CFormLabel>
                  <CFormInput
                    value={formProducto.subcategoria}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, subcategoria: e.target.value })
                    }
                    placeholder="Subcategoría"
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Descripción</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formProducto.descripcion}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, descripcion: e.target.value })
                    }
                    placeholder="Descripción detallada del producto"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Ubicación</CFormLabel>
                  <CFormSelect
                    value={formProducto.ubicacion}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, ubicacion: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar ubicación</option>
                    {ubicaciones.map((ubic) => (
                      <option key={ubic.id} value={ubic.nombre}>
                        {ubic.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Proveedor</CFormLabel>
                  <CFormSelect
                    value={formProducto.proveedor}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, proveedor: e.target.value })
                    }
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((prov) => (
                      <option key={prov.id} value={prov.nombre}>
                        {prov.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Precio de Compra</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>$</CInputGroupText>
                    <CFormInput
                      type="number"
                      step="0.01"
                      value={formProducto.precioCompra}
                      onChange={(e) =>
                        setFormProducto({ ...formProducto, precioCompra: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Precio de Venta</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>$</CInputGroupText>
                    <CFormInput
                      type="number"
                      step="0.01"
                      value={formProducto.precioVenta}
                      onChange={(e) =>
                        setFormProducto({ ...formProducto, precioVenta: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Unidad de Medida</CFormLabel>
                  <CFormInput
                    value={formProducto.unidadMedida}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, unidadMedida: e.target.value })
                    }
                    placeholder="Unidad, Kilo, Litro..."
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Stock Actual</CFormLabel>
                  <CFormInput
                    type="number"
                    value={formProducto.stockActual}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, stockActual: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Stock Mínimo</CFormLabel>
                  <CFormInput
                    type="number"
                    value={formProducto.stockMinimo}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, stockMinimo: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Stock Máximo</CFormLabel>
                  <CFormInput
                    type="number"
                    value={formProducto.stockMaximo}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, stockMaximo: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Estado</CFormLabel>
                  <CFormSelect
                    value={formProducto.estado}
                    onChange={(e) => setFormProducto({ ...formProducto, estado: e.target.value })}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Stock Bajo">Stock Bajo</option>
                    <option value="Stock Crítico">Stock Crítico</option>
                    <option value="Agotado">Agotado</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CModalFooter>
                <CButton color="secondary" onClick={handleCloseModal}>
                  Cancelar
                </CButton>
                <CButton type="submit" color="success" className="fw-bold">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Guardar Producto
                </CButton>
              </CModalFooter>
            </CForm>
          )}

          {modalType === 'movimiento' && (
            <CForm onSubmit={registrarMovimiento}>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Tipo de Movimiento</CFormLabel>
                  <CFormSelect
                    value={formMovimiento.tipo}
                    onChange={(e) => setFormMovimiento({ ...formMovimiento, tipo: e.target.value })}
                    required
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Ajuste">Ajuste</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Producto</CFormLabel>
                  <CFormSelect
                    value={formMovimiento.productoId}
                    onChange={(e) =>
                      setFormMovimiento({ ...formMovimiento, productoId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.codigo} - {prod.nombre} (Stock: {prod.stockActual})
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Cantidad</CFormLabel>
                  <CFormInput
                    type="number"
                    value={formMovimiento.cantidad}
                    onChange={(e) =>
                      setFormMovimiento({ ...formMovimiento, cantidad: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Referencia</CFormLabel>
                  <CFormInput
                    value={formMovimiento.referencia}
                    onChange={(e) =>
                      setFormMovimiento({ ...formMovimiento, referencia: e.target.value })
                    }
                    placeholder="OC-2025-001, REQ-001, etc."
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Ubicación Origen</CFormLabel>
                  <CFormInput
                    value={formMovimiento.ubicacionOrigen}
                    onChange={(e) =>
                      setFormMovimiento({ ...formMovimiento, ubicacionOrigen: e.target.value })
                    }
                    placeholder="Almacén A, Proveedor, etc."
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Ubicación Destino</CFormLabel>
                  <CFormInput
                    value={formMovimiento.ubicacionDestino}
                    onChange={(e) =>
                      setFormMovimiento({ ...formMovimiento, ubicacionDestino: e.target.value })
                    }
                    placeholder="Almacén B, Departamento, etc."
                    required
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Motivo</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    value={formMovimiento.motivo}
                    onChange={(e) =>
                      setFormMovimiento({ ...formMovimiento, motivo: e.target.value })
                    }
                    placeholder="Descripción del motivo del movimiento"
                    required
                  />
                </CCol>
              </CRow>

              <CModalFooter>
                <CButton color="secondary" onClick={handleCloseModal}>
                  Cancelar
                </CButton>
                <CButton type="submit" color="primary" className="fw-bold">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Registrar Movimiento
                </CButton>
              </CModalFooter>
            </CForm>
          )}

          {modalType === 'proveedor' && (
            <CForm onSubmit={agregarProveedor}>
              <CRow className="g-3">
                <CCol md={12}>
                  <CFormLabel>Nombre del Proveedor</CFormLabel>
                  <CFormInput
                    value={formProveedor.nombre}
                    onChange={(e) => setFormProveedor({ ...formProveedor, nombre: e.target.value })}
                    placeholder="Nombre completo del proveedor"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>RUC/NIT</CFormLabel>
                  <CFormInput
                    value={formProveedor.ruc}
                    onChange={(e) => setFormProveedor({ ...formProveedor, ruc: e.target.value })}
                    placeholder="Número de identificación"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Contacto</CFormLabel>
                  <CFormInput
                    value={formProveedor.contacto}
                    onChange={(e) =>
                      setFormProveedor({ ...formProveedor, contacto: e.target.value })
                    }
                    placeholder="Persona de contacto"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Teléfono</CFormLabel>
                  <CFormInput
                    value={formProveedor.telefono}
                    onChange={(e) =>
                      setFormProveedor({ ...formProveedor, telefono: e.target.value })
                    }
                    placeholder="Número de teléfono"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput
                    type="email"
                    value={formProveedor.email}
                    onChange={(e) => setFormProveedor({ ...formProveedor, email: e.target.value })}
                    placeholder="correo@proveedor.com"
                    required
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Dirección</CFormLabel>
                  <CFormInput
                    value={formProveedor.direccion}
                    onChange={(e) =>
                      setFormProveedor({ ...formProveedor, direccion: e.target.value })
                    }
                    placeholder="Dirección completa"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Categoría</CFormLabel>
                  <CFormSelect
                    value={formProveedor.categoria}
                    onChange={(e) =>
                      setFormProveedor({ ...formProveedor, categoria: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Mobiliario">Mobiliario</option>
                    <option value="Papelería">Papelería</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Seguridad">Seguridad</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Estado</CFormLabel>
                  <CFormSelect
                    value={formProveedor.estado}
                    onChange={(e) => setFormProveedor({ ...formProveedor, estado: e.target.value })}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Suspendido">Suspendido</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CModalFooter>
                <CButton color="secondary" onClick={handleCloseModal}>
                  Cancelar
                </CButton>
                <CButton type="submit" color="success" className="fw-bold">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Guardar Proveedor
                </CButton>
              </CModalFooter>
            </CForm>
          )}

          {modalType === 'detalle' && selectedItem && (
            <div>
              <CRow className="mb-4">
                <CCol md={8}>
                  <h5 className="fw-bold">{selectedItem.nombre}</h5>
                  <p className="text-muted">{selectedItem.descripcion}</p>
                </CCol>
                <CCol md={4} className="text-end">
                  <CBadge color={getEstadoColor(selectedItem.estado)} className="px-3 py-2">
                    {selectedItem.estado}
                  </CBadge>
                </CCol>
              </CRow>

              <CRow className="g-3">
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Código / SKU</small>
                    <div className="fw-bold">
                      {selectedItem.codigo} / {selectedItem.sku}
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Categoría</small>
                    <div className="fw-bold">
                      {selectedItem.categoria} - {selectedItem.subcategoria}
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Ubicación</small>
                    <div className="fw-bold">{selectedItem.ubicacion}</div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Proveedor</small>
                    <div className="fw-bold">{selectedItem.proveedor}</div>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="border rounded p-3 text-center">
                    <small className="text-muted">Stock Actual</small>
                    <div className="fw-bold h4 mb-0">{selectedItem.stockActual}</div>
                    <small>{selectedItem.unidadMedida}</small>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="border rounded p-3 text-center">
                    <small className="text-muted">Precio Compra</small>
                    <div className="fw-bold h4 mb-0">${selectedItem.precioCompra.toFixed(2)}</div>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="border rounded p-3 text-center">
                    <small className="text-muted">Precio Venta</small>
                    <div className="fw-bold h4 mb-0 text-success">
                      ${selectedItem.precioVenta.toFixed(2)}
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Stock Mínimo</small>
                    <div className="fw-bold">{selectedItem.stockMinimo}</div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Stock Máximo</small>
                    <div className="fw-bold">{selectedItem.stockMaximo}</div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Fecha de Ingreso</small>
                    <div className="fw-bold">{selectedItem.fechaIngreso}</div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="border rounded p-3">
                    <small className="text-muted">Última Actualización</small>
                    <div className="fw-bold">{selectedItem.ultimaActualizacion}</div>
                  </div>
                </CCol>
              </CRow>

              <div className="mt-4">
                <h6 className="mb-3">Historial de Movimientos</h6>
                <CListGroup>
                  {movimientos
                    .filter((m) => m.codigoProducto === selectedItem.codigo)
                    .slice(0, 5)
                    .map((mov) => (
                      <CListGroupItem
                        key={mov.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-semibold">
                            {mov.tipo} - {mov.fecha}
                          </div>
                          <small className="text-muted">{mov.motivo}</small>
                        </div>
                        <CBadge color={getTipoMovimientoColor(mov.tipo)}>
                          {mov.cantidad} unidades
                        </CBadge>
                      </CListGroupItem>
                    ))}
                </CListGroup>
              </div>

              <CModalFooter>
                <CButton color="secondary" onClick={handleCloseModal}>
                  Cerrar
                </CButton>
                <CButton
                  color="primary"
                  onClick={() => handleOpenModal('movimiento', selectedItem)}
                >
                  <CIcon icon={cilTruck} className="me-2" />
                  Registrar Movimiento
                </CButton>
              </CModalFooter>
            </div>
          )}

          {modalType === 'conteo' && (
            <div>
              <CAlert color="info" className="mb-4">
                <CIcon icon={cilInfo} className="me-2" />
                <strong>Conteo Físico:</strong> Registre la cantidad real de productos en el almacén
                seleccionado.
              </CAlert>

              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Ubicación</CFormLabel>
                  <CFormSelect>
                    <option value="">Seleccionar ubicación</option>
                    {ubicaciones.map((ubic) => (
                      <option key={ubic.id} value={ubic.nombre}>
                        {ubic.nombre}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Fecha del Conteo</CFormLabel>
                  <CFormInput type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Responsable</CFormLabel>
                  <CFormInput placeholder="Nombre del responsable del conteo" />
                </CCol>
              </CRow>

              <div className="mt-4">
                <h6 className="mb-3">Productos en la Ubicación</h6>
                <div className="table-responsive">
                  <CTable hover size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Producto</CTableHeaderCell>
                        <CTableHeaderCell>Stock Sistema</CTableHeaderCell>
                        <CTableHeaderCell>Conteo Físico</CTableHeaderCell>
                        <CTableHeaderCell>Diferencia</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {productos.slice(0, 5).map((prod) => (
                        <CTableRow key={prod.id}>
                          <CTableDataCell>
                            <div className="small">{prod.nombre}</div>
                            <small className="text-muted">{prod.codigo}</small>
                          </CTableDataCell>
                          <CTableDataCell className="fw-bold">{prod.stockActual}</CTableDataCell>
                          <CTableDataCell>
                            <CFormInput type="number" placeholder="0" size="sm" />
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span className="text-muted">-</span>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </div>

              <CModalFooter>
                <CButton color="secondary" onClick={handleCloseModal}>
                  Cancelar
                </CButton>
                <CButton color="success" className="fw-bold">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Finalizar Conteo
                </CButton>
              </CModalFooter>
            </div>
          )}
        </CModalBody>
      </CModal>

      {/* CSS Inline */}
      <style jsx>{`
        .inventario-almacen {
          min-height: 100vh;
          padding: 20px;
          background: #1e2128 !important;
        }

        .bg.inventario-almacen {
          min-height: 100vh;
          background: #ffffff;
          transition: background 0.3s ease;
        }

        .text-gradient-primary {
          background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .table-danger-light {
          background-color: rgba(220, 53, 69, 0.05);
        }

        .table-warning-light {
          background-color: rgba(255, 193, 7, 0.05);
        }

        .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s;
        }

        .nav-tabs .nav-link.active {
          color: #20c997;
          border-bottom: 3px solid #20c997;
          background: transparent;
        }

        .nav-tabs .nav-link:hover {
          color: #17a2b8;
          background: rgba(32, 201, 151, 0.1);
        }

        .card {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e9ecef;
          transition: transform 0.3s;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .progress {
          height: 8px;
          border-radius: 4px;
        }

        .btn-group-sm .btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .widget-stats-f {
          transition: transform 0.3s;
        }

        .widget-stats-f:hover {
          transform: translateY(-2px);
        }

        .modal-content {
          border-radius: 15px;
        }

        .border-dashed {
          border-style: dashed !important;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  )
}

export default InventarioAlmacen
