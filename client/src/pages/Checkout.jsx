import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // New address form state
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "", country: "", phone: ""
  });

  const { cartItems, updateCart, clearCart } = useContext(CartContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchCartDetails();
  }, [cartItems]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/api/address/get');
      if (res.data.success) {
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0]._id);
        } else {
          setShowForm(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCartDetails = async () => {
    try {
      if (Object.keys(cartItems).length === 0) {
        navigate('/cart');
        return;
      }
      const res = await api.get('/api/product/list');
      if (res.data.success) {
        const cartProductIds = Object.keys(cartItems);
        const filtered = res.data.products.filter(p => cartProductIds.includes(p._id));
        setCartProducts(filtered);
        
        let total = 0;
        filtered.forEach(p => {
          const qty = cartItems[p._id];
          const price = p.offerPrice > 0 ? p.offerPrice : p.price;
          total += price * qty;
        });
        setTotalAmount(total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/api/address/add', formData);
      if (res.data.success) {
        setShowForm(false);
        fetchAddresses();
      }
    } catch (err) {
      alert("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }
    
    const selectedAddress = addresses.find(a => a._id === selectedAddressId);
    if (!selectedAddress) return;

    // Prepare items array
    const items = cartProducts.map(p => ({
      productId: p._id,
      name: p.name,
      price: p.offerPrice > 0 ? p.offerPrice : p.price,
      quantity: cartItems[p._id]
    }));

    // Remove _id and user ref from address to match model structure if needed,
    // actually API accepts flat address object based on IOrder schema
    const addressToSubmit = {
      firstName: selectedAddress.firstName,
      lastName: selectedAddress.lastName,
      email: selectedAddress.email,
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      zipcode: selectedAddress.zipcode,
      country: selectedAddress.country,
      phone: selectedAddress.phone,
    };

    try {
      setPlacingOrder(true);
      const res = await api.post('/api/order/place', {
        items,
        address: addressToSubmit,
        amount: totalAmount,
        paymentMethod: "COD"
      });
      if (res.data.success) {
        await clearCart(); // Context helper
        navigate('/orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
      setPlacingOrder(false);
    }
  };

  if (loading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Checkout</h1>
      
      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>1. Delivery Address</h2>
        
        {addresses.length > 0 && !showForm && (
          <div style={{ marginBottom: "1.5rem" }}>
            {addresses.map(addr => (
              <label key={addr._id} style={{ display: "block", padding: "1rem", border: `1px solid ${selectedAddressId === addr._id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: "0.5rem", marginBottom: "1rem", cursor: "pointer", background: selectedAddressId === addr._id ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input type="radio" name="address" checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id)} />
                  <div>
                    <strong>{addr.firstName} {addr.lastName}</strong> ({addr.phone})<br/>
                    <span style={{ color: "var(--text-muted)" }}>
                      {addr.street}, {addr.city}, {addr.state} {addr.zipcode}, {addr.country}
                    </span>
                  </div>
                </div>
              </label>
            ))}
            <button className="btn btn-outline" onClick={() => setShowForm(true)}>+ Add New Address</button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAddAddress}>
            <div className="grid grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group"><label>First Name</label><input required name="firstName" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>Last Name</label><input required name="lastName" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>Email</label><input required type="email" name="email" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>Phone</label><input required name="phone" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group" style={{ gridColumn: "span 2" }}><label>Street Address</label><input required name="street" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>City</label><input required name="city" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>State/Province</label><input required name="state" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>Zip/Postal Code</label><input required name="zipcode" className="form-control" onChange={handleInputChange} /></div>
              <div className="form-group"><label>Country</label><input required name="country" className="form-control" onChange={handleInputChange} /></div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary">Save Address</button>
              {addresses.length > 0 && <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>}
            </div>
          </form>
        )}
      </div>

      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>2. Payment Method</h2>
        <div style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "0.5rem" }}>
          <label style={{ display: "flex", gap: "1rem", cursor: "pointer" }}>
            <input type="radio" checked readOnly />
            <strong>Cash on Delivery (COD)</strong>
          </label>
        </div>
      </div>

      <div className="card" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Order Total</h2>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>₹{totalAmount.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }} onClick={handlePlaceOrder} disabled={placingOrder || showForm || !selectedAddressId}>
          {placingOrder ? "Placing Order..." : "Confirm & Place Order"}
        </button>
      </div>

    </div>
  );
};

export default Checkout;
