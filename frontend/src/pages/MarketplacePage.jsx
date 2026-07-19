import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaStore, FaSlidersH, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import useMarketCartStore from '../store/marketCartStore';
import { formatCurrency } from '../utils/helpers';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const addItem = useMarketCartStore((state) => state.addItem);
  const cartCount = useMarketCartStore((state) => state.items.length);

  const load = async () => {
    setLoading(true);
    try {
      const params = {
        q: q || undefined,
        category_id: categoryId || undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
      };
      const { data } = await api.get('/marketplace/products', { params });
      let items = data.items || [];
      if (sort === 'price_asc') items = [...items].sort((a, b) => a.selling_price - b.selling_price);
      if (sort === 'price_desc') items = [...items].sort((a, b) => b.selling_price - a.selling_price);
      if (sort === 'name') items = [...items].sort((a, b) => a.name.localeCompare(b.name));
      setProducts(items);
    } catch (error) {
      toast.error('Failed to load marketplace products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/marketplace/categories')
      .then(({ data }) => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
  }, [categoryId, sort]);

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 mb-3">Categories</h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCategoryId('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              !categoryId ? 'bg-primary-600 text-white' : 'hover:bg-primary-50 text-gray-700'
            }`}
          >
            All products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between ${
                categoryId === cat.id ? 'bg-primary-600 text-white' : 'hover:bg-primary-50 text-gray-700'
              }`}
            >
              <span>{cat.name}</span>
              <span className="opacity-70">{cat.product_count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800 mb-3">Price (KES)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <button type="button" onClick={load} className="btn-primary w-full mt-3 text-sm">
          Apply filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-50/40">
      <header className="bg-primary-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/shop" className="flex items-center gap-2 font-bold text-xl">
            <FaStore /> DukaMall
          </Link>
          <form
            className="flex-1 flex max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-l-lg px-4 py-2.5 text-gray-800"
              placeholder="Search products across verified shops"
            />
            <button type="submit" className="bg-primary-600 hover:bg-primary-500 px-4 rounded-r-lg">
              <FaSearch />
            </button>
          </form>
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg bg-white/10"
            onClick={() => setMobileFilters(true)}
          >
            <FaSlidersH />
          </button>
          <Link to="/shop/checkout" className="flex items-center gap-2 font-medium bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
            <FaShoppingCart /> <span className="hidden sm:inline">Cart</span> ({cartCount})
          </Link>
          <Link to="/" className="hidden md:inline text-sm text-primary-100 hover:text-white">
            Sell on Duka Yetu
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl border border-primary-100 shadow-sm p-5 sticky top-4">
              <Filters />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shop verified stores</h1>
                <p className="text-sm text-gray-500">{products.length} products available</p>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-xl border">No products match your filters</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="max-w-full overflow-hidden bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="px-4 py-3">
                      <Link to={`/shop/product/${product.id}`}>
                        <h2 className="text-base font-bold text-gray-800 uppercase line-clamp-1 hover:text-primary-700">
                          {product.name}
                        </h2>
                      </Link>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {product.description || `Sold by ${product.business_name}`}
                      </p>
                      {product.category_name && (
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-wide bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                          {product.category_name}
                        </span>
                      )}
                    </div>
                    <Link to={`/shop/product/${product.id}`}>
                      {product.image_url ? (
                        <img className="object-cover w-full h-44" src={product.image_url} alt={product.name} />
                      ) : (
                        <div className="w-full h-44 bg-primary-50 flex items-center justify-center text-primary-300">
                          <FaStore className="text-4xl" />
                        </div>
                      )}
                    </Link>
                    <div className="flex items-center justify-between px-4 py-3 bg-primary-900">
                      <h3 className="text-sm sm:text-base font-bold text-white">{formatCurrency(product.selling_price)}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          addItem(product);
                          toast.success('Added to cart');
                        }}
                        className="px-2 py-1 text-[10px] sm:text-xs font-semibold text-primary-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-primary-50 focus:outline-none"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">Filters</h2>
              <button type="button" onClick={() => setMobileFilters(false)}><FaTimes /></button>
            </div>
            <Filters />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
