import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/order/all');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.put('/api/order/status', { orderId, status });
      if (res.data.success) {
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>Manage Orders</h1>
      
      <div className="grid grid-cols-1">
        {orders.map(order => (
          <div key={order._id} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Order ID: {order._id}</span>
                <div style={{ marginTop: "0.25rem", fontWeight: "bold" }}>User: {order.userId?.name} ({order.userId?.email})</div>
                <div style={{ marginTop: "0.25rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>Placed on {new Date(order.date).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  ₹{order.amount.toFixed(2)}
                </div>
                <select 
                  className="form-control" 
                  style={{ width: "auto", padding: "0.5rem" }} 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Items</h3>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
                    <span>{item.quantity} × {item.name}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Delivery Address</h3>
                <div style={{ fontSize: "0.875rem" }}>
                  {order.address.firstName} {order.address.lastName}<br/>
                  {order.address.street}<br/>
                  {order.address.city}, {order.address.state} {order.address.zipcode}<br/>
                  {order.address.country}<br/>
                  Phone: {order.address.phone}
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
