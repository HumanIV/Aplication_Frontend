    import React, { useEffect, useState } from "react"
    import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CContainer,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CForm,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CToast,
    CToastHeader,
    CToastBody,
    CToaster
    } from "@coreui/react"

    import CIcon from "@coreui/icons-react"
    import { cilPencil, cilTrash, cilMagnifyingGlass } from "@coreui/icons"
    import { cibAddthis } from "@coreui/icons"

    const Products = () => {
    // ---------------------- TOAST ---------------------- //
    const [toasts, setToasts] = useState([])

    const showToast = (type, message) => {
        setToasts((prev) => [...prev, { id: Date.now(), type, message }])
    }

    // ---------------------- MODAL ---------------------- //
    const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState(null)
    const [step, setStep] = useState(1)

    
    // FORM STATE
    const [formData, setFormData] = useState({
        Nombre: "",
        Categoria: "",
        Estatus: "",
        Cantidad: "",
        Precio_Unit: ""
    })

    const [selectedItem, setSelectedItem] = useState(null)

    const openModal = (type, item = null) => {
        setModalType(type)
        setSelectedItem(item)

        if (item) {
        setFormData(item)
        } else {
        setFormData({
            Nombre: "",
            Categoria: "",
            Estatus: "",
            Cantidad: "",
            Precio_Unit: ""
        })
        }

        setStep(1)
        setModalVisible(true)
    }

    // ---------------------- CRUD ---------------------- //
    const [products, setProducts] = useState([])

    const API = "http://localhost:4000/products"

    // Obtener productos
    const loadProducts = async () => {
        const res = await fetch(API)
        const data = await res.json()
        setProducts(data)
    }

    useEffect(() => {
        loadProducts()
    }, [])

    // Guardar nuevo
    const saveItem = async () => {
        await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
        })

        showToast("success", "Producto registrado correctamente")
        setModalVisible(false)
        loadProducts()
    }

    // Actualizar
    const updateItem = async () => {
        await fetch(`${API}/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
        })

        showToast("primary", "Producto actualizado correctamente")
        setModalVisible(false)
        loadProducts()
    }

    // Eliminar
    const deleteItem = async () => {
        await fetch(`${API}/${selectedItem.id}`, { method: "DELETE" })

        showToast("danger", "Producto eliminado correctamente")
        setModalVisible(false)
        loadProducts()
    }

    // ---------------------- MANEJAR FORM ---------------------- //
    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        })
    }

    return (
        <>
        <h1>Gestión de Productos</h1>

        <CContainer>
            {/* ---------- RESUMEN ---------- */}
            <CCard className="mb-4">
            <CCardBody>
                <p>Aquí puedes mostrar métricas o estadísticas de productos.</p>
            </CCardBody>
            </CCard>

            {/* ---------- TABLA ---------- */}
            <CCard>
            <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Listado de Productos</h4>

                <CButton color="primary" onClick={() => openModal("create")}>
                    Nuevo Producto
                    <CIcon className="ms-2" icon={cibAddthis} />
                </CButton>
                </div>

                {/* -------- TABLA -------- */}
                <CTable hover align="middle" className="border">
                <CTableHead color="light">
                    <CTableRow>
                    <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Categoría</CTableHeaderCell>
                    <CTableHeaderCell>Estatus</CTableHeaderCell>
                    <CTableHeaderCell>Cantidad</CTableHeaderCell>
                    <CTableHeaderCell>Precio Unitario</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody>
                    {products.map((item) => (
                    <CTableRow key={item.id}>
                        <CTableDataCell className="text-center">{item.id}</CTableDataCell>
                        <CTableDataCell>{item.Nombre}</CTableDataCell>
                        <CTableDataCell>{item.Categoria}</CTableDataCell>
                        <CTableDataCell>{item.Estatus}</CTableDataCell>
                        <CTableDataCell>{item.Cantidad}</CTableDataCell>
                        <CTableDataCell>{item.Precio_Unit}</CTableDataCell>

                        <CTableDataCell className="text-center">
                        <CButtonGroup>
                            <CButton size="sm" color="primary" onClick={() => openModal("edit", item)}>
                            Editar
                            <CIcon icon={cilPencil} className="ms-2" />
                            </CButton>

                            <CButton size="sm" color="danger" onClick={() => openModal("delete", item)}>
                            Eliminar
                            <CIcon icon={cilTrash} className="ms-2" />
                            </CButton>
                        </CButtonGroup>
                        </CTableDataCell>
                    </CTableRow>
                    ))}
                </CTableBody>
                </CTable>
            </CCardBody>

            <CCardFooter className="text-muted">
                Mostrando {products.length} productos
            </CCardFooter>
            </CCard>
        </CContainer>




        

        {/* TOASTER */}
        <CToaster placement="top-end">
            {toasts.map((t) => (
            <CToast key={t.id} autohide delay={2600} color={t.type} visible>
                <CToastHeader closeButton>
                <strong>{t.message}</strong>
                </CToastHeader>
                <CToastBody>Operación realizada correctamente.</CToastBody>
            </CToast>
            ))}
        </CToaster>

        {/* MODAL */}
        <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
            <CModalHeader>
            <CModalTitle>
                {modalType === "create" && "Registrar Producto"}
                {modalType === "edit" && "Editar Producto"}
                {modalType === "delete" && "Eliminar Producto"}
            </CModalTitle>
            </CModalHeader>

            <CModalBody>
            {/* ----------- ELIMINAR ----------- */}
            {modalType === "delete" && (
                <>
                <h5>¿Seguro que deseas eliminar este producto?</h5>
                <p className="fw-bold">{selectedItem?.Nombre}</p>

                <CButton color="danger" onClick={deleteItem}>
                    Eliminar
                </CButton>
                </>
            )}

            {/* ----------- CREAR / EDITAR ----------- */}
            {(modalType === "create" || modalType === "edit") && (
                <>
                <CNav variant="tabs">
                    <CNavItem>
                    <CNavLink active={step === 1}>Información</CNavLink>
                    </CNavItem>
                    <CNavItem>
                    <CNavLink active={step === 2}>Detalles</CNavLink>
                    </CNavItem>
                    <CNavItem>
                    <CNavLink active={step === 3}>Confirmación</CNavLink>
                    </CNavItem>
                </CNav>

                <CTabContent className="mt-4">
                    {/* ------- PASO 1 ------- */}
                    <CTabPane visible={step === 1}>
                    <CForm>
                        <CFormInput
                        label="Nombre del producto"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        placeholder="Ej: Laptop Dell"
                        />

                        <CFormSelect
                        className="mt-3"
                        label="Categoría"
                        name="Categoria"
                        value={formData.Categoria}
                        onChange={handleChange}
                        >
                        <option value="">Seleccione...</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Mobiliario">Mobiliario</option>
                        <option value="Oficina">Oficina</option>
                        </CFormSelect>

                        <CButton className="mt-3" color="primary" onClick={() => setStep(2)}>
                        Siguiente
                        </CButton>
                    </CForm>
                    </CTabPane>

                    {/* ------- PASO 2 ------- */}
                    <CTabPane visible={step === 2}>
                    <CForm>
                        <CFormSelect
                        label="Estatus"
                        name="Estatus"
                        value={formData.Estatus}
                        onChange={handleChange}
                        >
                        <option value="">Seleccione...</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Agotado">Agotado</option>
                        </CFormSelect>

                        <CFormInput
                        className="mt-3"
                        type="number"
                        label="Cantidad"
                        name="Cantidad"
                        value={formData.Cantidad}
                        onChange={handleChange}
                        placeholder="Ej: 50"
                        />

                        <CFormInput
                        className="mt-3"
                        label="Precio Unitario"
                        name="Precio_Unit"
                        value={formData.Precio_Unit}
                        onChange={handleChange}
                        placeholder="Ej: 120$"
                        />

                        <div className="d-flex justify-content-between mt-3">
                        <CButton color="secondary" onClick={() => setStep(1)}>
                            Atrás
                        </CButton>

                        <CButton color="primary" onClick={() => setStep(3)}>
                            Siguiente
                        </CButton>
                        </div>
                    </CForm>
                    </CTabPane>

                    {/* ------- PASO 3 ------- */}
                    <CTabPane visible={step === 3}>
                    <h5 className="mb-4">Confirmar datos del producto</h5>

                    <div className="d-flex justify-content-between">
                        <CButton color="secondary" onClick={() => setStep(2)}>
                        Atrás
                        </CButton>

                        {modalType === "create" && (
                        <CButton color="success" onClick={saveItem}>
                            Guardar
                        </CButton>
                        )}

                        {modalType === "edit" && (
                        <CButton color="primary" onClick={updateItem}>
                            Actualizar
                        </CButton>
                        )}
                    </div>
                    </CTabPane>
                </CTabContent>
                </>
            )}
            </CModalBody>
        </CModal>
        </>
    )
    }

    export default Products
