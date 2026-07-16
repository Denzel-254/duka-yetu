import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCashRegister } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import api from '../../api/client';
import Cart from './Cart';
import Receipt from './Receipt';

const POSScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <div className="lg:col-span-1">
        <div className="card sticky top-4">
          <Cart
            items={items}
            total={total}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            clearCart={clearCart}
          />
          
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
            className="btn-primary w-full mt-4 py-3 text-lg"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>

      {receiptData && (
        <Receipt
          receiptData={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  );
};

export default POSScreen;