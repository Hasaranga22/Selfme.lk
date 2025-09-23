import React, { useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Add_Items.css";

const Add_Items = () => {
  const [formData, setFormData] = useState({
    serial_number: "",
    item_name: "",
    category: "",
    description: "",
    quantity_in_stock: "",
    re_order_level: "",
    supplier_id: "",
    purchase_price: "",
    selling_price: "",
    status: "Available",
    product_remark: "",
  });

  const [itemImage, setItemImage] = useState(null);

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

  const statusOptions = ["Available", "Coming Soon"];

  // Update form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // File upload
  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // Convert numeric fields
      const numericFields = [
        "quantity_in_stock",
        "re_order_level",
        "supplier_id",
        "purchase_price",
        "selling_price",
      ];

      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        if (numericFields.includes(key)) {
          value = value === "" ? null : Number(value);
        }
        data.append(key, value);
      });

      if (itemImage) {
        data.append("item_image", itemImage);
      }

      const res = await axios.post("http://localhost:5000/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        serial_number: "",
        item_name: "",
        category: "",
        description: "",
        quantity_in_stock: "",
        re_order_level: "",
        supplier_id: "",
        purchase_price: "",
        selling_price: "",
        status: "Available",
        product_remark: "",
      });
      setItemImage(null);
    } catch (error) {
      if (error.response) {
        // Mongoose unique error
        if (error.response.data.code === 11000) {
          alert("Error: Serial Number already exists!");
        } else {
          alert(`Error: ${error.response.data.message}`);
        }
        console.error(error.response.data);
      } else {
        alert("Error adding product");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <InventoryManagementNav />
      <div className="add-item-container">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="add-item-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="serial_number">Serial Number *</label>
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
                <label htmlFor="item_name">Product Name *</label>
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
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
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Product description, features, specifications..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="item_image">Upload Product Image</label>
              <input
                type="file"
                id="item_image"
                name="item_image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Inventory Information */}
          <div className="form-section">
            <h3>Inventory Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity_in_stock">Quantity in Stock *</label>
                <input
                  type="number"
                  id="quantity_in_stock"
                  name="quantity_in_stock"
                  placeholder="50"
                  min="0"
                  value={formData.quantity_in_stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="re_order_level">Re-order Level *</label>
                <input
                  type="number"
                  id="re_order_level"
                  name="re_order_level"
                  placeholder="10"
                  min="0"
                  value={formData.re_order_level}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="supplier_id">Supplier ID</label>
              <input
                type="number"
                id="supplier_id"
                name="supplier_id"
                placeholder="123"
                min="1"
                value={formData.supplier_id}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="form-section">
            <h3>Pricing Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purchase_price">Purchase Price (LKR) *</label>
                <input
                  type="number"
                  id="purchase_price"
                  name="purchase_price"
                  placeholder="15000.00"
                  min="0"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="selling_price">Selling Price (LKR) *</label>
                <input
                  type="number"
                  id="selling_price"
                  name="selling_price"
                  placeholder="20000.00"
                  min="0"
                  step="0.01"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Remarks (Conditional) */}
          {(formData.status === "Damaged" || formData.status === "Returned") && (
            <div className="form-section">
              <h3>Remarks</h3>
              <div className="form-group">
                <label htmlFor="product_remark">
                  {formData.status === "Damaged" ? "Damage Details" : "Return Reason"} *
                </label>
                <textarea
                  id="product_remark"
                  name="product_remark"
                  placeholder={
                    formData.status === "Damaged" ? "Describe the damage..." : "Reason for return..."
                  }
                  value={formData.product_remark}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="form-submit-btn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_Items;
