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

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch items.");
    }
  };

  const fetchRecentOrders = async () => {
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
      console.error(err);
    }
  };

  const addItemToOrder = (itemId) => {
    const item = items.find((it) => it._id === itemId);
    if (!item) return;

    setOrderItems((prev) => {
      const exist = prev.find((p) => p.product_id === item._id);
      if (exist) {
        if (exist.quantity >= item.quantity_in_stock) {
          setMessage(`Cannot add more. Only ${item.quantity_in_stock} available.`);
          return prev;
        }
        return prev.map((p) =>
          p.product_id === item._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prev,
        {
          product_id: item._id,
          item_name: item.item_name,
          price: Number(item.selling_price) || 0,
          quantity: 1,
          available_stock: item.quantity_in_stock,
        },
      ];
    });

    setSelectedItemId("");
    setMessage("");
  };

  const updateQuantity = (productId, qty) => {
    const n = Number(qty);
    if (isNaN(n) || n < 1) return;
    const item = orderItems.find((i) => i.product_id === productId);
    if (item && n > item.available_stock) {
      setMessage(`Cannot exceed available stock of ${item.available_stock}`);
      return;
    }
    setOrderItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity: n } : i))
    );
    setMessage("");
  };

  const removeFromOrder = (productId) => {
    setOrderItems((prev) => prev.filter((i) => i.product_id !== productId));
    setMessage("");
  };

  const total = orderItems.reduce(
    (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0
  );

  // ✅ Place and Confirm Order
  const placeAndConfirmOrder = async () => {
    if (!type) return setMessage("Please select an order type first.");
    if (type === "customer" && !customerId.trim())
      return setMessage("Please enter Customer ID.");
    if (orderItems.length === 0) return setMessage("Please add at least one item.");

    setLoading(true);
    try {
      const payloadItems = orderItems.map((i) => ({
        product_id: i.product_id,
        item_name: i.item_name,
        quantity: i.quantity,
        price: i.price,
      }));

      const orderPayload = {
        customer_id: type === "customer" ? customerId : "Technical Team",
        type: type, // must match backend enum ["customer", "technical"]
        items: payloadItems,
        total: total,
      };

      const res = await axios.post(`${API}/stockouts`, orderPayload);
      const createdOrder = res.data;

      // Confirm order immediately
      await axios.put(`${API}/stockouts/${createdOrder._id}/confirm`);

      setMessage("Order successfully placed and confirmed!");
      setOrderItems([]);
      setCustomerId("");
      setType("");
      setSelectedItemId("");
      fetchItems();
      fetchRecentOrders();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(
        err.response?.data?.message || "Failed to place order. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Confirm Existing Order
  const confirmExistingOrder = async (orderId) => {
    try {
      await axios.put(`${API}/stockouts/${orderId}/confirm`);
      setMessage("Order confirmed successfully!");
      fetchItems();
      fetchRecentOrders();
    } catch (err) {
      console.error(err);
      setMessage("Failed to confirm order. Try again.");
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
    <div className="stockouts-page">
      <InventoryManagementNav />

      <div className="stockouts-container">
        <div className="page-header">
          <h1>Stock Out & Order Management</h1>
          <p>Create and process stock out orders</p>
        </div>

        {message && <div className="message-alert">{message}</div>}

        <div className="main-content">
          {/* Form + Order Items */}
          <div className="order-creation-card">
            <div className="order-card-content">
              <div className="form-section">
                <h3>Create New Order</h3>

                <label>Order Type *</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select Order Type</option>
                  <option value="customer">Customer Order</option>
                  <option value="technical">Technical Team Order</option>
                </select>

                {type === "customer" && (
                  <>
                    <label>Customer ID *</label>
                    <input
                      type="text"
                      placeholder="Enter Customer ID"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                  </>
                )}

                {type && (
                  <>
                    <label>Add Item</label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => {
                        if (e.target.value) addItemToOrder(e.target.value);
                      }}
                    >
                      <option value="">Select Item</option>
                      {items
                        .filter((item) => item.quantity_in_stock > 0)
                        .map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.item_name} - LKR {item.selling_price} (Stock:{" "}
                            {item.quantity_in_stock})
                          </option>
                        ))}
                    </select>
                  </>
                )}
              </div>

              {orderItems.length > 0 && (
                <div className="order-items-section">
                  <h3>
                    Order Items ({orderItems.length}){" "}
                    <button className="clear-order-btn" onClick={clearOrder}>
                      Clear
                    </button>
                  </h3>

                  <table className="order-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.product_id}>
                          <td>{item.item_name}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              max={item.available_stock}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product_id, e.target.value)
                              }
                            />
                          </td>
                          <td>LKR {item.price.toLocaleString()}</td>
                          <td>LKR {(item.price * item.quantity).toLocaleString()}</td>
                          <td>
                            <button
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

                  <div className="order-total">
                    <strong>Total:</strong> LKR {total.toLocaleString()}
                  </div>

                  <button
                    className="place-order-btn"
                    onClick={placeAndConfirmOrder}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Place & Confirm Order"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="orders-history-card">
            <h3>Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Customer/Team</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 5).map((order) => {
                    const orderDate = new Date(order.createdAt || order.orderDate);
                    return (
                      <tr key={order._id}>
                        <td>{order._id.slice(-8).toUpperCase()}</td>
                        <td>{order.type === "technical" ? "Technical Team" : "Customer"}</td>
                        <td>{order.customer_id}</td>
                        <td>LKR {Number(order.total || 0).toLocaleString()}</td>
                        <td>{orderDate.toLocaleDateString()}</td>
                        <td>{order.status || "Pending"}</td>
                        <td>
                          {order.status !== "Confirmed" ? (
                            <button
                              className="confirm-btn"
                              onClick={() => confirmExistingOrder(order._id)}
                            >
                              Confirm
                            </button>
                          ) : (
                            <span>Confirmed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock_Outs;
