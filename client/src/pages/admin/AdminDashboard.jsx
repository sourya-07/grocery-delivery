import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users } from 'lucide-react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, ordRes, userRes] = await Promise.all([
          api.get('/api/product/list'),
          api.get('/api/order/all'),
          api.get('/api/user/all')
        ]);
        
        let revenue = 0;
        let ordersCount = 0;
        if (ordRes.data.success) {
          ordersCount = ordRes.data.orders.length;
          revenue = ordRes.data.orders.reduce((acc, order) => acc + order.amount, 0);
        }

        setStats({
          products: prodRes.data.success ? prodRes.data.products.length : 0,
          orders: ordersCount,
          revenue: revenue,
          users: userRes.data.success ? userRes.data.users.length : 0
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>
      
      <div className="grid grid-cols-4" style={{ marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--primary)", borderRadius: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹</span>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Total Revenue</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{stats.revenue.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderRadius: "0.5rem" }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Total Orders</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.orders}</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", borderRadius: "0.5rem" }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Products</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.products}</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", borderRadius: "0.5rem" }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Total Users</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{stats.users}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <Link to="/admin/products" className="card" style={{ padding: "2rem", textAlign: "center", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
          <ShoppingBag size={48} style={{ color: "var(--primary)", marginBottom: "1rem", opacity: 0.8 }} />
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Manage Products</h2>
          <p style={{ color: "var(--text-muted)" }}>Add, edit, or remove products</p>
        </Link>
        
        <Link to="/admin/orders" className="card" style={{ padding: "2rem", textAlign: "center", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
          <Package size={48} style={{ color: "var(--primary)", marginBottom: "1rem", opacity: 0.8 }} />
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Manage Orders</h2>
          <p style={{ color: "var(--text-muted)" }}>View orders and update status</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
