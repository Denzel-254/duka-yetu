import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Cart = ({ items, total, updateQuantity, removeItem, clearCart }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Cart</h2>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
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

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary-600">KES {total.toFixed(2)}</span>
        </div>
        <button
          onClick={clearCart}
          className="btn-secondary w-full mt-2 py-2 text-sm"
          disabled={items.length === 0}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;