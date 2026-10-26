import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import ProtectedRoute from './components/common/ProtectedRoute'
import AppLayout from './layout/AppLayout'
import Login from './pages/Login'
import RoleRoute from './components/common/RoleRoute'
import ImportPage from './pages/imports/ImportPage'
import LandListPage from './pages/catalogs/LandListPage'
import ProductListPage from './pages/catalogs/ProductListPage'
import SupplierListPage from './pages/catalogs/SupplierListPage'
import NotFound from './pages/NotFound'
import PaymentsPage from './pages/payments/PaymentsPage'
import TicketFormPage from './pages/tickets/TicketFormPage'
import TicketListPage from './pages/tickets/TicketListPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/tickets/new" element={<TicketFormPage />} />
            <Route path="/tickets/:id/edit" element={<TicketFormPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/suppliers" element={<SupplierListPage />} />
            <Route path="/lands" element={<LandListPage />} />
            <Route path="/products" element={<ProductListPage />} />

            <Route element={<RoleRoute roles={['admin']} />}>
              <Route path="/imports" element={<ImportPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
