import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Pencil, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", category: "Vegetables", price: "", offerPrice: "0", description: "", inStock: true
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/product/list');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      offerPrice: product.offerPrice || 0,
      description: product.description ? product.description.join("\n") : "",
      inStock: product.inStock
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: "", category: "Vegetables", price: "", offerPrice: "0", description: "", inStock: true });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('images', imageFile);
    }
    
    try {
      if (editingId) {
        data.append('id', editingId);
        await api.put('/api/product/update', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/api/product/add', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete('/api/product/remove', { data: { id } });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div style={{ padding: "4rem 0" }}><div className="spinner"></div></div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>Manage Products</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--primary)" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>{editingId ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label>Product Name</label>
                <input required name="name" className="form-control" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" className="form-control" value={formData.category} onChange={handleInputChange}>
                  {["Vegetables", "Fruits", "Dairy", "Drinks", "Instant", "Bakery", "Grains"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input required type="number" step="0.01" name="price" className="form-control" value={formData.price} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Offer Price (Optional)</label>
                <input type="number" step="0.01" name="offerPrice" className="form-control" value={formData.offerPrice} onChange={handleInputChange} />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Description (one line per point)</label>
                <textarea rows="3" name="description" className="form-control" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input type="file" accept="image/*" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} />
                {editingId && !imageFile && <small style={{ color: "var(--text-muted)" }}>Leave blank to keep current image</small>}
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleInputChange} style={{ width: "1.25rem", height: "1.25rem" }} />
                <label style={{ margin: 0 }}>In Stock</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn btn-primary">Save Product</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "var(--bg-card)", borderRadius: "0.5rem", overflow: "hidden" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "rgba(0,0,0,0.2)" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Image</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Category</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Price</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>Stock</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ width: "50px", height: "50px", backgroundColor: "white", borderRadius: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {p.image && p.image[0] && <img src={`http://localhost:4000${p.image[0]}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} alt="" />}
                  </div>
                </td>
                <td style={{ padding: "1rem", fontWeight: "bold" }}>{p.name}</td>
                <td style={{ padding: "1rem" }}>{p.category}</td>
                <td style={{ padding: "1rem" }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  {p.inStock ? <span style={{ color: "var(--primary)" }}>Yes</span> : <span style={{ color: "var(--danger)" }}>No</span>}
                </td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <button className="btn btn-outline" style={{ padding: "0.5rem", marginRight: "0.5rem" }} onClick={() => handleEdit(p)}><Pencil size={16} /></button>
                  <button className="btn btn-danger" style={{ padding: "0.5rem" }} onClick={() => handleDelete(p._id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
