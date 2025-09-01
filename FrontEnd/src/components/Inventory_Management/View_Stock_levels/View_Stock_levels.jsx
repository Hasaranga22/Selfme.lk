import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./View_Stock_Levels.css";

function View_Stock_Levels() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch items
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/items");
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

  // ✅ Handle search
  useEffect(() => {
    const results = items.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  // ✅ Determine stock status
  const getStockStatus = (quantity, minStock) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= minStock) return "low-stock";
    if (quantity <= minStock * 2) return "medium-stock";
    return "good-stock";
  };

  // ✅ Get status text
  const getStatusText = (quantity, minStock) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= minStock) return "Reorder Needed";
    if (quantity <= minStock * 2) return "Low Stock";
    return "In Stock";
  };

  if (loading) {
    return (
      <div>
        <InventoryManagementNav />
        <p className="loading-text">Loading stock levels...</p>
      </div>
    );
  }

  return (
    <div>
      <InventoryManagementNav />
      <div className="stock-levels-container">
        <h2>Inventory Stock Levels</h2>
        
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search inventory items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="search-results-count">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </div>
        </div>
        
        {error && <p className="error-text">{error}</p>}
        
        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Stock Level</th>
                <th>Status</th>
                <th>Stock Availability</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = getStockStatus(item.quantity_in_stock, item.min_stock_level);
                  const statusText = getStatusText(item.quantity_in_stock, item.min_stock_level);
                  
                  return (
                    <tr key={item._id} className={`stock-row ${status}`}>
                      <td className="item-image-cell">
                        <img
                          src={`http://localhost:5000/images/${item.item_image}`}
                          alt={item.item_name}
                          className="table-item-image"
                        />
                      </td>
                      <td className="item-name">{item.item_name}</td>
                      <td className="item-category">{item.category}</td>
                      <td className="current-stock">{item.quantity_in_stock}</td>
                      <td className="min-stock">{item.min_stock_level}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${status}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="availability-cell">
                        <div className="stock-bar-container">
                          <div 
                            className="stock-bar"
                            style={{ 
                              width: `${Math.min((item.quantity_in_stock / (item.min_stock_level * 3)) * 100, 100)}%`,
                              backgroundColor: status === 'out-of-stock' ? '#dc3545' : 
                                            status === 'low-stock' ? '#ffc107' : 
                                            status === 'medium-stock' ? '#17a2b8' : '#28a745'
                            }}
                          ></div>
                        </div>
                        <span className="stock-percentage">
                          {Math.min((item.quantity_in_stock / (item.min_stock_level * 3)) * 100, 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="no-items-cell">
                    <div className="no-items-found">
                      <p>No items found{searchTerm && ` matching "${searchTerm}"`}.</p>
                      {searchTerm && (
                        <button 
                          className="clear-search-btn"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="stock-legend">
          <h3>Stock Status Legend:</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="status-badge good-stock"></span>
              <span>Good Stock</span>
            </div>
            <div className="legend-item">
              <span className="status-badge medium-stock"></span>
              <span>Low Stock</span>
            </div>
            <div className="legend-item">
              <span className="status-badge low-stock"></span>
              <span>Reorder Needed</span>
            </div>
            <div className="legend-item">
              <span className="status-badge out-of-stock"></span>
              <span>Out of Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View_Stock_Levels;