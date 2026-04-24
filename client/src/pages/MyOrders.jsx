import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import api from '../utils/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/order/user');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;

  if (orders.length === 0) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
        <Package size={64} style={{ color: "var(--text-muted)", marginBottom: "1rem", opacity: 0.5 }} />
        <h2>No Orders Yet</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>When you place orders, they will appear here.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#3b82f6';
      case 'Shipped': return '#f59e0b';
      case 'Delivered': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <h1 style={{ marginBottom: "2rem" }}>My Orders</h1>
      <div className="grid grid-cols-1">
        {orders.map(order => (
          <div key={order._id} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Order ID: {order._id}</span>
                <div style={{ marginTop: "0.25rem" }}>Placed on {new Date(order.date).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.875rem", fontWeight: "bold", backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>
                  {order.status}
                </span>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginTop: "0.25rem" }}>
                  ₹{order.amount.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>{item.quantity} × {item.name}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "var(--bg-dark)", borderRadius: "0.5rem", fontSize: "0.875rem" }}>
              <strong style={{ color: "var(--text-muted)" }}>Delivery Address:</strong><br/>
              {order.address.firstName} {order.address.lastName}, {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
