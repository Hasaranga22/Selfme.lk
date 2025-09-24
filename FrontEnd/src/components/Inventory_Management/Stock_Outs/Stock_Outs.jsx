import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Stock_Outs.css";

const API = "http://localhost:5000";

function Stock_Outs() {
  const [items, setItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  useEffect(() => {
    fetchItems();
    fetchRecentOrders();
  }, []);

  async function fetchItems() {
    try {
      const res = await axios.get(`${API}/products`);
      setItems(res.data || []);
    } catch (err) {
      console.error("fetchItems error:", err);
      setMessage("Failed to fetch items.");
    }
  }

  async function fetchRecentOrders() {
    try {
      const res = await axios.get(`${API}/stockouts`);
      setRecentOrders(
        (res.data || []).sort(
          (a, b) =>
            new Date(b.createdAt || b.orderDate) -
            new Date(a.createdAt || a.orderDate)
        )
      );
    } catch (err) {
      console.error("fetchRecentOrders err:", err);
    }
  }

  const addItemToOrder = (itemId) => {
    const item = items.find((it) => it._id === itemId);
    if (!item) return;

    setOrderItems((prev) => {
      const exist = prev.find((p) => p.product_id === item._id);
      if (exist) {
        return prev.map((p) =>
          p.product_id === item._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [
        ...prev,
        {
          product_id: item._id,
          item_name: item.item_name,
          price: Number(item.selling_price) || 0,
          quantity: 1,
        },
      ];
    });

    setSelectedItemId("");
  };

  const updateQuantity = (productId, qty) => {
    const n = Number(qty);
    if (isNaN(n) || n < 1) return;
    setOrderItems((prev) =>
      prev.map((i) =>
        i.product_id === productId ? { ...i, quantity: n } : i
      )
    );
  };

  const removeFromOrder = (productId) => {
    setOrderItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const total = orderItems.reduce(
    (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  const placeAndConfirmOrder = async () => {
    if (!type) {
      setMessage("Please select an order type first.");
      return;
    }
    if (type === "customer" && !customerId.trim()) {
      setMessage("Please enter Customer ID.");
      return;
    }
    if (orderItems.length === 0) {
      setMessage("Please add at least one item to the order.");
      return;
    }

    setLoading(true);
    try {
      const payloadItems = orderItems.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price,
        item_name: i.item_name,
      }));

      const res = await axios.post(`${API}/stockouts`, {
        customer_id: type === "customer" ? customerId : null,
        items: payloadItems,
        type,
      });

      const created = res.data;
      await axios.put(`${API}/stockouts/${created._id}/confirm`);
      
      setMessage("Order successfully placed and confirmed! Stock has been updated.");
      setOrderItems([]);
      setCustomerId("");
      setType("");
      fetchItems();
      fetchRecentOrders();
    } catch (err) {
      console.error("placeAndConfirmOrder err:", err);
      setMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmExistingOrder = async (orderId) => {
    try {
      await axios.put(`${API}/stockouts/${orderId}/confirm`);
      setMessage("Order confirmed successfully! Stock has been updated.");
      fetchItems();
      fetchRecentOrders();
    } catch (err) {
      console.error("confirmExistingOrder err:", err);
      setMessage("Failed to confirm order. Please try again.");
    }
  };

  const clearOrder = () => {
    setOrderItems([]);
    setCustomerId("");
    setType("");
    setSelectedItemId("");
    setMessage("");
  };

  return (
    <div className="stockouts-page" id="stockouts-main-page">
      <InventoryManagementNav />

      <div className="stockouts-container" id="stockouts-main-container">
        <div className="page-header" id="stockouts-page-header">
          <h1 className="page-title" id="stockouts-main-title">Stock Out Management</h1>
          <p className="page-subtitle" id="stockouts-subtitle">Create and process stock out orders for customers and technical team</p>
        </div>

        {message && (
          <div className={`message-alert ${message.includes('success') || message.includes('confirmed') ? 'success' : 'error'}`} id="stockouts-message-alert">
            {message}
          </div>
        )}

        <div className="main-content" id="stockouts-main-content">
          <div className="order-creation-card" id="order-creation-section">
            <div className="card-header" id="order-creation-header">
              <h2 id="create-order-title">Create New Stock Out Order</h2>
            </div>

            <div className="form-section" id="order-type-section">
              <div className="form-group" id="order-type-group">
                <label htmlFor="order-type-select" id="order-type-label">Order Type</label>
                <select
                  id="order-type-select"
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Order Type</option>
                  <option value="customer">Customer Order</option>
                  <option value="technical">Technical Team Order</option>
                </select>
              </div>

              {type === "customer" && (
                <div className="form-group" id="customer-id-group">
                  <label htmlFor="customer-id-input" id="customer-id-label">Customer ID</label>
                  <input
                    id="customer-id-input"
                    className="form-input"
                    placeholder="Enter Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>
              )}
            </div>

            {type && (
              <div className="form-section" id="item-selection-section">
                <div className="form-group" id="item-select-group">
                  <label htmlFor="item-select" id="item-select-label">Add Items to Order</label>
                  <select
                    id="item-select"
                    className="form-select item-select"
                    value={selectedItemId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) addItemToOrder(val);
                    }}
                  >
                    <option value="">Select item to add to order</option>
                    {items.map((item) => (
                      <option key={item._id} value={item._id} id={`item-option-${item._id}`}>
                        {item.item_name} — LKR {item.selling_price} — Stock: {item.quantity_in_stock}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {orderItems.length > 0 && (
              <div className="order-items-section" id="order-items-section">
                <div className="section-header" id="order-items-header">
                  <h3 id="order-items-title">Order Items</h3>
                  <button 
                    className="clear-order-btn" 
                    id="clear-order-button"
                    onClick={clearOrder}
                  >
                    Clear All
                  </button>
                </div>

                <div className="order-table-container" id="order-table-container">
                  <table className="order-table" id="order-items-table">
                    <thead id="order-table-head">
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Price (LKR)</th>
                        <th>Subtotal (LKR)</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody id="order-table-body">
                      {orderItems.map((item) => (
                        <tr key={item.product_id} id={`order-row-${item.product_id}`}>
                          <td className="item-name-cell" id={`item-name-${item.product_id}`}>
                            {item.item_name}
                          </td>
                          <td className="quantity-cell" id={`quantity-cell-${item.product_id}`}>
                            <input
                              id={`quantity-input-${item.product_id}`}
                              className="quantity-input"
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                            />
                          </td>
                          <td className="price-cell" id={`price-cell-${item.product_id}`}>
                            {Number(item.price).toLocaleString()}
                          </td>
                          <td className="subtotal-cell" id={`subtotal-cell-${item.product_id}`}>
                            {(item.price * item.quantity).toLocaleString("en-LK")}
                          </td>
                          <td className="action-cell" id={`action-cell-${item.product_id}`}>
                            <button
                              id={`remove-btn-${item.product_id}`}
                              className="remove-item-btn"
                              onClick={() => removeFromOrder(item.product_id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="order-total-section" id="order-total-section">
                    <div className="total-row" id="order-total-row">
                      <span className="total-label" id="total-label">Order Total:</span>
                      <span className="total-amount" id="total-amount">
                        LKR {total.toLocaleString("en-LK")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-actions" id="order-actions-section">
                  <button
                    id="place-confirm-order-btn"
                    className="place-order-btn"
                    onClick={placeAndConfirmOrder}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Place & Confirm Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="orders-history-card" id="orders-history-section">
            <div className="card-header" id="orders-history-header">
              <h2 id="orders-history-title">Recent Orders</h2>
            </div>

            {recentOrders.length === 0 ? (
              <div className="empty-state" id="empty-orders-state">
                <p>No orders have been placed yet.</p>
              </div>
            ) : (
              <div className="history-table-container" id="history-table-container">
                <table className="history-table" id="orders-history-table">
                  <thead id="history-table-head">
                    <tr>
                      <th>Order ID</th>
                      <th>Type</th>
                      <th>Customer/Team</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody id="history-table-body">
                    {recentOrders.map((order) => {
                      const orderDate = new Date(order.createdAt || order.orderDate);
                      return (
                        <tr key={order._id} id={`history-row-${order._id}`}>
                          <td className="order-id-cell" id={`order-id-${order._id}`}>
                            {order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="order-type-cell" id={`order-type-${order._id}`}>
                            {order.type === 'technical' ? 'Technical Team' : 'Customer'}
                          </td>
                          <td className="customer-cell" id={`customer-${order._id}`}>
                            {order.type === "technical" ? "Technical Team" : order.customer_id || "-"}
                          </td>
                          <td className="items-cell" id={`items-${order._id}`}>
                            <div className="items-list">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="item-detail" id={`item-detail-${order._id}-${idx}`}>
                                  {item.item_name} × {item.quantity}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="total-cell" id={`total-${order._id}`}>
                            LKR {Number(order.total || 0).toLocaleString()}
                          </td>
                          <td className="date-cell" id={`date-${order._id}`}>
                            <div className="date-info">
                              <div>{orderDate.toLocaleDateString()}</div>
                              <div className="time">{orderDate.toLocaleTimeString()}</div>
                            </div>
                          </td>
                          <td className="status-cell" id={`status-${order._id}`}>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="action-cell" id={`action-${order._id}`}>
                            {order.status !== "Confirmed" ? (
                              <button
                                id={`confirm-btn-${order._id}`}
                                className="confirm-order-btn"
                                onClick={() => confirmExistingOrder(order._id)}
                              >
                                Confirm
                              </button>
                            ) : (
                              <span className="confirmed-status" id={`confirmed-${order._id}`}>
                                Confirmed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock_Outs;