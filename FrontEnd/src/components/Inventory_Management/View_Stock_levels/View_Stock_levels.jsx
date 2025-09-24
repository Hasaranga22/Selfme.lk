import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./View_Stock_Levels.css";

const categories = [
  "All Categories",
  "Solar Panels",
  "Solar Batteries",
  "Solar Inverters",
  "Solar Controllers",
  "Solar Wires & Cables",
  "Mounting Structures & Accessories",
  "Solar Lights & Devices",
  "Solar Pumps & Appliances",
  "Monitoring & Miscellaneous Accessories",
];

function View_Stock_Levels() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("All Categories");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= reorderLevel) return "low-stock";
    if (quantity <= reorderLevel * 2) return "medium-stock";
    return "good-stock";
  };

  const getStatusText = (quantity, reorderLevel) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Reorder Needed";
    if (quantity <= reorderLevel * 2) return "Low Stock";
    return "In Stock";
  };

  // Filter items based on search, status, and category
  useEffect(() => {
    let results = items.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (filterStatus !== "all") {
      results = results.filter(
        (item) =>
          getStockStatus(item.quantity_in_stock, item.re_order_level) ===
          filterStatus
      );
    }

    if (filterCategory !== "All Categories") {
      results = results.filter((item) => item.category === filterCategory);
    }

    setFilteredItems(results);
  }, [searchTerm, filterStatus, filterCategory, items]);

  const calculateStats = () => {
    const totalItems = items.length;
    const lowStockItems = items.filter(
      (item) => item.quantity_in_stock <= item.re_order_level
    ).length;
    const outOfStockItems = items.filter(
      (item) => item.quantity_in_stock === 0
    ).length;

    return { totalItems, lowStockItems, outOfStockItems };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div id="stock-levels-page">
        <InventoryManagementNav />
        <div className="loading-container">
          <p>Loading stock levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="stock-levels-page">
      <InventoryManagementNav />
      <div id="stock-levels-container">
        <h2>Inventory Stock Levels</h2>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card total-items">
            <h3>Total Items</h3>
            <p>{stats.totalItems}</p>
          </div>
          <div className="stat-card low-stock">
            <h3>Low Stock Items</h3>
            <p>{stats.lowStockItems}</p>
          </div>
          <div className="stat-card out-of-stock">
            <h3>Out of Stock</h3>
            <p>{stats.outOfStockItems}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by item name, serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Stock Status</option>
            <option value="good-stock">In Stock</option>
            <option value="medium-stock">Low Stock</option>
            <option value="low-stock">Reorder Needed</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}

        <p className="results-count">{filteredItems.length} items found</p>

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Serial Number</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const status = getStockStatus(
                    item.quantity_in_stock,
                    item.re_order_level
                  );
                  const statusText = getStatusText(
                    item.quantity_in_stock,
                    item.re_order_level
                  );

                  return (
                    <tr key={item._id} className={status}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            item.item_image
                              ? `http://localhost:5000/images/${item.item_image}`
                              : "/placeholder-image.png"
                          }
                          alt={item.item_name}
                          className="table-item-image"
                        />
                      </td>
                      <td>{item.serial_number}</td>
                      <td>{item.item_name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity_in_stock}</td>
                      <td>{item.re_order_level}</td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>
                        <div className="stock-bar-container">
                          <div
                            className="stock-bar"
                            style={{
                              width: `${Math.min(
                                (item.quantity_in_stock /
                                  (item.re_order_level * 3)) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="no-items-cell">
                    No items found{searchTerm && ` matching "${searchTerm}"`}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default View_Stock_Levels;
