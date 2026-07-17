import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import ProductForm from '../components/products/ProductForm';
import { formatCurrency } from '../utils/helpers';

const ProductsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const { products, loading, fetchProducts, deleteProduct, searchProducts } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === 'OWNER';

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      searchProducts(value);
    } else {
      fetchProducts();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        {isOwner && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>
        )}
      </div>

      <div className="card">
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            className="input-primary pl-10"
            placeholder="Search products..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">No products found</div>
          ) : (
            products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <FaImage className="text-4xl mx-auto mb-2" />
                        <span className="text-sm">No image</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{product.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary-600 font-bold">
                      {formatCurrency(product.selling_price)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock_quantity < 10
                        ? 'bg-red-100 text-red-600'
                        : product.stock_quantity < 20
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {product.stock_quantity} in stock
                    </span>
                  </div>

                  {isOwner && (
                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                setShowForm(false);
                setEditingProduct(null);
                fetchProducts();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;