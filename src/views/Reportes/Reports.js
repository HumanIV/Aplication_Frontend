    /** PANEL DE ESTADÍSTICAS DE VENTAS — DISEÑO PREMIUM **/
    import React, { useState, useEffect, useRef } from "react"
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
    } from "@coreui/react"

    import { CChartBar, CChartLine } from "@coreui/react-chartjs"
    import CIcon from "@coreui/icons-react"
    import {
    cilArrowTop,
    cilOptions,
    cilMagnifyingGlass,
    cilCloudDownload,
    } from "@coreui/icons"
    import { getStyle } from "@coreui/utils"

    export const Reports = () => {
    const [search, setSearch] = useState("")
    const [categoria, setCategoria] = useState("")
    const [ventas, setVentas] = useState([])

    const lineChartRef = useRef(null)

    // 🟦 UTILITY: agrupar ventas por meses
    const groupByMonth = (ventas) => {
        const months = Array(12).fill(0)

        ventas.forEach((v) => {
        const mes = new Date(v.fecha).getMonth()
        months[mes] += Number(v.monto)
        })

        return months.slice(0, 6) // solo 6 meses
    }

    useEffect(() => {
        const cargarDatos = async () => {
        const facturasRes = await fetch("http://localhost:4000/facturas")
        const facturas = await facturasRes.json()

        const pedidosRes = await fetch("http://localhost:4000/pedidos")
        const pedidos = await pedidosRes.json()

        const ventasCompletas = facturas.map((f) => {
            const pedido = pedidos.find((p) => p.id === f.pedidoId)

            return {
            id: f.id,
            fecha: f.fecha.split("T")[0],
            subtotal: Number(f.subtotal),
            impuesto: Number(f.impuesto),
            monto: Number(f.total),

            productosTotal: f.productos.reduce((acc, p) => acc + p.cantidad, 0),
            productosDiferentes: f.productos.length,

            descripcion:
                f.productos.length === 1
                ? f.productos[0].nombre
                : `${f.productos.length} productos`,

            cliente: pedido ? pedido.cliente : "Sin pedido asociado",
            rif: pedido ? pedido.rif : "",
            sucursal: pedido ? pedido.sucursal : "",
            categoria: "Factura",
            productos: f.productos,
            }
        })

        setVentas(ventasCompletas)
        }

        cargarDatos()
    }, [])

    // 🎨 Ajustes visuales del gráfico
    useEffect(() => {
        const chart = lineChartRef.current
        if (!chart) return

        chart.options.plugins.legend.labels.color = getStyle("--cui-body-color")
        chart.options.scales.x.ticks.color = getStyle("--cui-body-color")
        chart.options.scales.y.ticks.color = getStyle("--cui-body-color")
        chart.update()
    }, [])

    // 📈 Construcción dinámica del gráfico
    const ingresosPorMes = groupByMonth(ventas)

    const lineChartData = {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
        {
            label: "Ingresos ($)",
            borderColor: "#4bc0c0",
            backgroundColor: "rgba(75,192,192,0.25)",
            data: ingresosPorMes,
            fill: true,
            tension: 0.4,
        },
        ],
    }

    const barChartData = {
        labels: ["Tecnología", "Muebles", "Hogar"],
        datasets: [
        {
            label: "Ventas ($)",
            backgroundColor: ["#36A2EB", "#FF9F40", "#4BC0C0"],
            data: [4650, 1450, 180],
        },
        ],
    }

    return (
        <>
        <h1 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>
            Panel de Ventas
        </h1>
    <CContainer>
    {/* ================= WIDGETS ================= */}
    <CRow className="mb-4 gy-4">
        {/* INGRESOS DEL MES (solo mes actual) */}
        <CCol sm={6} md={4}>
        <CWidgetStatsA
            className="rounded-4 border shadow-sm"
            style={{
            padding: "18px",
            background: "var(--cui-card-bg)",
            borderColor: "var(--cui-border-color)",
            }}
            value={
            <span className="fs-4 fw-semibold">
                $
                {(
                ventas
                    .filter((v) => {
                    const d = new Date(v.fecha)
                    const now = new Date()
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    })
                    .reduce((acc, v) => acc + Number(v.monto || 0), 0) || 0
                ).toFixed(2)}
            </span>
            }
            title={<span className="text-muted">Ingresos (Mes actual)</span>}
        />
        </CCol>

        {/* VENTAS REALIZADAS (mes actual) */}
        <CCol sm={6} md={4}>
        <CWidgetStatsA
            className="rounded-4 border shadow-sm"
            style={{
            padding: "18px",
            background: "var(--cui-card-bg)",
            borderColor: "var(--cui-border-color)",
            }}
            value={
            <span className="fs-4 fw-semibold">
                {ventas.filter((v) => {
                const d = new Date(v.fecha)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                }).length}
            </span>
            }
            title={<span className="text-muted">Ventas (Mes actual)</span>}
        />
        </CCol>

        {/* CATEGORÍA / PRODUCTO MÁS VENDIDO (mes actual) */}
        <CCol sm={6} md={4}>
        <CWidgetStatsA
            className="rounded-4 border shadow-sm"
            style={{
            padding: "18px",
            background: "var(--cui-card-bg)",
            borderColor: "var(--cui-border-color)",
            }}
            value={
            <span className="fs-5 fw-semibold">
                {(() => {
                const counts = {}
                const now = new Date()
                ventas
                    .filter((v) => {
                    const d = new Date(v.fecha)
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    })
                    .forEach((v) => {
                    (v.productos || []).forEach((p) => {
                        const key = p.categoria || p.nombre || "Sin categoría"
                        counts[key] = (counts[key] || 0) + (Number(p.cantidad) || 0)
                    })
                    })

                if (Object.keys(counts).length === 0) return "—"
                const [name, qty] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
                return `${name} (${qty} uds)`
                })()}
            </span>
            }
            title={<span className="text-muted">Top (Mes actual)</span>}
        />
        </CCol>
    </CRow>

    {/* ================= GRÁFICOS ================= */}
    <CRow className="gy-4">
        <CCol md={7}>
        <CCard className="shadow-sm" style={{ borderRadius: "16px" }}>
            <CCardBody>
            <h5 className="fw-bold mb-3">Ingresos Últimos 6 Meses</h5>
            <CChartLine
                ref={lineChartRef}
                data={{
                // labels dinámicos: últimos 6 meses (abreviados)
                labels: (() => {
                    const labels = []
                    const now = new Date()
                    for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    labels.push(d.toLocaleString(undefined, { month: "short" }))
                    }
                    return labels
                })(),
                datasets: [
                    {
                    label: "Ingresos ($)",
                    borderColor: getStyle("--cui-info") || "#4bc0c0",
                    backgroundColor:
                        (getStyle("--cui-info") || "#4bc0c0") + "33" /* semitransp */,
                    data: (() => {
                        // calcular totales por mes dinámicamente
                        const totals = Array(6).fill(0)
                        const now = new Date()
                        ventas.forEach((v) => {
                        const d = new Date(v.fecha)
                        const diffMonths =
                            (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
                        if (diffMonths >= 0 && diffMonths < 6) {
                            totals[5 - diffMonths] += Number(v.monto || 0)
                        }
                        })
                        return totals
                    })(),
                    fill: true,
                    tension: 0.35,
                    },
                ],
                }}
                style={{ height: "300px" }}
                options={{
                plugins: { legend: { display: false, labels: { color: getStyle("--cui-body-color") } } },
                scales: {
                    x: {
                    ticks: { color: getStyle("--cui-body-color") },
                    grid: { display: false },
                    },
                    y: {
                    ticks: { color: getStyle("--cui-body-color") },
                    grid: { color: getStyle("--cui-border-color") },
                    },
                },
                maintainAspectRatio: false,
                }}
            />
            </CCardBody>
        </CCard>
        </CCol>

        <CCol md={5}>
        <CCard className="shadow-sm" style={{ borderRadius: "16px" }}>
            <CCardBody>
            <h5 className="fw-bold mb-3">Ventas por Categoría</h5>

            {/* Bar chart construido desde ventas reales si existen, si no usa fallback */}
            <CChartBar
                data={{
                labels: (() => {
                    const counts = {}
                    ventas.forEach((v) => {
                    (v.productos || []).forEach((p) => {
                        const key = p.categoria || p.nombre || "Sin categoría"
                        counts[key] = (counts[key] || 0) + (Number(p.cantidad) || 0)
                    })
                    })
                    const keys = Object.keys(counts)
                    return keys.length ? keys : ["Tecnología", "Muebles", "Hogar"]
                })(),
                datasets: [
                    {
                    label: "Productos vendidos",
                    backgroundColor: (() => {
                        const colors = ["rgba(54,162,235,0.8)", "rgba(255,159,64,0.8)", "rgba(75,192,192,0.8)"]
                        return colors
                    })(),
                    data: (() => {
                        const counts = {}
                        ventas.forEach((v) => {
                        (v.productos || []).forEach((p) => {
                            const key = p.categoria || p.nombre || "Sin categoría"
                            counts[key] = (counts[key] || 0) + (Number(p.cantidad) || 0)
                        })
                        })
                        const vals = Object.values(counts)
                        return vals.length ? vals : [4650, 1450, 180]
                    })(),
                    },
                ],
                }}
                style={{ height: "300px" }}
                options={{
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                    ticks: { color: getStyle("--cui-body-color") },
                    grid: { display: false },
                    },
                    y: {
                    ticks: { color: getStyle("--cui-body-color") },
                    grid: { color: getStyle("--cui-border-color") },
                    },
                },
                maintainAspectRatio: false,
                }}
            />
            </CCardBody>
        </CCard>
        </CCol>
    </CRow>

            {/* ================= TABLA ================= */}
            <CCard className="mt-4 shadow-sm" style={{ borderRadius: "16px" }}>
            <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Historial de Ventas</h4>

                <CDropdown>
                    <CDropdownToggle color="primary" className="px-4">
                    Exportar
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem>PDF</CDropdownItem>
                    <CDropdownItem>Excel</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
                </div>

                <CForm className="mb-4">
                <CRow className="g-3">
                    <CCol xs={12} md={4}>
                    <CFormLabel>Buscar venta</CFormLabel>
                    <CFormInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar..."
                        className="shadow-sm"
                    />
                    </CCol>

                    <CCol xs={12} md={4}>
                    <CFormLabel>Categoría</CFormLabel>
                    <CFormSelect
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="shadow-sm"
                    >
                        <option value="">Todas</option>
                        <option value="Factura">Factura</option>
                    </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={4}>
                    <CButton color="secondary" className="w-100 mt-4 shadow-sm">
                        Filtrar <CIcon icon={cilMagnifyingGlass} className="ms-2" />
                    </CButton>
                    </CCol>
                </CRow>
                </CForm>

                <CTable hover responsive className="shadow-sm">
                <CTableHead>
                    <CTableRow style={{ background: "rgba(0,0,0,0.05)" }}>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Descripción</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Monto ($)</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody>
                    {ventas.map((v) => (
                    <CTableRow key={v.id}>
                        <CTableDataCell>{v.id}</CTableDataCell>
                        <CTableDataCell>{v.cliente}</CTableDataCell>
                        <CTableDataCell>
                        {v.descripcion} ({v.productosTotal} uds)
                        </CTableDataCell>
                        <CTableDataCell>{v.fecha}</CTableDataCell>
                        <CTableDataCell>${v.monto}</CTableDataCell>

                        <CTableDataCell>
                        <CButton color="primary" size="sm" className="me-2">
                            Descargar{" "}
                            <CIcon icon={cilCloudDownload} className="ms-2" />
                        </CButton>

                        <CButton color="info" size="sm">
                            Opciones <CIcon icon={cilOptions} className="ms-2" />
                        </CButton>
                        </CTableDataCell>
                    </CTableRow>
                    ))}
                </CTableBody>
                </CTable>
            </CCardBody>

            <CCardFooter className="text-center fw-semibold py-3">
                Mostrando {ventas.length} ventas
            </CCardFooter>
            </CCard>
        </CContainer>
        </>
    )
    }

    export default Reports
