import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import { BACKEND_URL } from '../utils/api';
const Cart = () => {
  const { cartItems, updateCart, clearCart, loading: cartLoading } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const res = await api.get('/api/product/list');
        if (res.data.success) {
          const allProducts = res.data.products;
          const cartProductIds = Object.keys(cartItems);
          const filtered = allProducts.filter(p => cartProductIds.includes(p._id));
          setProducts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (Object.keys(cartItems).length > 0) {
      fetchCartProducts();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  if (loading || cartLoading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;

  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--text-muted)", margin: "1rem 0 2rem" }}>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  let totalAmount = 0;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>Your Cart</h1>
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "2rem", alignItems: "start" }}>
        
        <div className="card" style={{ padding: "1.5rem" }}>
          {products.map((product) => {
            const qty = cartItems[product._id];
            if (!qty) return null;
            const price = product.offerPrice > 0 ? product.offerPrice : product.price;
            totalAmount += price * qty;
            
            return (
              <div key={product._id} style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "white", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {product.image && product.image[0] ? (
                    <img src={`${BACKEND_URL}${product.image[0]}`} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ color: "#ccc", fontSize: "0.75rem" }}>No Img</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${product._id}`}><h3 style={{ fontSize: "1.1rem" }}>{product.name}</h3></Link>
                  <div style={{ color: "var(--primary)", fontWeight: "bold", marginTop: "0.25rem" }}>${price.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} onClick={() => updateCart(product._id, qty - 1)}>-</button>
                  <span style={{ width: "20px", textAlign: "center" }}>{qty}</span>
                  <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} onClick={() => updateCart(product._id, qty + 1)}>+</button>
                </div>
                <button className="btn btn-danger" style={{ padding: "0.5rem" }} onClick={() => updateCart(product._id, 0)}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          
          <div style={{ textAlign: "right" }}>
            <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>Order Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Delivery Fee</span>
            <span>Free</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "1.5rem 0", borderTop: "1px solid var(--border)", paddingTop: "1rem", fontSize: "1.25rem", fontWeight: "bold" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>${totalAmount.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", padding: "1rem" }} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
