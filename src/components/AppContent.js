// src/components/AppContent.js (NUEVO - necesario)
import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import routes from '../routes'
import { CSpinner } from '@coreui/react'

const AppContent = () => {
  return (
    <div className="content-wrapper">
      <Suspense fallback={
        <div className="text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
        </Routes>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)