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
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch items
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

  // Handle search and filter
  useEffect(() => {
    let results = items.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Apply status filter
    if (filterStatus !== "all") {
      results = results.filter(item => {
        const status = getStockStatus(item.quantity_in_stock, item.re_order_level);
        return status === filterStatus;
      });
    }

    setFilteredItems(results);
  }, [searchTerm, items, filterStatus]);

  // Determine stock status
  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= reorderLevel) return "low-stock";
    if (quantity <= reorderLevel * 2) return "medium-stock";
    return "good-stock";
  };

  // Get status text
  const getStatusText = (quantity, reorderLevel) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Reorder Needed";
    if (quantity <= reorderLevel * 2) return "Low Stock";
    return "In Stock";
  };

  // Handle update product
  const handleUpdateProduct = (productId) => {
    // Navigate to update product page or open modal
    console.log("Update product:", productId);
    // You can implement navigation logic here
    // For example: navigate(`/update-product/${productId}`);
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalItems = items.length;
    const lowStockItems = items.filter(item => 
      item.quantity_in_stock <= item.re_order_level
    ).length;
    const outOfStockItems = items.filter(item => 
      item.quantity_in_stock === 0
    ).length;
    
    return { totalItems, lowStockItems, outOfStockItems };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div>
        <InventoryManagementNav />
        <div className="loading-container">
          <p className="loading-text">Loading stock levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InventoryManagementNav />
      <div className="stock-levels-container">
        <h2>Inventory Stock Levels</h2>
        
        {/* Statistics Cards */}
        <div className="stats-cards">
          <div className="stat-card total-items">
            <h3>Total Items</h3>
            <p className="stat-number">{stats.totalItems}</p>
          </div>
          <div className="stat-card low-stock">
            <h3>Low Stock Items</h3>
            <p className="stat-number">{stats.lowStockItems}</p>
          </div>
          <div className="stat-card out-of-stock">
            <h3>Out of Stock</h3>
            <p className="stat-number">{stats.outOfStockItems}</p>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by item name, serial number, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-group">
            <label>Filter by status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="good-stock">Good Stock</option>
              <option value="medium-stock">Low Stock</option>
              <option value="low-stock">Reorder Needed</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
        
        {error && <p className="error-text">{error}</p>}
        
        <div className="search-results-count">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </div>
        
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const status = getStockStatus(item.quantity_in_stock, item.re_order_level);
                  const statusText = getStatusText(item.quantity_in_stock, item.re_order_level);
                  
                  return (
                    <React.Fragment key={item._id}>
                      <tr className={`stock-row ${status}`}>
                        <td className="row-number">{index + 1}</td>
                        <td className="item-image-cell">
                          <img
                            src={item.item_image ? `http://localhost:5000/images/${item.item_image}` : '/placeholder-image.png'}
                            alt={item.item_name}
                            className="table-item-image"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.png';
                            }}
                          />
                        </td>
                        <td className="serial-number">{item.serial_number}</td>
                        <td className="item-name">{item.item_name}</td>
                        <td className="item-category">{item.category}</td>
                        <td className="current-stock">{item.quantity_in_stock}</td>
                        <td className="reorder-level">{item.re_order_level}</td>
                        <td className="status-cell">
                          <span className={`status-badge ${status}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="stock-visualization">
                          <div className="stock-bar-container">
                            <div 
                              className="stock-bar"
                              style={{ 
                                width: `${Math.min((item.quantity_in_stock / (item.re_order_level * 3)) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="stock-percentage">
                            {Math.min((item.quantity_in_stock / (item.re_order_level * 3)) * 100, 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button 
                            className="update-btn"
                            onClick={() => handleUpdateProduct(item._id)}
                            title="Update Product"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                      {/* Add horizontal line between products */}
                      {index < filteredItems.length - 1 && (
                        <tr className="separator-row">
                          <td colSpan="10">
                            <hr className="product-separator" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="no-items-cell">
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
              <span className="status-indicator good-stock"></span>
              <span>Good Stock - Above reorder level</span>
            </div>
            <div className="legend-item">
              <span className="status-indicator medium-stock"></span>
              <span>Low Stock - Approaching reorder level</span>
            </div>
            <div className="legend-item">
              <span className="status-indicator low-stock"></span>
              <span>Reorder Needed - At or below reorder level</span>
            </div>
            <div className="legend-item">
              <span className="status-indicator out-of-stock"></span>
              <span>Out of Stock - No items available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View_Stock_Levels;