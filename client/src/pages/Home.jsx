import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = ["Vegetables", "Fruits", "Dairy", "Drinks", "Instant", "Bakery", "Grains"];

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <header style={{ padding: "4rem 0", background: "linear-gradient(135deg, var(--primary-dark), var(--bg-card))", borderRadius: "1rem", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Fresh Groceries, Delivered Fast</h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem" }}>
          Get the finest quality produce and essentials delivered directly to your door in minutes.
        </p>
        <Link to="/products" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1.1rem" }}>
          Start Shopping
        </Link>
      </header>

      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Shop by Category</h2>
        <div className="grid grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`} className="card" style={{ padding: "2rem 1rem", textAlign: "center", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
              <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--primary)" }}>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Guaranteed Freshness</h3>
          <p style={{ color: "var(--text-muted)" }}>We source daily from local farms to ensure maximum freshness.</p>
        </div>
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Fast Delivery</h3>
          <p style={{ color: "var(--text-muted)" }}>Our delivery agents work around the clock to bring your order fast.</p>
        </div>
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Affordable Prices</h3>
          <p style={{ color: "var(--text-muted)" }}>Competitive pricing and daily offers to save you money.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
