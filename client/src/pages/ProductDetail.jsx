import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { cartItems, updateCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;
  if (!product) return <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>Product not found.</div>;

  const currentQty = cartItems[product._id] || 0;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    updateCart(product._id, currentQty + 1);
  };

  return (
    <div className="container">
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", padding: "2rem", alignItems: "center" }}>
        <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "0.5rem", display: "flex", justifyContent: "center" }}>
          {product.image && product.image[0] ? (
            <img src={`http://localhost:4000${product.image[0]}`} alt={product.name} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} />
          ) : (
            <div style={{ color: "#ccc", height: "300px", display: "flex", alignItems: "center" }}>No Image Available</div>
          )}
        </div>
        
        <div>
          <span style={{ backgroundColor: "var(--border)", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.875rem", color: "var(--text-light)" }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: "2.5rem", margin: "1rem 0" }}>{product.name}</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            {product.offerPrice > 0 ? (
              <>
                <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>${product.offerPrice.toFixed(2)}</span>
                <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "1.25rem" }}>${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <div style={{ marginBottom: "2rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
            {product.description && product.description.map((line, i) => (
              <p key={i} style={{ marginBottom: "0.5rem" }}>{line}</p>
            ))}
          </div>

          {!product.inStock ? (
            <button className="btn btn-outline" disabled style={{ width: "100%", opacity: 0.5 }}>Out of Stock</button>
          ) : (
            currentQty > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button className="btn btn-outline" onClick={() => updateCart(product._id, currentQty - 1)}>-</button>
                <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{currentQty} in cart</span>
                <button className="btn btn-outline" onClick={() => updateCart(product._id, currentQty + 1)}>+</button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleAddToCart} style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}>
                Add to Cart
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
