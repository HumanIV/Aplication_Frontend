    import React, { useState } from "react"
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
    } from "@coreui/react"

    import CIcon from "@coreui/icons-react"
    import { cilTrash } from "@coreui/icons"

    const API_BASE = 'http://localhost:4000'
    const API_PEDIDOS = `${API_BASE}/pedidos`
    const API_FACTURAS = `${API_BASE}/facturas`

    export const Facturacion = () => {

    // ------------------ TOAST ------------------
    const [toasts, setToasts] = useState([])

    const showToast = (type, message) => {
        setToasts((prev) => [...prev, { id: Date.now(), type, message }])
    }

    // ------------------ MODAL ------------------
    const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState(null)

    const openModal = (type) => {
        setModalType(type)
        setModalVisible(true)
    }

    // ------------------ PEDIDO ------------------
    const [pedidoId, setPedidoId] = useState("")
    const [cart, setCart] = useState([])
    const [pedidoDatos, setPedidoDatos] = useState(null)



    // --------- CARGAR PEDIDO DESDE API ---------
        const cargarPedido = async () => {
        if (!pedidoId.trim()) {
        showToast("warning", "Debe ingresar un ID de pedido.")
        return
        }

        try {
            const resp = await fetch(`${API_PEDIDOS}/${pedidoId}`)

        if (!resp.ok) {
            showToast("danger", "No existe un pedido con ese ID.")
            return
        }

            const pedido = await resp.json()

            // Pedidos puede guardar las líneas en `lines` (nuevo) o `productos` (antiguo)
            const items = pedido.lines ?? pedido.productos ?? []

            // Normalizamos cada item a campos { nombre, cantidad, precio }
            const normalized = items.map((it) => ({
            nombre: it.nombre ?? it.producto ?? it.name ?? '',
            cantidad: Number(it.cantidad ?? it.qty ?? 0),
            precio: Number(it.precio ?? it.Precio_Unit ?? it.price ?? 0),
            raw: it,
            }))

            setPedidoDatos(pedido)
            setCart(normalized)

        showToast("success", "Pedido cargado correctamente.")
        } catch (err) {
        console.error(err)
        showToast("danger", "No se pudo conectar con el servidor.")
        }
    }

    // ------------------ ELIMINAR PRODUCTO ------------------
    const removeFromCart = (index) => {
        const updated = cart.filter((_, i) => i !== index)
        setCart(updated)
        showToast("warning", "Producto eliminado.")
    }

    // ------------------ TOTALES ------------------
    const subtotal = cart.reduce((acc, item) => {
        const precio = Number(item.precio) || 0
        const cantidad = Number(item.cantidad) || 0
        return acc + precio * cantidad
    }, 0)

    const impuesto = subtotal * 0.16
    const total = subtotal + impuesto

    // ------------------ GUARDAR FACTURA ------------------
        const saveItem = async () => {
        if (!pedidoDatos) {
        showToast("danger", "No hay datos del pedido para facturar.")
        return
        }

        if (cart.length === 0) {
        showToast("danger", "El pedido no contiene productos.")
        return
        }

        const factura = {
        pedidoId,
        productos: cart.map((c) => ({
            nombre: c.nombre,
            cantidad: c.cantidad,
            precio: c.precio,
        })),
        subtotal,
        impuesto,
        total,
        fecha: new Date().toISOString(),
        }

        try {
        const resp = await fetch(API_FACTURAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(factura),
        })

        if (!resp.ok) {
            showToast("danger", "No se pudo guardar la factura.")
            return
        }

        showToast("success", "Factura generada correctamente.")
        setModalVisible(false)

        } catch (err) {
        console.error(err)
        showToast("danger", "Error de conexión con el servidor.")
        }
    }

    return (
        <>
        <CContainer className="mt-4">

            {/* ------------------ BUSCAR PEDIDO ------------------ */}
            <CForm className="mb-4">
            <CRow className="g-3 align-items-end">
                <CCol md={6}>
                <CFormLabel>ID del Pedido</CFormLabel>
                <CFormInput
                    placeholder="Ej: 12"
                    value={pedidoId}
                    onChange={(e) => setPedidoId(e.target.value)}
                />
                </CCol>

                <CCol md={3}>
                <CButton color="primary" onClick={cargarPedido}>
                    Cargar Pedido
                </CButton>
                </CCol>
            </CRow>
            </CForm>

            {/* ------------------ TABLA PRODUCTOS ------------------ */}
            <h5>Productos del Pedido</h5>

            <CTable bordered hover responsive>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell>Producto</CTableHeaderCell>
                <CTableHeaderCell>Cantidad</CTableHeaderCell>
                <CTableHeaderCell>Precio</CTableHeaderCell>
                <CTableHeaderCell>Subtotal</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>

            <CTableBody>
                {cart.map((prod, index) => (
                <CTableRow key={index}>
                    <CTableDataCell>{prod.nombre ?? prod.producto ?? prod.name}</CTableDataCell>
                    <CTableDataCell>{prod.cantidad}</CTableDataCell>
                    <CTableDataCell>${Number(prod.precio).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                    ${(Number(prod.precio) * Number(prod.cantidad)).toFixed(2)}
                    </CTableDataCell>

                    <CTableDataCell>
                    <CButton
                        color="danger"
                        size="sm"
                        onClick={() => removeFromCart(index)}
                    >
                        <CIcon icon={cilTrash} />
                    </CButton>
                    </CTableDataCell>
                </CTableRow>
                ))}
            </CTableBody>
            </CTable>

            {/* ------------------ TOTALES ------------------ */}
            <div className="text-end mt-3">
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Impuesto (16%):</strong> ${impuesto.toFixed(2)}</p>
            <h5><strong>Total:</strong> ${total.toFixed(2)}</h5>

            <CButton
                color="success"
                className="mt-3"
                onClick={() => openModal("save")}
            >
                Generar Factura
            </CButton>
            </div>
        </CContainer>

        {/* ------------------ TOASTER ------------------ */}
        <CToaster placement="top-end">
            {toasts.map((t) => (
            <CToast key={t.id} autohide delay={2500} color={t.type} visible>
                <CToastHeader closeButton>
                <strong>{t.message}</strong>
                </CToastHeader>
                <CToastBody>Operación realizada correctamente.</CToastBody>
            </CToast>
            ))}
        </CToaster>

        {/* ------------------ MODAL ------------------ */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
            <CModalHeader>
            <CModalTitle>Confirmar generación de factura</CModalTitle>
            </CModalHeader>

        <CModalBody>
        {modalType === "save" && pedidoDatos && (
            <>
            <h5 className="mb-3">Confirmar Pedido</h5>

            {/* Información del cliente */}
            <div className="border rounded p-3 mb-3">
                <h6 className="fw-bold">Cliente</h6>
                <p><strong>Nombre:</strong> {pedidoDatos.cliente}</p>
                <p><strong>RIF:</strong> {pedidoDatos.rif}</p>
                <p><strong>Dirección Factura:</strong> {pedidoDatos.direccionFactura}</p>
                <p><strong>Dirección Entrega:</strong> {pedidoDatos.direccionEntrega}</p>
                <p><strong>Sucursal:</strong> {pedidoDatos.sucursal}</p>
                <p><strong>Términos de Pago:</strong> {pedidoDatos.terminosPago}</p>
                <p><strong>Tasa:</strong> {pedidoDatos.tasa}</p>
                <p><strong>Transporte:</strong> {pedidoDatos.transporte}</p>
            </div>

            {/* Productos del pedido */}
            <div className="border rounded p-3 mb-3">
                <h6 className="fw-bold">Productos</h6>
                {pedidoDatos.lines.map((line) => (
                <div key={line.id} className="mb-2">
                    <p><strong>Nombre:</strong> {line.nombre}</p>
                    <p><strong>Categoría:</strong> {line.categoria}</p>
                    <p><strong>Precio:</strong> ${line.precio.toFixed(2)}</p>
                    <p><strong>Cantidad:</strong> {line.cantidad}</p>
                    <p><strong>Subtotal:</strong> ${line.subtotal.toFixed(2)}</p>
                    <hr />
                </div>
                ))}
            </div>

            {/* Totales */}
            <div className="border rounded p-3 mb-3">
                <h6 className="fw-bold">Totales</h6>
                <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                <p><strong>Impuesto (16%):</strong> ${impuesto.toFixed(2)}</p>
                <h5><strong>Total:</strong> ${total.toFixed(2)}</h5>
            </div>

            {/* Botón de confirmación */}
            <CButton
                color="success"
                className="mt-3 w-100"
                onClick={saveItem}
            >
                Confirmar y Generar Factura
            </CButton>
            </>
        )}
        </CModalBody>
        </CModal>
        </>
    )
    }

    export default Facturacion
