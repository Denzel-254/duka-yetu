import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaBoxes, 
  FaUsers, 
  FaChartLine, 
  FaExclamationTriangle,
  FaStore
} from 'react-icons/fa';
import api from '../../api/client';
import { formatCurrency } from '../../utils/helpers';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    today_sales_count: 0,
    today_revenue: 0,
    total_products: 0,
    low_stock_count: 0,
    total_staff: 0,
    total_sales_all_time: 0,
    total_revenue_all_time: 0,
  });
  const [weeklySales, setWeeklySales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [overviewRes, weeklyRes, lowStockRes] = await Promise.all([
        api.get('/dashboard/owner/overview'),
        api.get('/dashboard/owner/weekly-sales'),
        api.get('/dashboard/owner/low-stock'),
      ]);
      setStats(overviewRes.data);
      setWeeklySales(weeklyRes.data.data || []);
      setLowStock(lowStockRes.data.items || []);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: stats.today_sales_count,
      icon: FaShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.today_revenue),
      icon: FaMoneyBillWave,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: stats.total_products,
      icon: FaBoxes,
      color: 'bg-purple-500',
    },
    {
      title: 'Staff Members',
      value: stats.total_staff,
      icon: FaUsers,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Sales Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-primary-600" />
            Weekly Sales
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weeklySales.map((day) => (
            <div key={day.date} className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg h-32 flex items-end">
                  <div
                    className="w-full bg-primary-500 rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${Math.max((day.revenue / 1000) * 10, 5)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-xs font-medium text-gray-700">{day.sales_count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="card border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-red-500" />
            <h2 className="text-lg font-bold text-gray-800">Low Stock Alerts</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map((product) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">
                    Stock: {product.current_stock}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(product.selling_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;