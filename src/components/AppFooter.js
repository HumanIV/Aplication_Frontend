import React from 'react'
import { CFooter } from '@coreui/react'
import { useSelector } from 'react-redux'

const AppFooter = () => {
  // Detectamos si el tema es oscuro para aplicar colores dinámicos
  // Si no usas redux para el tema, el CSS de abajo se encarga por ti

  return (
    <>
      <style>
        {`
          .custom-footer {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: all 0.3s ease-in-out;
            font-size: 0.85rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
          }

          /* MODO OSCURO */
          [data-coreui-theme="dark"] .custom-footer {
            background: rgba(0, 4, 30, 0.85) !important;
            color: rgba(255, 255, 255, 0.7) !important;
          }

          /* MODO CLARO */
          [data-coreui-theme="light"] .custom-footer {
            background: rgba(255, 255, 255, 0.7) !important;
            color: rgba(0, 0, 0, 0.8) !important;
            border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
          }

          .footer-brand {
            font-weight: 700;
            text-decoration: none;
            transition: color 0.3s;
          }

          [data-coreui-theme="dark"] .footer-brand { color: #58cc7d !important; } /* Verde V&A */
          [data-coreui-theme="light"] .footer-brand { color: #002d72 !important; } /* Azul V&A */
        `}
      </style>

      <CFooter className="px-4 custom-footer border-0">
        <div>
          <span className="footer-brand">V&A</span>
          <span className="ms-1">&copy; 2026 Sistema de Gestión Integral.</span>
        </div>
        <div className="ms-auto d-none d-sm-block">
          <span className="me-1">Versión 1.0.4 — Optimizado para</span>
          <span style={{ fontWeight: '600' }}>Administración</span>
        </div>
      </CFooter>
    </>
  )
}

export default React.memo(AppFooter)
