/** PANEL DE ESTADÍSTICAS DE VENTAS — DISEÑO PREMIUM 2026 **/
import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CContainer,
  CCol,
  CRow,
  CWidgetStatsA,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CBadge,
} from '@coreui/react'

import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilOptions,
  cilMagnifyingGlass,
  cilCloudDownload,
  cilChartLine,
  cilFilter,
} from '@coreui/icons'
import { getStyle } from '@coreui/utils'

export const Reports = () => {
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ventas, setVentas] = useState([])
  const lineChartRef = useRef(null)

  // --- LÓGICA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [facturasRes, pedidosRes] = await Promise.all([
          fetch('http://localhost:4000/facturas'),
          fetch('http://localhost:4000/pedidos'),
        ])
        const facturas = await facturasRes.json()
        const pedidos = await pedidosRes.json()

        const ventasCompletas = facturas.map((f) => {
          const pedido = pedidos.find((p) => p.id === f.pedidoId)
          return {
            id: f.id,
            fecha: f.fecha.split('T')[0],
            monto: Number(f.total),
            productosTotal: f.productos.reduce((acc, p) => acc + p.cantidad, 0),
            descripcion:
              f.productos.length === 1 ? f.productos[0].nombre : `${f.productos.length} productos`,
            cliente: pedido ? pedido.cliente : 'Consumidor Final',
            categoria: 'Factura',
            productos: f.productos,
          }
        })
        setVentas(ventasCompletas)
      } catch (err) {
        console.error('Error cargando reportes:', err)
      }
    }
    cargarDatos()
  }, [])

  // --- CÁLCULOS PARA WIDGETS ---
  const now = new Date()
  const ventasMesActual = ventas.filter((v) => {
    const d = new Date(v.fecha)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const ingresosMes = ventasMesActual.reduce((acc, v) => acc + v.monto, 0)

  return (
    <div className="reports-wrapper py-4">
      <CContainer fluid>
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-0 text-gradient-report">Análisis de Negocio</h2>
            <p className="text-secondary mb-0">
              Visualiza el rendimiento de tus ventas en tiempo real
            </p>
          </div>
          <div className="d-flex gap-2">
            <CDropdown>
              <CDropdownToggle
                color="dark"
                variant="outline"
                className="border-0 shadow-sm bg-card-custom"
              >
                <CIcon icon={cilCloudDownload} className="me-2" /> Exportar
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Reporte PDF Mensual</CDropdownItem>
                <CDropdownItem>Data Maestra Excel</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>

        {/* WIDGETS DE IMPACTO */}
        <CRow className="mb-4 gy-4">
          <CCol sm={6} md={4}>
            <CCard className="border-0 shadow-sm rounded-4 widget-premium bg-gradient-info">
              <CCardBody className="p-4 text-white">
                <div className="text-uppercase small fw-bold opacity-75">Ingresos del Mes</div>
                <div className="fs-2 fw-bold">
                  ${ingresosMes.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="small mt-2">
                  <CBadge color="light" className="text-info">
                    +12.5% vs mes anterior
                  </CBadge>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol sm={6} md={4}>
            <CCard className="border-0 shadow-sm rounded-4 widget-premium bg-card-custom">
              <CCardBody className="p-4">
                <div className="text-muted text-uppercase small fw-bold">Transacciones</div>
                <div className="fs-2 fw-bold text-color-main">{ventasMesActual.length}</div>
                <div className="small mt-2 text-secondary">
                  Facturas procesadas hoy:{' '}
                  {
                    ventasMesActual.filter((v) => v.fecha === now.toISOString().split('T')[0])
                      .length
                  }
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol sm={6} md={4}>
            <CCard className="border-0 shadow-sm rounded-4 widget-premium bg-card-custom">
              <CCardBody className="p-4">
                <div className="text-muted text-uppercase small fw-bold">Ticket Promedio</div>
                <div className="fs-2 fw-bold text-color-main">
                  $
                  {ventasMesActual.length
                    ? (ingresosMes / ventasMesActual.length).toFixed(2)
                    : '0.00'}
                </div>
                <div className="small mt-2 text-success fw-bold">Eficiencia operativa estable</div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* GRÁFICOS PRINCIPALES */}
        <CRow className="gy-4 mb-4">
          <CCol lg={8}>
            <CCard className="border-0 shadow-sm rounded-4 bg-card-custom h-100">
              <CCardBody className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">
                    <CIcon icon={cilChartLine} className="me-2 text-info" /> Tendencia de Ingresos
                  </h5>
                </div>
                <CChartLine
                  ref={lineChartRef}
                  style={{ height: '320px' }}
                  data={{
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'Ingresos ($)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderColor: '#36A2EB',
                        pointBackgroundColor: '#36A2EB',
                        data: [3500, 4200, 3800, 5100, 4800, 6200], // Data de ejemplo o procesada
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: '#8a93a2' } },
                      y: {
                        grid: { color: 'rgba(138, 147, 162, 0.1)' },
                        ticks: { color: '#8a93a2' },
                      },
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={4}>
            <CCard className="border-0 shadow-sm rounded-4 bg-card-custom h-100">
              <CCardBody className="p-4">
                <h5 className="fw-bold mb-4">Distribución por Categoría</h5>
                <CChartBar
                  style={{ height: '320px' }}
                  data={{
                    labels: ['Tec', 'Mueb', 'Hog'],
                    datasets: [
                      {
                        label: 'Ventas',
                        backgroundColor: ['#36A2EB', '#FF9F40', '#4BC0C0'],
                        borderRadius: 8,
                        data: [45, 25, 30],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* TABLA DE HISTORIAL */}
        <CCard className="border-0 shadow-sm rounded-4 bg-card-custom overflow-hidden">
          <CCardBody className="p-0">
            <div className="p-4 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
              <h5 className="fw-bold mb-0">Detalle de Transacciones</h5>
              <div className="d-flex gap-2 align-items-center">
                <CFormInput
                  size="sm"
                  placeholder="ID o Cliente..."
                  className="bg-light border-0 px-3 py-2 rounded-3 shadow-none text-color-main"
                  style={{ width: '250px' }}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <CButton color="primary" variant="ghost" className="rounded-3 px-3 border">
                  <CIcon icon={cilFilter} />
                </CButton>
              </div>
            </div>
            <div className="table-responsive">
              <CTable hover align="middle" className="mb-0 custom-reports-table">
                <CTableHead className="bg-light-subtle">
                  <CTableRow>
                    <CTableHeaderCell className="border-0 ps-4">ID</CTableHeaderCell>
                    <CTableHeaderCell className="border-0">Cliente</CTableHeaderCell>
                    <CTableHeaderCell className="border-0">Detalle</CTableHeaderCell>
                    <CTableHeaderCell className="border-0">Fecha</CTableHeaderCell>
                    <CTableHeaderCell className="border-0">Total</CTableHeaderCell>
                    <CTableHeaderCell className="border-0 pe-4 text-center">
                      Acciones
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {ventas
                    .filter(
                      (v) =>
                        v.cliente.toLowerCase().includes(search.toLowerCase()) ||
                        v.id.toString().includes(search),
                    )
                    .map((v) => (
                      <CTableRow key={v.id}>
                        <CTableDataCell className="ps-4 fw-bold text-secondary">
                          #{v.id}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-color-main">{v.cliente}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="small text-muted">{v.descripcion}</span>
                          <div className="small text-info">{v.productosTotal} unidades</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-secondary">{v.fecha}</CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-bold text-success">${v.monto.toFixed(2)}</span>
                        </CTableDataCell>
                        <CTableDataCell className="pe-4 text-center">
                          <CButton
                            color="info"
                            variant="ghost"
                            size="sm"
                            className="me-1 rounded-pill px-3 border border-info"
                          >
                            Ver <CIcon icon={cilOptions} className="ms-1" />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CContainer>

      {/* --- ESTILOS DINÁMICOS ADAPTATIVOS --- */}
      <style jsx>{`
        .text-gradient-report {
          background: linear-gradient(135deg, #36a2eb 0%, #4bc0c0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* TEMA CLARO */
        .bg-card-custom {
          background: #ffffff;
          transition: background 0.3s ease;
        }
        .text-color-main {
          color: #2d3748;
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #36a2eb 0%, #2980b9 100%) !important;
        }

        /* TEMA OSCURO (Sobrescribe variables de CoreUI) */
        [data-coreui-theme='dark'] .bg-card-custom {
          background: #1e2128 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme='dark'] .text-color-main {
          color: #f8f9fa;
        }
        [data-coreui-theme='dark'] .bg-light-subtle {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        [data-coreui-theme='dark'] .custom-reports-table tr:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .widget-premium {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }
        .widget-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .custom-reports-table thead th {
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.5px;
          color: #8a93a2;
          padding: 1rem 0.5rem;
        }

        .custom-reports-table tbody td {
          padding: 1rem 0.5rem;
          border-bottom: 1px solid rgba(138, 147, 162, 0.1);
        }
      `}</style>
    </div>
  )
}

export default Reports
