import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Stock_Out_History.css";

const API = "http://localhost:5000";

const Stock_Outs_History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    customerOrders: 0,
    technicalOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/stockouts`);
      const confirmedOrders = (res.data || []).filter(
        (o) => (o.status || "").toLowerCase() === "confirmed"
      );
      const sortedOrders = confirmedOrders.sort(
        (a, b) =>
          new Date(b.createdAt || b.orderDate) -
          new Date(a.createdAt || a.orderDate)
      );
      setOrders(sortedOrders);
      calculateStats(sortedOrders);
    } catch (err) {
      console.error("fetchOrders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    setStats({
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      customerOrders: orders.filter((o) => o.type === "customer").length,
      technicalOrders: orders.filter((o) => o.type === "technical").length,
    });
  };

  const openDetails = (order) => setSelected(order);
  const closeDetails = () => setSelected(null);

  const displayItemName = (it) =>
    it.item_name ||
    (it.product && (it.product.item_name || it.product.itemName)) ||
    "Item";

  return (
    <div className="stockouts-history-page">
      <InventoryManagementNav />

      <div className="stockouts-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1>Stock Out History</h1>
          <p>
            Track confirmed stock out orders for customers and technical teams
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              LKR {stats.totalAmount.toLocaleString()}
            </div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.customerOrders}</div>
            <div className="stat-label">Customer Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.technicalOrders}</div>
            <div className="stat-label">Technical Orders</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-section">
          <div className="section-header">
            <h2>Confirmed Orders</h2>
            <button onClick={fetchOrders} className="refresh-btn">
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="loading-text">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="empty-text">No confirmed orders available.</p>
          ) : (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Type</th>
                    <th>Customer / Team</th>
                    <th>Items Count</th>
                    <th>Total Amount</th>
                    <th>Order Date</th>
                    <th>Order Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, index) => {
                    const placed = new Date(
                      o.createdAt || o.orderDate || Date.now()
                    );
                    const itemsCount = (o.items || []).reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0
                    );

                    return (
                      <tr key={o._id}>
                        <td>{index + 1}</td> {/* Order Count */}
                        <td>
                          {o.type === "technical" ? "Technical" : "Customer"}
                        </td>
                        <td>
                          {o.customer_id ||
                            (o.type === "technical" ? "Technical Team" : "N/A")}
                        </td>
                        <td>{itemsCount}</td>
                        <td>LKR {Number(o.total || 0).toLocaleString()}</td>
                        <td>{placed.toLocaleDateString()}</td>
                        <td>
                          {placed.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>Confirmed</td>
                        <td>
                          <button
                            onClick={() => openDetails(o)}
                            className="view-btn"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selected && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Order Details</h3>
                <button onClick={closeDetails} className="modal-close">
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-info">
                  <p>
                    <strong>Order Type:</strong> {selected.type || "Customer"}
                  </p>
                  <p>
                    <strong>Customer/Team:</strong>{" "}
                    {selected.customer_id ||
                      (selected.type === "technical"
                        ? "Technical Team"
                        : "N/A")}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      selected.createdAt || selected.orderDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(
                      selected.createdAt || selected.orderDate
                    ).toLocaleTimeString()}
                  </p>
                </div>

                <div className="modal-items">
                  <h4>Items</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selected.items || []).map((it, idx) => (
                        <tr key={idx}>
                          <td>{displayItemName(it)}</td>
                          <td>{it.quantity}</td>
                          <td>LKR {Number(it.price).toLocaleString()}</td>
                          <td>
                            LKR{" "}
                            {(
                              Number(it.price) * Number(it.quantity)
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modal-total">
                  <strong>Grand Total:</strong> LKR{" "}
                  {Number(selected.total || 0).toLocaleString()}
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={closeDetails} className="modal-close-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock_Outs_History;
