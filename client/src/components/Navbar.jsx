import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = React.useContext(AuthContext);
  const { cartItems } = React.useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = Object.values(cartItems || {}).reduce((acc, qty) => acc + qty, 0);

  return (
    <nav style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>
          GroceryGo
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/products" className="btn btn-outline">Shop</Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="btn btn-outline"><LayoutDashboard size={18}/> Admin</Link>
              )}
              {user.role === "customer" && (
                <Link to="/orders" className="btn btn-outline">Orders</Link>
              )}
              <Link to="/cart" className="btn btn-outline" style={{ position: "relative" }}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -8, right: -8, background: "var(--primary)", color: "#fff", borderRadius: "50%", padding: "2px 6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="btn btn-danger"><LogOut size={18}/></button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline"><UserIcon size={18}/> Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
