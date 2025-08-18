import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./View_All_Items.css";

const View_All_Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/items");
        setItems(res.data); // Make sure your backend sends an array
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
        <div className="items-grid">
          {items.length > 0 ? (
            items.map((item) => (
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
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default View_All_Items;
