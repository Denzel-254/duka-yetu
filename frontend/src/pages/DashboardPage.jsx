import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaMoneyBillWave, FaBoxes, FaUsers, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import OwnerDashboard from '../components/dashboard/OwnerDashboard';
import CashierDashboard from '../components/dashboard/CashierDashboard';
import api from '../api/client';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === 'OWNER';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name}!
        </p>
      </div>

      {isOwner ? <OwnerDashboard /> : <CashierDashboard />}
    </div>
  );
};

export default DashboardPage;