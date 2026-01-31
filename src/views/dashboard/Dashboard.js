import React, { useRef, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CWidgetStatsA,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'

import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilArrowTop,
  cilOptions,
  cilUser,
  cilPeople,
  cilFolderOpen,
  cilTask,
} from '@coreui/icons'

import { getStyle } from '@coreui/utils'

export const Dashboard = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    chart.options.plugins.legend.labels.color = getStyle('--cui-body-color')
    chart.update()
  }, [])

  return (
    <>
      <h1 className="mb-4 fw-bold">Dashboard General</h1>

      {/* ----------- WIDGETS SUPERIORES ----------- */}
      <CRow className="mb-4 gy-4">

        {/* Administrativos */}
        <CCol xs={12} md={4}>
          <CWidgetStatsA
            className="shadow-sm"
            color="primary"
            value={
              <>
                152
                <span className="fs-6 fw-normal">
                  (+8% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Procesos Administrativos"
            icon={<CIcon icon={cilFolderOpen} height={36} />}
          />
        </CCol>

        {/* Recursos Humanos */}
        <CCol xs={12} md={4}>
          <CWidgetStatsA
            className="shadow-sm"
            color="info"
            value={
              <>
                27
                <span className="fs-6 fw-normal">
                  (+2% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Solicitudes de RRHH"
            icon={<CIcon icon={cilUser} height={36} />}
          />
        </CCol>

        {/* Reportes */}
        <CCol xs={12} md={4}>
          <CWidgetStatsA
            className="shadow-sm"
            color="success"
            value={
              <>
                18
                <span className="fs-6 fw-normal">
                  (+12% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Reportes Generados"
            icon={<CIcon icon={cilTask} height={36} />}
          />
        </CCol>
      </CRow>

      {/* ----------- GRAFICOS ----------- */}
      <CRow className="gy-4">

        {/* Procesos Administrativos */}
        <CCol xs={12} md={6}>
          <CCard className="shadow border-0" style={{ borderRadius: '16px' }}>
            <CCardHeader className="fw-bold">Flujo Mensual — Administración</CCardHeader>
            <CCardBody>
              <CChartLine
                ref={chartRef}
                data={{
                  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Procesos',
                      borderColor: 'rgba(0,123,255,0.9)',
                      backgroundColor: 'rgba(0,123,255,0.2)',
                      tension: 0.4,
                      fill: true,
                      data: [18, 22, 25, 20, 30, 34],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: getStyle('--cui-body-color') } },
                    y: { ticks: { color: getStyle('--cui-body-color') } },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Recursos Humanos */}
        <CCol xs={12} md={6}>
          <CCard className="shadow border-0" style={{ borderRadius: '16px' }}>
            <CCardHeader className="fw-bold">Solicitudes RRHH — Mensuales</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Solicitudes',
                      backgroundColor: 'rgba(32,201,151,0.7)',
                      data: [6, 8, 7, 9, 12, 10],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: getStyle('--cui-body-color') } },
                    y: { ticks: { color: getStyle('--cui-body-color') } },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ----------- ÁREAS DETALLADAS ----------- */}
      <CRow className="mt-4 gy-4">

        {/* ADMINISTRACION */}
        <CCol xs={12} md={4}>
          <CCard className="shadow-sm" style={{ borderRadius: '16px' }}>
            <CCardBody>
              <h5 className="fw-bold">Administración</h5>
              <p className="text-muted">Gestión de trámites, documentos y procesos internos.</p>
              <CDropdown>
                <CDropdownToggle color="primary" className="w-100">
                  Opciones
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="/admin">Ir al Panel Administrativo</CDropdownItem>
                  <CDropdownItem>Reportes administrativos</CDropdownItem>
                  <CDropdownItem>Nuevo trámite</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCardBody>
          </CCard>
        </CCol>

        {/* RECURSOS HUMANOS */}
        <CCol xs={12} md={4}>
          <CCard className="shadow-sm" style={{ borderRadius: '16px' }}>
            <CCardBody>
              <h5 className="fw-bold">Recursos Humanos</h5>
              <p className="text-muted">Control de personal, solicitudes y reportes.</p>
              <CDropdown>
                <CDropdownToggle color="info" className="w-100">
                  Acciones
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Ver personal</CDropdownItem>
                  <CDropdownItem>Solicitudes de RRHH</CDropdownItem>
                  <CDropdownItem>Agregar empleado</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCardBody>
          </CCard>
        </CCol>

        {/* REPORTES */}
        <CCol xs={12} md={4}>
          <CCard className="shadow-sm" style={{ borderRadius: '16px' }}>
            <CCardBody>
              <h5 className="fw-bold">Reportes Generales</h5>
              <p className="text-muted">Consultas y generación de reportes globales.</p>
              <CDropdown>
                <CDropdownToggle color="success" className="w-100">
                  Ver Reportes
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Reportes administrativos</CDropdownItem>
                  <CDropdownItem>Reportes de RRHH</CDropdownItem>
                  <CDropdownItem>Exportar datos</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>
    </>
  )
}

export default Dashboard
