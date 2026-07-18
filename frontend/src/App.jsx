import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import POSPage from './pages/POSPage';
import StaffPage from './pages/StaffPage';
import ReportsPage from './pages/ReportsPage';
import CustomersPage from './pages/CustomersPage';
import BranchesPage from './pages/BranchesPage';
import CategoriesPage from './pages/CategoriesPage';
import StockManagementPage from './pages/StockManagementPage';
import SuppliersPage from './pages/SuppliersPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import PaymentSettingsPage from './pages/PaymentSettingsPage';
import ReceiptSettingsPage from './pages/ReceiptSettingsPage';
import TaxSettingsPage from './pages/TaxSettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SecuritySettingsPage from './pages/SecuritySettingsPage';
import Layout from './components/common/Layout';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with Layout (Sidebar) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main Pages */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="branches" element={<BranchesPage />} />

          {/* Inventory Pages */}
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="stock-management" element={<StockManagementPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />

          {/* Settings Pages */}
          <Route path="settings/profile" element={<BusinessProfilePage />} />
          <Route path="settings/payment" element={<PaymentSettingsPage />} />
          <Route path="settings/receipt" element={<ReceiptSettingsPage />} />
          <Route path="settings/tax" element={<TaxSettingsPage />} />
          <Route path="settings/subscription" element={<SubscriptionPage />} />
          <Route path="settings/security" element={<SecuritySettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;