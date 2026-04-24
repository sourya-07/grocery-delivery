import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api, { BACKEND_URL } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  
  const category = searchParams.get("category") || "all";
  
  const { updateCart, cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/product/list', {
        params: {
          category: category !== 'all' ? category : undefined,
          search: searchParams.get("search") || undefined
        }
      });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput) {
      searchParams.set("search", searchInput);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === 'all') {
      searchParams.delete("category");
    } else {
      searchParams.set("category", e.target.value);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const currentQty = cartItems[product._id] || 0;
    updateCart(product._id, currentQty + 1);
  };

  return (
    <div className="container">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>Browse Products</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select 
            className="form-control" 
            style={{ width: "auto" }} 
            value={category} 
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            {["Vegetables", "Fruits", "Dairy", "Drinks", "Bakery", "Grains"].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <form onSubmit={handleSearch} style={{ display: "flex" }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="form-control" 
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
          <h3>No products found.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {products.map(product => (
            <div key={product._id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <Link to={`/products/${product._id}`}>
                <div style={{ height: "200px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {product.image && product.image[0] ? (
                    <img 
                      src={`${BACKEND_URL}${product.image[0]}`} 
                      alt={product.name} 
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ color: "#ccc" }}>No Image</span>
                  )}
                </div>
              </Link>
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <Link to={`/products/${product._id}`}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{product.name}</h3>
                </Link>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1rem" }}>
                  {product.offerPrice > 0 ? (
                    <>
                      <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>₹{product.offerPrice.toFixed(2)}</span>
                      <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.9rem" }}>₹{product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>₹{product.price.toFixed(2)}</span>
                  )}
                </div>
                {!product.inStock ? (
                  <button className="btn btn-outline" disabled style={{ marginTop: "auto", width: "100%", opacity: 0.5 }}>Out of Stock</button>
                ) : (
                  cartItems[product._id] ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <button className="btn btn-outline" onClick={() => updateCart(product._id, cartItems[product._id] - 1)}>-</button>
                      <span>{cartItems[product._id]}</span>
                      <button className="btn btn-outline" onClick={() => updateCart(product._id, cartItems[product._id] + 1)}>+</button>
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleAddToCart(product)} style={{ marginTop: "auto", width: "100%" }}>
                      Add to Cart
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
