import React, { useState, useEffect } from "react"
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
  CFormSelect,
  CInputGroup,
  CInputGroupText
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import { cilTrash, cilPencil, cilPlus, cilSearch } from "@coreui/icons"

const API_BASE = 'http://localhost:4000'
// Cambiado: ahora usamos /products como fuente única (json-server)
const API_PRODUCTS = `${API_BASE}/products`

export const Stock = () => {

  // ------------------ TOAST ------------------
  const [toasts, setToasts] = useState([])

  const showToast = (type, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }])
  }

  // ------------------ MODAL ------------------
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)

  // ------------------ ESTADOS DEL STOCK ------------------
  const [productos, setProductos] = useState([])
  const [productoEdit, setProductoEdit] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("")

  // ------------------ FORMULARIO PRODUCTO (mapeado a esquema Products) ------------------
  const [formData, setFormData] = useState({
    Nombre: "",
    Categoria: "",
    Precio_Unit: "",
    Cantidad: "",
    stockMinimo: 0,
    codigo: "",
    Estatus: "Disponible",
  })

  // ------------------ CARGAR PRODUCTOS ------------------
  const cargarProductos = async () => {
    try {
      const resp = await fetch(API_PRODUCTS)
      if (!resp.ok) {
        showToast("danger", "Error al cargar los productos.")
        return
      }
      const data = await resp.json()
      setProductos(data)
    } catch (err) {
      console.error(err)
      showToast("danger", "No se pudo conectar con el servidor.")
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // ------------------ ABRIR MODAL ------------------
  const openModal = (type, producto = null) => {
    setModalType(type)
    if (type === "edit" && producto) {
      setProductoEdit(producto)
      // Mapear esquema product -> formData (corregido con campos correctos)
      setFormData({
        Nombre: producto.Nombre || "",
        Categoria: producto.Categoria || "",
        Precio_Unit: producto.Precio_Unit ?? "",
        Cantidad: producto.Cantidad ?? "",
        stockMinimo: producto.stockMinimo ?? 0,
        codigo: producto.codigo || producto.id || "",
        Estatus: producto.Estatus || "Disponible",
      })
    } else if (type === "add") {
      setProductoEdit(null)
      setFormData({
        Nombre: "",
        Categoria: "",
        Precio_Unit: "",
        Cantidad: "",
        stockMinimo: 0,
        codigo: "",
        Estatus: "Disponible",
      })
    }
    setModalVisible(true)
  }

  // ------------------ MANEJAR CAMBIOS FORMULARIO ------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ------------------ GUARDAR PRODUCTO (usa /products) ------------------
  const guardarProducto = async () => {
    // Validaciones básicas
    if (!formData.Nombre.trim() || formData.Precio_Unit === "" || formData.Cantidad === "") {
      showToast("warning", "Nombre, precio y cantidad son obligatorios.")
      return
    }

    // Construir payload compatible con Products.js
    const productoData = {
      ...formData,
      Precio_Unit: Number(formData.Precio_Unit),
      Cantidad: Number(formData.Cantidad),
      stockMinimo: Number(formData.stockMinimo) || 0,
    }

    try {
      let resp
      if (modalType === "edit" && productoEdit) {
        // Editar producto existente en /products
        resp = await fetch(`${API_PRODUCTS}/${productoEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoData),
        })
      } else {
        // Agregar nuevo producto en /products
        resp = await fetch(API_PRODUCTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoData),
        })
      }

      if (!resp.ok) {
        showToast("danger", "Error al guardar el producto.")
        return
      }

      showToast("success",
        modalType === "edit" ? "Producto actualizado correctamente." : "Producto agregado correctamente."
      )
      setModalVisible(false)
      cargarProductos() // Recargar la lista
    } catch (err) {
      console.error(err)
      showToast("danger", "Error de conexión con el servidor.")
    }
  }

  // ------------------ ELIMINAR PRODUCTO ------------------
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este producto?")) {
      return
    }

    try {
      const resp = await fetch(`${API_PRODUCTS}/${id}`, {
        method: "DELETE",
      })

      if (!resp.ok) {
        showToast("danger", "Error al eliminar el producto.")
        return
      }

      showToast("warning", "Producto eliminado correctamente.")
      cargarProductos() // Recargar la lista
    } catch (err) {
      console.error(err)
      showToast("danger", "Error de conexión con el servidor.")
    }
  }

  // ------------------ FILTRAR PRODUCTOS ------------------
  const productosFiltrados = productos.filter(producto => {
    const nombre = (producto.Nombre || "")
    const codigo = String(producto.codigo ?? producto.id ?? "")
    const coincideBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            codigo.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = !categoriaFiltro || producto.Categoria === categoriaFiltro
    return coincideBusqueda && coincideCategoria
  })

  // ------------------ OBTENER CATEGORÍAS ÚNICAS ------------------
  const categorias = [...new Set(productos.map(p => p.Categoria).filter(Boolean))]

  return (
    <>
      <CContainer className="mt-4">

        {/* ------------------ BARRA DE BÚSQUEDA Y FILTROS ------------------ */}
        <CForm className="mb-4">
          <CRow className="g-3 align-items-end">
            <CCol md={4}>
              <CFormLabel>Buscar Producto</CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Nombre o código del producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </CInputGroup>
            </CCol>

            <CCol md={3}>
              <CFormLabel>Filtrar por Categoría</CFormLabel>
              <CFormSelect
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CButton 
                color="primary" 
                onClick={() => openModal("add")}
                className="mt-4"
              >
                <CIcon icon={cilPlus} className="me-2" />
                Nuevo Producto
              </CButton>
            </CCol>
          </CRow>
        </CForm>

        {/* ------------------ TABLA DE PRODUCTOS ------------------ */}
        <h5>Gestión de Stock</h5>

        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Código</CTableHeaderCell>
              <CTableHeaderCell>Producto</CTableHeaderCell>
              <CTableHeaderCell>Categoría</CTableHeaderCell>
              <CTableHeaderCell>Precio</CTableHeaderCell>
              <CTableHeaderCell>Stock</CTableHeaderCell>
              <CTableHeaderCell>Stock Mínimo</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {productosFiltrados.map((producto) => (
              <CTableRow 
                key={producto.id} 
                className={Number(producto.Cantidad ?? 0) <= Number(producto.stockMinimo ?? 0) ? "table-warning" : ""}
              >
                <CTableDataCell>{producto.codigo || producto.id}</CTableDataCell>
                <CTableDataCell>{producto.Nombre}</CTableDataCell>
                <CTableDataCell>{producto.Categoria}</CTableDataCell>
                <CTableDataCell>${Number(producto.Precio_Unit ?? 0).toFixed(2)}</CTableDataCell>
                <CTableDataCell>
                  <span className={
                    Number(producto.Cantidad ?? 0) <= Number(producto.stockMinimo ?? 0) ? "text-danger fw-bold" : ""
                  }>
                    {producto.Cantidad}
                  </span>
                </CTableDataCell>
                <CTableDataCell>{producto.stockMinimo || 0}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openModal("edit", producto)}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {productosFiltrados.length === 0 && (
          <div className="text-center mt-4">
            <p className="text-muted">No se encontraron productos.</p>
          </div>
        )}
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

      {/* ------------------ MODAL AGREGAR/EDITAR PRODUCTO ------------------ */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            {modalType === "edit" ? "Editar Producto" : "Agregar Nuevo Producto"}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel>Nombre del Producto *</CFormLabel>
                <CFormInput
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre del producto"
                  required
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Código del Producto</CFormLabel>
                <CFormInput
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  placeholder="Código único del producto"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Categoría</CFormLabel>
                <CFormInput
                  name="Categoria"
                  value={formData.Categoria}
                  onChange={handleInputChange}
                  placeholder="Categoría del producto"
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Precio *</CFormLabel>
                <CFormInput
                  type="number"
                  name="Precio_Unit"
                  value={formData.Precio_Unit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Stock Actual *</CFormLabel>
                <CFormInput
                  type="number"
                  name="Cantidad"
                  value={formData.Cantidad}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Stock Mínimo</CFormLabel>
                <CFormInput
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </CCol>
            </CRow>

            <div className="mt-4">
              <CButton
                color="success"
                className="w-100"
                onClick={guardarProducto}
              >
                {modalType === "edit" ? "Actualizar Producto" : "Agregar Producto"}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Stock