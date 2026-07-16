import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaCashRegister } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../api/client';

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/');
      setProducts(response.data.items || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: 'CASH',
      };

      const response = await api.post('/sales/', saleData);
      setReceiptData(response.data);
      setShowReceipt(true);
      clearCart();
      toast.success('Sale completed successfully!');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Sale failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaCashRegister className="text-primary-600" />
          Point of Sale
        </h1>
        <div className="text-sm text-gray-500">
          Cashier: {user?.name || 'Unknown'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-primary pl-10"
                placeholder="Search products..."
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    product.stock_quantity > 0
                      ? 'bg-primary-50 hover:bg-primary-100'
                      : 'bg-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (product.stock_quantity > 0) {
                      addItem(product);
                      toast.success(`${product.name} added to cart`);
                    } else {
                      toast.error('Out of stock');
                    }
                  }}
                >
                  <h3 className="font-medium text-sm text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.sku}</p>
                  <p className="text-primary-600 font-bold mt-1">
                    KES {product.selling_price}
                  </p>
                  <p className={`text-xs ${product.stock_quantity < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    Stock: {product.stock_quantity}
                  </p>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Cart</h2>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      KES {item.selling_price} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-primary-600 rounded"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-primary-600 rounded"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Cart is empty
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">KES {total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || loading}
                className="btn-primary w-full mt-4 py-3 text-lg"
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>

              <button
                onClick={clearCart}
                className="btn-secondary w-full mt-2 py-2 text-sm"
                disabled={items.length === 0}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: receiptData.receipt_html }}
            />
            <button
              onClick={() => setShowReceipt(false)}
              className="btn-primary w-full mt-4"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default POSPage;