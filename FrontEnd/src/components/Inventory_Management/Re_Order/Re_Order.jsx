import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Re_Order.css";

const Re_Order = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchLowStockItems();
    fetchSuppliers();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/products?lowStock=true");
      setItems(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load reorder items.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/suppliers");
      const activeSuppliers = res.data.filter((sup) => sup.status === "Active");
      setSuppliers(activeSuppliers);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const openReorderModal = (item) => {
    setSelectedItem(item);
    setOrderQuantity(Math.max(1, item.re_order_level - item.quantity_in_stock + 10)); // Suggested quantity
    setSelectedSupplier("");
    setShowModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedSupplier || orderQuantity <= 0) {
      alert("Please select supplier and enter valid quantity");
      return;
    }

    try {
      setOrdering(true);
      
      const orderData = {
        product: selectedItem._id,
        supplier: selectedSupplier,
        quantity: parseInt(orderQuantity),
        status: "pending",
        orderDate: new Date().toISOString()
      };

      console.log("Placing order:", orderData);
      
      const response = await axios.post("http://localhost:5000/orders", orderData);
      
      if (response.data.success) {
        alert(`Order placed successfully for ${selectedItem.item_name}!`);
        setShowModal(false);
        fetchLowStockItems(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div>
        <InventoryManagementNav />
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Fetching low stock items...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InventoryManagementNav />
      <div className="reorder-dashboard">
        <header className="reorder-header">
          <h2>🔄 Inventory Re-Order Management</h2>
          <p>Track and manage items that require replenishment</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* Statistics */}
        <div className="reorder-stats">
          <div className="stat-card">
            <h3>Items Need Reordering</h3>
            <p className="stat-number">{items.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Suppliers</h3>
            <p className="stat-number">{suppliers.length}</p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="reorder-grid">
            {items.map((item) => (
              <div key={item._id} className="reorder-card low-stock">
                <div className="card-header">
                  <div className="urgency-badge">⚠️ Low Stock</div>
                  <span className="stock-info">
                    Current: {item.quantity_in_stock} | Reorder at: {item.re_order_level}
                  </span>
                </div>
                
                <div className="card-image-container">
                  <img
                    src={
                      item.item_image
                        ? `http://localhost:5000/images/${item.item_image}`
                        : "/placeholder-image.png"
                    }
                    alt={item.item_name}
                    className="item-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                </div>
                
                <div className="card-content">
                  <h3 className="item-name">{item.item_name}</h3>
                  <p className="item-sku">SKU: {item.serial_number || "N/A"}</p>
                  <p className="item-category">Category: {item.category}</p>
                  <div className="stock-details">
                    <div className="stock-meter">
                      <div 
                        className="stock-fill"
                        style={{
                          width: `${Math.min(100, (item.quantity_in_stock / item.re_order_level) * 100)}%`,
                          backgroundColor: item.quantity_in_stock <= item.re_order_level ? '#ef4444' : '#f59e0b'
                        }}
                      ></div>
                    </div>
                    <span className="stock-text">
                      {Math.round((item.quantity_in_stock / item.re_order_level) * 100)}% of reorder level
                    </span>
                  </div>
                  <p className="suggested-quantity">
                    Suggested order: {Math.max(1, item.re_order_level - item.quantity_in_stock + 10)} units
                  </p>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="reorder-btn"
                    onClick={() => openReorderModal(item)}
                    disabled={suppliers.length === 0}
                  >
                    {suppliers.length === 0 ? "No Suppliers Available" : "📦 Re-Order"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reorder-items">
            <div className="success-state">
              <div className="success-icon">✅</div>
              <h3>All items are well stocked!</h3>
              <p>No items currently need reordering.</p>
            </div>
          </div>
        )}

        {/* Reorder Modal */}
        {showModal && selectedItem && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>📋 Place Re-Order</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-summary">
                  <h4>Product Details</h4>
                  <div className="product-info">
                    <img
                      src={
                        selectedItem.item_image
                          ? `http://localhost:5000/images/${selectedItem.item_image}`
                          : "/placeholder-image.png"
                      }
                      alt={selectedItem.item_name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <strong>{selectedItem.item_name}</strong>
                      <p>SKU: {selectedItem.serial_number}</p>
                      <p>Current Stock: {selectedItem.quantity_in_stock}</p>
                      <p>Reorder Level: {selectedItem.re_order_level}</p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Order Quantity *</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="1000"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    placeholder="Enter quantity"
                  />
                  <small>Suggested: {Math.max(1, selectedItem.re_order_level - selectedItem.quantity_in_stock + 10)} units</small>
                </div>

                <div className="form-group">
                  <label htmlFor="supplier">Select Supplier *</label>
                  <select
                    id="supplier"
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    required
                  >
                    <option value="">Choose a supplier...</option>
                    {suppliers.map((sup) => (
                      <option key={sup._id} value={sup._id}>
                        {sup.name} - {sup.company_name} ({sup.email || sup.phone})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSupplier && (
                  <div className="supplier-info">
                    <h4>Selected Supplier</h4>
                    {suppliers.find(s => s._id === selectedSupplier) && (
                      <div className="supplier-details">
                        <p><strong>Contact:</strong> {suppliers.find(s => s._id === selectedSupplier).name}</p>
                        <p><strong>Company:</strong> {suppliers.find(s => s._id === selectedSupplier).company_name}</p>
                        <p><strong>Email:</strong> {suppliers.find(s => s._id === selectedSupplier).email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {suppliers.find(s => s._id === selectedSupplier).phone || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  disabled={ordering}
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  className="btn-primary"
                  disabled={!selectedSupplier || orderQuantity <= 0 || ordering}
                >
                  {ordering ? "🔄 Placing Order..." : "✅ Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Re_Order;