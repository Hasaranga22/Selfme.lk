import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./View_All_Items.css";

const View_All_Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  // ✅ Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/updateItem/${id}`);
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/items/${id}`);

      if (response.status === 200) {
        alert("Item deleted successfully!");
        // Refresh items list
        fetchItems();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to delete item. Please try again.";
      setError(errorMessage);
      console.error("Delete error:", {
        error: err.message,
        response: err.response?.data,
      });
    }
  };

  if (loading) {
    return (
      <div>
        <InventoryManagementNav />
        <p className="loading-text">Loading items...</p>
      </div>
    );
  }

  return (
    <div>
      <InventoryManagementNav />
      <div className="view-items-container">
        <h2>All Items</h2>
        
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search items by name, category, serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon"></span>
          </div>
          <div className="search-results-count">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </div>
        </div>
        
        {error && <p className="error-text">{error}</p>}
        <div className="items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="item-card">
                <img
                  src={`http://localhost:5000/images/${item.item_image}`}
                  alt={item.item_name}
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.item_name}</h3>
                  <p>
                    <strong>Serial:</strong> {item.serial_number}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>In Stock:</strong> {item.quantity_in_stock}
                  </p>
                  <p>
                    <strong>Supplier:</strong> {item.supplier_id}
                  </p>
                  <p>
                    <strong>Min Stock:</strong> {item.min_stock_level}
                  </p>
                </div>
                {/* ✅ Update + Delete buttons */}
                <div className="item-actions">
                  <button
                    className="update-btn"
                    onClick={() => handleUpdate(item._id)}
                  >
                    Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default View_All_Items;