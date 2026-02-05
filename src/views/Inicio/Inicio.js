import React, { useState, useEffect } from 'react'
import { CRow, CCol, CCard, CCardBody, CCardHeader, CWidgetStatsA, CContainer } from '@coreui/react'
import { CChartLine, CChartDoughnut } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilCart, cilUserFollow, cilMoney, cilGraph } from '@coreui/icons'

const DashboardVA = () => {
  const verdeVA = '#58cc7d'
  const azulVA = '#002d72'

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-coreui-theme')
      setIsDarkMode(theme === 'dark')
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-coreui-theme'],
    })
    return () => observer.disconnect()
  }, [])

  // --- PALETA DE COLORES SEGÚN EL TEMA ---
  const colors = {
    // Modo Oscuro: Fondos oscuros / Modo Claro: Gris Platino #f3f4f7
    bodyBg: isDarkMode ? '#1d222b' : '#f3f4f7',
    // Modo Oscuro: Tarjetas oscuras / Modo Claro: Blanco puro
    cardBg: isDarkMode ? '#212631' : '#ffffff',
    // Modo Oscuro: Blanco / Modo Claro: Azul V&A
    mainText: isDarkMode ? '#ffffff' : azulVA,
    // Modo Oscuro: Gris suave / Modo Claro: Gris oscuro
    subText: isDarkMode ? '#a0a0a0' : '#4f5d73',
    // Colores de la tabla
    tableHeader: isDarkMode ? '#2d333f' : '#ebedef',
    gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 45, 114, 0.05)',
  }

  return (
    <CContainer fluid className="pb-4">
      <style>
        {`
          /* Forzamos el color de fondo del área principal */
          .body-wrapper { background-color: ${colors.bodyBg} !important; }
          
          .main-card-va {
            background: ${colors.cardBg} !important;
            border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent'} !important;
            border-radius: 20px !important;
            box-shadow: ${isDarkMode ? 'none' : '0 4px 15px rgba(0, 45, 114, 0.05)'} !important;
          }
          
          .text-va-dynamic { color: ${colors.mainText} !important; }
          
          /* Estilos de la Tabla */
          .table-va { color: ${isDarkMode ? '#fff' : '#4f5d73'} !important; }
          .table-va thead th { 
            background-color: ${colors.tableHeader} !important; 
            color: ${colors.mainText} !important;
            border: none;
          }
          .table-va td { border-bottom: 1px solid ${colors.gridColor}; }
        `}
      </style>

      {/* BIENVENIDA */}
      <div className="mb-4 mt-2">
        <h2 className="fw-bold text-va-dynamic">
          Dashboard de <span style={{ color: verdeVA }}>Operaciones</span>
        </h2>
        <p style={{ color: colors.subText }}>Análisis de ventas y stock en tiempo real.</p>
      </div>

      {/* 1. KPIs */}
      <CRow className="mb-4 gy-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            style={{ borderRadius: '20px', background: azulVA }}
            /* Añadimos text-white para que siempre sea blanco independientemente del tema */
            value={
              <div className="text-white">
                $45.280 <span className="fs-6 fw-normal">(+12%)</span>
              </div>
            }
            title={<span className="text-white opacity-75">Ventas del Mes</span>}
            icon={<CIcon icon={cilMoney} height={36} className="opacity-25 text-white" />}
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            /* Usamos un gris muy oscuro para el modo claro y el color de CoreUI para el oscuro */
            style={{ borderRadius: '20px', background: isDarkMode ? '#212631' : '#1a1a1a' }}
            /* Forzamos el blanco aquí también */
            value={
              <div className="text-white">
                1,240 <span className="fs-6 fw-normal">(-2%)</span>
              </div>
            }
            title={<span className="text-white opacity-75">Stock Total</span>}
            icon={<CIcon icon={cilCart} height={36} className="opacity-25 text-white" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            style={{ borderRadius: '20px', background: verdeVA }}
            value={
              <div className="text-black">
                85 <span className="fs-6 fw-normal">(+5%)</span>
              </div>
            }
            title={<span className="text-black opacity-75">Nuevos Clientes</span>}
            icon={<CIcon icon={cilUserFollow} height={36} className="text-black opacity-25" />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            style={{
              borderRadius: '20px',
              background: colors.cardBg,
              border: `1px solid ${colors.gridColor}`,
            }}
            value={<div className="text-va-dynamic">98.2%</div>}
            title={<span style={{ color: colors.subText }}>Eficiencia</span>}
            icon={<CIcon icon={cilGraph} height={36} className="text-va-dynamic opacity-25" />}
          />
        </CCol>
      </CRow>

      {/* 2. GRÁFICAS */}
      <CRow className="gy-4">
        <CCol lg={8}>
          <CCard className="main-card-va h-100">
            <CCardHeader className="bg-transparent border-0 fw-bold pt-4 px-4 text-va-dynamic">
              Ventas Semanales
            </CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: ['S1', 'S2', 'S3', 'S4'],
                  datasets: [
                    {
                      label: 'Ventas',
                      borderColor: verdeVA,
                      backgroundColor: isDarkMode
                        ? 'rgba(88, 204, 125, 0.1)'
                        : 'rgba(88, 204, 125, 0.05)',
                      data: [12000, 15000, 11000, 18000],
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { grid: { color: colors.gridColor }, ticks: { color: colors.subText } },
                    x: { grid: { display: false }, ticks: { color: colors.subText } },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={4}>
          <CCard className="main-card-va h-100">
            <CCardHeader className="bg-transparent border-0 fw-bold pt-4 px-4 text-va-dynamic">
              Ventas por Categoría
            </CCardHeader>
            <CCardBody className="d-flex align-items-center">
              <CChartDoughnut
                data={{
                  labels: ['Hogar', 'Tecno', 'Moda'],
                  datasets: [
                    {
                      backgroundColor: [azulVA, verdeVA, isDarkMode ? '#4b5563' : '#1a1a1a'],
                      hoverBackgroundColor: [azulVA, verdeVA, isDarkMode ? '#4b5563' : '#1a1a1a'],
                      data: [40, 35, 25],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { labels: { color: colors.subText } },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 3. TABLA DINÁMICA */}
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard className="main-card-va">
            <CCardHeader className="bg-transparent border-0 fw-bold text-va-dynamic pt-3">
              Últimas Transacciones Realizadas
            </CCardHeader>
            <CCardBody>
              <table className="table table-hover align-middle mb-0 table-va">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#10245</td>
                    <td>Juan Pérez</td>
                    <td>
                      <span className="badge bg-success text-white">Completado</span>
                    </td>
                    <td className="fw-bold">$450.00</td>
                  </tr>
                  <tr>
                    <td>#10246</td>
                    <td>María García</td>
                    <td>
                      <span className="badge bg-warning text-dark">Pendiente</span>
                    </td>
                    <td className="fw-bold">$1,200.00</td>
                  </tr>
                </tbody>
              </table>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default DashboardVA
