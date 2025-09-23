import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Order_Place.css";

const Order_Place = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Make sure your backend populates the product and supplier data
      const res = await axios.get("http://localhost:5000/orders?populate=true");
      
      console.log("Orders data with population:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely access nested data
  const getProductInfo = (order) => {
    // Handle different possible data structures
    if (order.product && typeof order.product === 'object') {
      return {
        name: order.product.item_name || order.product.name || "Unknown Product",
        sku: order.product.serial_number || order.product.sku || "N/A",
        stock: order.product.quantity_in_stock || 0,
        image: order.product.item_image || order.product.image,
        category: order.product.category || "N/A"
      };
    }
    
    // Fallback to direct properties
    return {
      name: order.item_name || "Unknown Product",
      sku: order.serial_number || "N/A",
      stock: order.quantity_in_stock || 0,
      image: order.item_image,
      category: order.category || "N/A"
    };
  };

  const getSupplierInfo = (order) => {
    // Handle different possible data structures
    if (order.supplier && typeof order.supplier === 'object') {
      return {
        name: order.supplier.supplier_name || order.supplier.name || "Unknown Supplier",
        company: order.supplier.company_name || order.supplier.company || "N/A",
        email: order.supplier.email,
        phone: order.supplier.phone,
        address: order.supplier.address
      };
    }
    
    // Fallback to direct properties
    return {
      name: order.supplier_name || "Unknown Supplier",
      company: order.company_name || "N/A",
      email: order.supplier_email,
      phone: order.supplier_phone,
      address: order.supplier_address
    };
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('uploads')) return `http://localhost:5000/${imagePath}`;
    return `http://localhost:5000/images/${imagePath}`;
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  if (loading) {
    return (
      <div>
        <InventoryManagementNav />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InventoryManagementNav />
      <div className="orders-dashboard">
        <header className="orders-header">
          <div className="header-content">
            <h2>📋 Placed Orders</h2>
            <p>Track all supplier orders with item and supplier details</p>
          </div>
          <button onClick={refreshOrders} className="refresh-btn">
            🔄 Refresh
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* Statistics */}
        <div className="orders-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">{orders.filter(o => o.status === 'completed').length}</p>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="orders-grid">
            {orders.map((order) => {
              const product = getProductInfo(order);
              const supplier = getSupplierInfo(order);
              const imageUrl = getImageUrl(product.image);

              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order #{(order._id || '').slice(-6).toUpperCase()}</span>
                    <span className={`status status-${order.status || 'pending'}`}>
                      {order.status || 'pending'}
                    </span>
                  </div>

                  <div className="order-content">
                    <div className="product-section">
                      <div className="product-image">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="image-placeholder">
                          {product.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="product-details">
                        <h3>{product.name}</h3>
                        <p><strong>SKU:</strong> {product.sku}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Current Stock:</strong> {product.stock}</p>
                      </div>
                    </div>

                    <div className="supplier-section">
                      <h4>Supplier Information</h4>
                      <p><strong>Name:</strong> {supplier.name}</p>
                      <p><strong>Company:</strong> {supplier.company}</p>
                      {supplier.email && <p><strong>Email:</strong> {supplier.email}</p>}
                      {supplier.phone && <p><strong>Phone:</strong> {supplier.phone}</p>}
                      {supplier.address && <p><strong>Address:</strong> {supplier.address}</p>}
                    </div>

                    <div className="order-section">
                      <h4>Order Details</h4>
                      <p><strong>Quantity Ordered:</strong> {order.quantity}</p>
                      <p><strong>Order Date:</strong> {new Date(order.orderDate || order.createdAt).toLocaleString()}</p>
                      <p><strong>Last Updated:</strong> {new Date(order.updatedAt || order.orderDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-orders">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Orders Found</h3>
              <p>You haven't placed any orders yet.</p>
              <button 
                onClick={() => window.location.href = '/re-order'}
                className="btn-primary"
              >
                Place Your First Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order_Place;