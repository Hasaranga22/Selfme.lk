import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Re_Order.css";

const Re_Order = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch low-stock items
  const fetchLowStockItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/products?lowStock=true");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reorder items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item._id));
    }
  };

  const handleReorder = (id = null) => {
    const itemsToReorder = id ? [id] : selectedItems;
    if (itemsToReorder.length === 0) {
      setError("Please select at least one item to reorder");
      return;
    }
    console.log("Reordering items:", itemsToReorder);
    alert(`Successfully reordered ${itemsToReorder.length} item(s)!`);
    setSelectedItems([]);
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
          <h2>Inventory Re-Order Management</h2>
          <p>Track and manage items that require replenishment</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        {items.length > 0 ? (
          <>
            {/* Bulk Actions */}
            <div className="bulk-actions">
              <div className="select-all">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedItems.length === items.length}
                  onChange={handleSelectAll}
                />
                <label htmlFor="select-all">
                  {selectedItems.length === items.length ? "Deselect All" : "Select All"}
                </label>
              </div>
              <button
                className="btn-primary"
                onClick={() => handleReorder()}
                disabled={selectedItems.length === 0}
              >
                Re-Order Selected ({selectedItems.length})
              </button>
            </div>

            {/* Items Grid */}
            <div className="items-grid">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`reorder-card ${
                    item.quantity_in_stock <= item.re_order_level ? "critical" : "low"
                  }`}
                >
                  <div className="card-top">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                    <button
                      className="btn-outline"
                      onClick={() => handleReorder(item._id)}
                    >
                      Re-Order Now
                    </button>
                  </div>

                  <img
                    src={
                      item.item_image
                        ? `http://localhost:5000/images/${item.item_image}`
                        : "/placeholder-image.png"
                    }
                    alt={item.item_name}
                  />

                  <div className="card-info">
                    <h3>{item.item_name}</h3>
                    <p className="sku">SKU: {item.serial_number}</p>
                    <div className="stock-details">
                      <p>
                        Stock: <span>{item.quantity_in_stock}</span>
                      </p>
                      <p>
                        Reorder Level: <span>{item.re_order_level}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-reorder-items">
            <h3>🎉 All Stock Levels are Healthy</h3>
            <p>No items require reordering right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Re_Order;
