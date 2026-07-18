import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileInvoice, FaDownload, FaCalendarAlt, FaChartBar,
  FaChartLine, FaChartPie, FaFilter, FaPrint, FaFileExcel,
  FaFilePdf, FaSearch, FaChevronDown, FaClock, FaStore,
  FaShoppingBag, FaUsers, FaMoneyBillWave, FaArrowUp,
  FaArrowDown, FaCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import { formatCurrency, formatDate } from '../utils/helpers';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('weekly');
  const [reportType, setReportType] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    total_revenue: 0,
    total_orders: 0,
    average_order_value: 0,
    total_products_sold: 0,
    top_customer: '',
    growth: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch sales data
      const salesRes = await api.get('/sales/', {
        params: { limit: 100 }
      });
      
      if (salesRes.data && salesRes.data.items) {
        const sales = salesRes.data.items;
        setRecentOrders(sales.slice(0, 10));
        
        // Calculate summary
        const totalRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0);
        const totalOrders = sales.length;
        const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        setSummary({
          total_revenue: totalRevenue,
          total_orders: totalOrders,
          average_order_value: avgOrder,
          total_products_sold: sales.reduce((sum, s) => sum + (s.items?.length || 0), 0),
          top_customer: 'N/A',
          growth: 12.5,
        });

        // Calculate top products
        const productMap = {};
        sales.forEach(sale => {
          if (sale.items) {
            sale.items.forEach(item => {
              if (!productMap[item.product_id]) {
                productMap[item.product_id] = {
                  name: item.product_name,
                  quantity: 0,
                  revenue: 0,
                };
              }
              productMap[item.product_id].quantity += item.quantity;
              productMap[item.product_id].revenue += item.subtotal;
            });
          }
        });
        
        const sorted = Object.values(productMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);
        setTopProducts(sorted);
      }

    } catch (error) {
      console.error('Failed to fetch report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.total_revenue),
      icon: FaMoneyBillWave,
      color: 'bg-green-50 text-green-600',
      change: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: summary.total_orders,
      icon: FaShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      change: '+8.3%',
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(summary.average_order_value),
      icon: FaChartBar,
      color: 'bg-purple-50 text-purple-600',
      change: '+5.2%',
    },
    {
      title: 'Products Sold',
      value: summary.total_products_sold,
      icon: FaStore,
      color: 'bg-orange-50 text-orange-600',
      change: '+15.7%',
    },
  ];

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'yearly', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const reportTypes = [
    { value: 'sales', label: 'Sales Report' },
    { value: 'inventory', label: 'Inventory Report' },
    { value: 'customers', label: 'Customer Report' },
    { value: 'staff', label: 'Staff Report' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaFileInvoice className="text-primary-600" />
            Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">View and analyze your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FaDownload /> Export
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-primary py-2 px-3 bg-white text-sm"
            >
              {dateOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-primary py-2 px-3 bg-white text-sm"
            >
              {reportTypes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button className="btn-primary text-sm py-2 px-4">Generate Report</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="text-xl" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-green-600">{card.change}</span>
                <span className="text-gray-400">vs last period</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Top Selling Products</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{index + 1}.</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.quantity} sold</p>
                  </div>
                </div>
                <p className="font-semibold text-primary-600 text-sm">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Recent Orders</h3>
          <span className="text-xs text-gray-500">{recentOrders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Items</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-primary-50/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {order.receipt_number || `#${order.id.slice(0, 8)}`}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.sale_date)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{order.items?.length || 0}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-primary-600 text-right">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.payment_status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-600' :
                      order.payment_status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {order.payment_status || 'Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;