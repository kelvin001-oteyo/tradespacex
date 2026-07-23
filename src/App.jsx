import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Marketplace from './pages/Marketplace'
import ListingDetail from './pages/ListingDetail'
import SupplierProfile from './pages/SupplierProfile'
import MyListings from './pages/MyListings'
import ListingForm from './pages/ListingForm'
import Favorites from './pages/Favorites'


import Inbox from './pages/Inbox'
import ThreadView from './pages/ThreadView'
import QuoteRequest from './pages/QuoteRequest'
import Quotes from './pages/Quotes'

import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'


import PaymentMethods from './pages/PaymentMethods'
import Checkout from './pages/Checkout'
import Transactions from './pages/Transactions'
import Receipt from './pages/Receipt'

import Shipment from './pages/Shipment'


export default function App() {
  return (
    <AuthProvider>
      <Routes>


        <Route path="/payments/methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        <Route path="/payments/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/payments/transactions/:id" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
        <Route path="/orders/:id/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />


        <Route path="/orders/:orderId/shipment" element={<ProtectedRoute><Shipment /></ProtectedRoute>} />



        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />


        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />



        <Route path="/messages" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><ThreadView /></ProtectedRoute>} />
        <Route path="/marketplace/listing/:id/quote" element={<ProtectedRoute><QuoteRequest /></ProtectedRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />



        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/marketplace/new" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
        <Route path="/marketplace/edit/:id" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
        <Route path="/marketplace/listing/:id" element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
        <Route path="/marketplace/supplier/:id" element={<ProtectedRoute><SupplierProfile /></ProtectedRoute>} />
        <Route path="/marketplace/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/marketplace/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}