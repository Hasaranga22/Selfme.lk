import React, { useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Add_Items.css";

const Add_Items = () => {
  const [formData, setFormData] = useState({
    serial_number: "",
    item_name: "",
    category: "",
    quantity_in_stock: "",
    supplier_id: "",
    min_stock_level: "",
  });

  const [itemImage, setItemImage] = useState(null);

  // Categories for dropdown
  const categories = [
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (itemImage) {
        data.append("item_image", itemImage);
      }

      const res = await axios.post("http://localhost:5000/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item added successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        serial_number: "",
        item_name: "",
        category: "",
        quantity_in_stock: "",
        supplier_id: "",
        min_stock_level: "",
      });
      setItemImage(null);
    } catch (error) {
      alert("Error adding item");
      console.error(error);
    }
  };

  return (
    <div>
      <InventoryManagementNav />
      <div className="add-item-container">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-group">
            <label htmlFor="serial_number">Serial Number</label>
            <input
              type="text"
              id="serial_number"
              name="serial_number"
              placeholder="SN12345"
              value={formData.serial_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="item_name">Item Name</label>
            <input
              type="text"
              id="item_name"
              name="item_name"
              placeholder="Battery Z300"
              value={formData.item_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="item_image">Upload Item Image</label>
            <input
              type="file"
              id="item_image"
              name="item_image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity_in_stock">Quantity in Stock</label>
            <input
              type="number"
              id="quantity_in_stock"
              name="quantity_in_stock"
              placeholder="5"
              min="0"
              value={formData.quantity_in_stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplier_id">Supplier ID</label>
            <input
              type="text"
              id="supplier_id"
              name="supplier_id"
              placeholder="SUP003E23E23"
              value={formData.supplier_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="min_stock_level">Minimum Stock Level</label>
            <input
              type="number"
              id="min_stock_level"
              name="min_stock_level"
              placeholder="2"
              min="0"
              value={formData.min_stock_level}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_Items;
