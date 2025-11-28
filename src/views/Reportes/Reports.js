import React, { useState, useEffect } from "react"
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CBadge
} from "@coreui/react"

// Importar iconos CORRECTAMENTE desde @coreui/icons
import { 
  cilCalendar,
  cilFilter,
  cilChart,
  cilPrint,
} from "@coreui/icons"

import CIcon from "@coreui/icons-react"

const API_BASE = 'http://localhost:4000'
const API_REPORTS = `${API_BASE}/reports`
const API_VENTAS = `${API_BASE}/ventas`
const API_STOCK = `${API_BASE}/stock`
const API_TRABAJADORES = `${API_BASE}/trabajadores`
const API_PRODUCCION = `${API_BASE}/produccion`

export const Reports = () => {

  // ------------------ TOAST ------------------
  const [toasts, setToasts] = useState([])

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])
  }

  // ------------------ ESTADOS ------------------
  const [tipoReporte, setTipoReporte] = useState("general")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [areaFiltro, setAreaFiltro] = useState("")
  const [cargando, setCargando] = useState(false)
  const [datosReporte, setDatosReporte] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  // ------------------ DATOS DE EJEMPLO ------------------
  const areas = ["Almacén", "Producción", "Ventas", "Administración", "Calidad"]
  const categoriasProductos = ["Electrónicos", "Ropa", "Alimentos", "Herramientas", "Hogar"]

  // ------------------ CARGAR REPORTE ------------------
  const generarReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      showToast("warning", "Seleccione un rango de fechas.")
      return
    }

    setCargando(true)
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let datos
      switch (tipoReporte) {
        case "general":
          datos = await generarReporteGeneral()
          break
        case "ventas":
          datos = await generarReporteVentas()
          break
        case "trabajadores":
          datos = await generarReporteTrabajadores()
          break
        case "produccion":
          datos = await generarReporteProduccion()
          break
        case "stock":
          datos = await generarReporteStock()
          break
        default:
          datos = null
      }

      setDatosReporte(datos)
      showToast("success", "Reporte generado correctamente.")
      
    } catch (err) {
      console.error(err)
      showToast("danger", "Error al generar el reporte.")
    } finally {
      setCargando(false)
    }
  }

  // ------------------ REPORTE GENERAL ------------------
  const generarReporteGeneral = async () => {
    return {
      titulo: "Reporte General",
      periodo: `${fechaInicio} a ${fechaFin}`,
      metricas: [
        { nombre: "Ventas Totales", valor: "$45,680.00", tendencia: "+12%" },
        { nombre: "Productos Vendidos", valor: "1,245", tendencia: "+8%" },
        { nombre: "Clientes Nuevos", valor: "45", tendencia: "+15%" },
        { nombre: "Órdenes Completadas", valor: "89", tendencia: "+5%" }
      ],
      datos: [
        { categoria: "Ventas Diarias Promedio", valor: "$2,284.00" },
        { categoria: "Productos en Stock", valor: "567" },
        { categoria: "Trabajadores Activos", valor: "23" },
        { categoria: "Órdenes de Producción", valor: "34" }
      ]
    }
  }

  // ------------------ REPORTE VENTAS ------------------
  const generarReporteVentas = async () => {
    return {
      titulo: "Reporte de Ventas",
      periodo: `${fechaInicio} a ${fechaFin}`,
      metricas: [
        { nombre: "Ventas Totales", valor: "$45,680.00", tendencia: "+12%" },
        { nombre: "Costo de Ventas", valor: "$28,450.00", tendencia: "+10%" },
        { nombre: "Margen Bruto", valor: "$17,230.00", tendencia: "+15%" },
        { nombre: "Ventas Promedio/Día", valor: "$1,522.67", tendencia: "+8%" }
      ],
      datos: [
        { producto: "Laptop HP", cantidad: 45, total: "$22,500.00" },
        { producto: "Mouse Inalámbrico", cantidad: 120, total: "$2,400.00" },
        { producto: "Teclado Mecánico", cantidad: 78, total: "$5,460.00" },
        { producto: "Monitor 24\"", cantidad: 34, total: "$6,800.00" },
        { producto: "Impresora Laser", cantidad: 23, total: "$4,600.00" }
      ]
    }
  }

  // ------------------ REPORTE TRABAJADORES ------------------
  const generarReporteTrabajadores = async () => {
    return {
      titulo: "Reporte de Trabajadores",
      periodo: `${fechaInicio} a ${fechaFin}`,
      metricas: [
        { nombre: "Total Trabajadores", valor: "23", tendencia: "+2" },
        { nombre: "Horas Trabajadas", valor: "920", tendencia: "+5%" },
        { nombre: "Productividad Promedio", valor: "89%", tendencia: "+3%" },
        { nombre: "Ausencias", valor: "4", tendencia: "-1" }
      ],
      datos: [
        { nombre: "Juan Pérez", area: "Producción", horas: 40, productividad: "95%" },
        { nombre: "María García", area: "Ventas", horas: 42, productividad: "88%" },
        { nombre: "Carlos López", area: "Almacén", horas: 38, productividad: "92%" },
        { nombre: "Ana Martínez", area: "Calidad", horas: 40, productividad: "96%" },
        { nombre: "Pedro Rodríguez", area: "Producción", horas: 36, productividad: "85%" }
      ]
    }
  }

  // ------------------ REPORTE PRODUCCIÓN ------------------
  const generarReporteProduccion = async () => {
    return {
      titulo: "Reporte de Producción",
      periodo: `${fechaInicio} a ${fechaFin}`,
      metricas: [
        { nombre: "Unidades Producidas", valor: "1,567", tendencia: "+12%" },
        { nombre: "Tasa de Defectos", valor: "2.3%", tendencia: "-0.5%" },
        { nombre: "Eficiencia", valor: "87%", tendencia: "+4%" },
        { nombre: "Órdenes Completadas", valor: "45", tendencia: "+8%" }
      ],
      datos: [
        { producto: "Laptop HP", producidas: 500, defectos: 8, eficiencia: "94%" },
        { producto: "Monitor 24\"", producidas: 350, defectos: 12, eficiencia: "85%" },
        { producto: "Teclado Mecánico", producidas: 450, defectos: 5, eficiencia: "96%" },
        { producto: "Mouse Inalámbrico", producidas: 267, defectos: 3, eficiencia: "98%" }
      ]
    }
  }

  // ------------------ REPORTE STOCK ------------------
  const generarReporteStock = async () => {
    return {
      titulo: "Reporte de Stock por Áreas",
      periodo: `Actualizado al ${new Date().toLocaleDateString()}`,
      metricas: [
        { nombre: "Total Productos", valor: "567", tendencia: "+23" },
        { nombre: "Stock Bajo", valor: "12", tendencia: "-3" },
        { nombre: "Stock Crítico", valor: "3", tendencia: "-1" },
        { nombre: "Valor Total Inventario", valor: "$156,780.00", tendencia: "+8%" }
      ],
      datos: [
        { area: "Almacén Principal", productos: 234, valor: "$89,450.00", stockBajo: 4 },
        { area: "Producción", productos: 156, valor: "$45,670.00", stockBajo: 5 },
        { area: "Ventas", productos: 89, valor: "$12,450.00", stockBajo: 2 },
        { area: "Calidad", productos: 67, valor: "$8,210.00", stockBajo: 1 },
        { area: "Despacho", productos: 21, valor: "$1,000.00", stockBajo: 0 }
      ]
    }
  }

  // ------------------ EXPORTAR REPORTE ------------------
  const exportarReporte = (formato) => {
    if (!datosReporte) {
      showToast("warning", "Genere un reporte primero.")
      return
    }

    // Simular exportación
    showToast("success", `Reporte exportado en formato ${formato.toUpperCase()}`)
    console.log(`Exportando reporte en formato ${formato}:`, datosReporte)
  }

  // ------------------ IMPRIMIR REPORTE ------------------
  const imprimirReporte = () => {
    if (!datosReporte) {
      showToast("warning", "Genere un reporte primero.")
      return
    }

    window.print()
    showToast("success", "Enviando a impresión...")
  }

  // ------------------ RENDERIZAR TABLA SEGÚN REPORTE ------------------
  const renderizarTabla = () => {
    if (!datosReporte || !datosReporte.datos) return null

    switch (tipoReporte) {
      case "general":
        return (
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Categoría</CTableHeaderCell>
                <CTableHeaderCell>Valor</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datosReporte.datos.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.categoria}</CTableDataCell>
                  <CTableDataCell>{item.valor}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )

      case "ventas":
        return (
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datosReporte.datos.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.producto}</CTableDataCell>
                  <CTableDataCell>{item.cantidad}</CTableDataCell>
                  <CTableDataCell>{item.total}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )

      case "trabajadores":
        return (
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Área</CTableHeaderCell>
                <CTableHeaderCell>Horas</CTableHeaderCell>
                <CTableHeaderCell>Productividad</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datosReporte.datos.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.nombre}</CTableDataCell>
                  <CTableDataCell>{item.area}</CTableDataCell>
                  <CTableDataCell>{item.horas}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.productividad >= "90%" ? "success" : "warning"}>
                      {item.productividad}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )

      case "produccion":
        return (
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell>Producidas</CTableHeaderCell>
                <CTableHeaderCell>Defectos</CTableHeaderCell>
                <CTableHeaderCell>Eficiencia</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datosReporte.datos.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.producto}</CTableDataCell>
                  <CTableDataCell>{item.producidas}</CTableDataCell>
                  <CTableDataCell>{item.defectos}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.eficiencia >= "90%" ? "success" : "warning"}>
                      {item.eficiencia}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )

      case "stock":
        return (
          <CTable bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Área</CTableHeaderCell>
                <CTableHeaderCell>Productos</CTableHeaderCell>
                <CTableHeaderCell>Valor</CTableHeaderCell>
                <CTableHeaderCell>Stock Bajo</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datosReporte.datos.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.area}</CTableDataCell>
                  <CTableDataCell>{item.productos}</CTableDataCell>
                  <CTableDataCell>{item.valor}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.stockBajo > 0 ? "warning" : "success"}>
                      {item.stockBajo}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )

      default:
        return null
    }
  }

  // ------------------ RENDERIZAR MÉTRICAS ------------------
  const renderizarMetricas = () => {
    if (!datosReporte || !datosReporte.metricas) return null

    return (
      <CRow className="mb-4">
        {datosReporte.metricas.map((metrica, index) => (
          <CCol md={3} key={index} className="mb-3">
            <CCard className="h-100">
              <CCardBody className="text-center">
                <h6 className="card-title text-muted">{metrica.nombre}</h6>
                <h4 className="text-primary">{metrica.valor}</h4>
                <small className={`text-${metrica.tendencia.includes('+') ? 'success' : 'danger'}`}>
                  {metrica.tendencia} vs período anterior
                </small>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    )
  }

  return (
    <>
      <CContainer className="mt-4">

        {/* ------------------ FILTROS DE REPORTE ------------------ */}
        <CCard className="mb-4">
          <CCardHeader>
            <h5 className="mb-0">
              <CIcon icon={cilFilter} className="me-2" />
              Parámetros del Reporte
            </h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="g-3 align-items-end">
                <CCol md={3}>
                  <CFormLabel>Tipo de Reporte</CFormLabel>
                  <CFormSelect
                    value={tipoReporte}
                    onChange={(e) => setTipoReporte(e.target.value)}
                  >
                    <option value="general">Reporte General</option>
                    <option value="ventas">Reporte de Ventas</option>
                    <option value="trabajadores">Reporte de Trabajadores</option>
                    <option value="produccion">Reporte de Producción</option>
                    <option value="stock">Reporte de Stock</option>
                  </CFormSelect>
                </CCol>

                <CCol md={2}>
                  <CFormLabel>Fecha Inicio</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>

                <CCol md={2}>
                  <CFormLabel>Fecha Fin</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>

                {tipoReporte === "stock" && (
                  <CCol md={2}>
                    <CFormLabel>Área</CFormLabel>
                    <CFormSelect
                      value={areaFiltro}
                      onChange={(e) => setAreaFiltro(e.target.value)}
                    >
                      <option value="">Todas las áreas</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                )}

                <CCol md={3} className="text-end">
                  <CButton
                    color="primary"
                    onClick={generarReporte}
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilChart} className="me-2" />
                        Generar Reporte
                      </>
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>

{/* { ------------------ RESULTADOS DEL REPORTE ------------------ }
        {datosReporte && (
          <CCard>
            <CCardHeader>
              <CRow className="align-items-center">
                <CCol>
                  <h5 className="mb-0">
                    <CIcon icon={cilChart} className="me-2" />
                    {datosReporte.titulo}
                  </h5>
                  <small className="text-muted">Período: {datosReporte.periodo}</small>
                </CCol>
                <CCol xs="auto">
                  <CButton
                    color="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => exportarReporte('pdf')}
                  >
                    <CIcon icon={cilDownload} className="me-1" />
                    PDF
                  </CButton>
                  <CButton
                    color="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => exportarReporte('excel')}
                  >
                    <CIcon icon={cilDownload} className="me-1" />
                    Excel
                  </CButton>
                  <CButton
                    color="outline-secondary"
                    size="sm"
                    onClick={imprimirReporte}
                  >
                    <CIcon icon={cilPrint} className="me-1" />
                    Imprimir
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              { Métricas }
              {renderizarMetricas()}

              { Tabla de datos }
              <h6 className="mb-3">Detalles del Reporte</h6>
              {renderizarTabla()}
            </CCardBody>
          </CCard>
        )} */}

        {/* Mensaje cuando no hay datos */}
        {!datosReporte && !cargando && (
          <CCard>
            <CCardBody className="text-center py-5">
              <CIcon icon={cilChart} size="3xl" className="text-muted mb-3" />
              <h5 className="text-muted">Seleccione los parámetros y genere un reporte</h5>
              <p className="text-muted">
                Use los filtros arriba para configurar el tipo de reporte y el período deseado.
              </p>
            </CCardBody>
          </CCard>
        )}
      </CContainer>

      {/* ------------------ TOASTER ------------------ */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={3000} color={t.type} visible>
            <CToastHeader closeButton>
              <strong>{t.message}</strong>
            </CToastHeader>
            <CToastBody>Operación completada.</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </>
  )
}

export default Reports