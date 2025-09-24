import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Product_Request_Status.css";

function Product_Request_Status() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/productrequests");
      setRequests(response.data);
    } catch (err) {
      setError("Failed to fetch requests. Please try again.");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (request) => {
    setSelectedRequest(request);
    setUpdateFormData({
      supplier_name: request.supplier_name || "",
      product_item: request.product_item || "",
      quantity: request.quantity ?? 1,
      need_date: request.need_date ? request.need_date.split("T")[0] : "",
      unit_price: request.unit_price ?? 0,
      total_cost: request.total_cost ?? 0,
      remark: request.remark || "",
      financial_status: request.financial_status || "pending",
      request_status: request.request_status || "pending",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "quantity" || name === "unit_price") {
      const quantity =
        name === "quantity"
          ? parseFloat(value) || 0
          : parseFloat(updateFormData.quantity) || 0;
      const unitPrice =
        name === "unit_price"
          ? parseFloat(value) || 0
          : parseFloat(updateFormData.unit_price) || 0;
      setUpdateFormData((prev) => ({
        ...prev,
        total_cost: quantity * unitPrice,
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/productrequests/${selectedRequest._id}`,
        updateFormData
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? response.data.updatedProductRequest
            : req
        )
      );
      setShowUpdateModal(false);
      setSelectedRequest(null);
      setError(null);
    } catch (err) {
      setError("Failed to update request. Please try again.");
      console.error("Error updating request:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/productrequests/${id}`);
      setRequests((prev) => prev.filter((req) => req._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete request. Please try again.");
      console.error("Error deleting request:", err);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      filterStatus === "all" || request.request_status === filterStatus;
    const matchesSearch =
      (request.supplier_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.product_item || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount ?? 0);

  if (loading) {
    return (
      <div className="page-container">
        <InventoryManagementNav />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <InventoryManagementNav />
      <div className="content-container">
        <div className="page-header">
          <h1>Product Request Status</h1>
          <p>Manage and track all product requests</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button className="error-close" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        <div className="summary-section">
          <div className="summary-card">
            <div className="summary-icon total">📋</div>
            <div className="summary-content">
              <h3>Total Requests</h3>
              <div className="stat-number">{requests.length}</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">⏳</div>
            <div className="summary-content">
              <h3>Pending Value</h3>
              <div className="stat-number">
                {formatCurrency(
                  requests
                    .filter((r) => r.request_status === "pending")
                    .reduce((a, b) => a + (b.total_cost ?? 0), 0)
                )}
              </div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon approved">✅</div>
            <div className="summary-content">
              <h3>Approved Value</h3>
              <div className="stat-number">
                {formatCurrency(
                  requests
                    .filter((r) => r.request_status === "approved")
                    .reduce((a, b) => a + (b.total_cost ?? 0), 0)
                )}
              </div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon completed">🎯</div>
            <div className="summary-content">
              <h3>Completed Value</h3>
              <div className="stat-number">
                {formatCurrency(
                  requests
                    .filter((r) => r.request_status === "completed")
                    .reduce((a, b) => a + (b.total_cost ?? 0), 0)
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="controls-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by supplier or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="table-container">
          {filteredRequests.length === 0 ? (
            <div className="no-data">
              <div className="no-data-icon">📭</div>
              <p>No requests found matching your criteria.</p>
            </div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th className="text-left">Supplier</th>
                  <th className="text-left">Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Need Date</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total Cost</th>
                  <th className="text-center">Request Status</th>
                  <th className="text-center">Financial Status</th>
                  <th className="text-center">Created</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="text-left">{req.supplier_name || "N/A"}</td>
                    <td className="text-left">{req.product_item || "N/A"}</td>
                    <td className="text-center">{req.quantity ?? 0}</td>
                    <td className="text-center">{formatDate(req.need_date)}</td>
                    <td className="text-right">
                      {formatCurrency(req.unit_price ?? 0)}
                    </td>
                    <td className="text-right">
                      {formatCurrency(req.total_cost ?? 0)}
                    </td>
                    <td className="text-center">
                      <span
                        className={`status-badge status-${req.request_status}`}
                      >
                        {req.request_status || "pending"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`status-badge status-${req.financial_status}`}
                      >
                        {req.financial_status || "pending"}
                      </span>
                    </td>
                    <td className="text-center">{formatDate(req.createdAt)}</td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleUpdateClick(req)}
                          title="Edit request"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(req._id)}
                          title="Delete request"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showUpdateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Update Product Request</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowUpdateModal(false)}
                  title="Close modal"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="supplier_name">Supplier Name *</label>
                    <input
                      type="text"
                      id="supplier_name"
                      name="supplier_name"
                      value={updateFormData.supplier_name}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="product_item">Product Item *</label>
                    <input
                      type="text"
                      id="product_item"
                      name="product_item"
                      value={updateFormData.product_item}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={updateFormData.quantity}
                      onChange={handleUpdateChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="need_date">Need Date *</label>
                    <input
                      type="date"
                      id="need_date"
                      name="need_date"
                      value={updateFormData.need_date}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="unit_price">Unit Price (USD) *</label>
                    <input
                      type="number"
                      id="unit_price"
                      name="unit_price"
                      value={updateFormData.unit_price}
                      onChange={handleUpdateChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="total_cost">Total Cost (USD)</label>
                    <input
                      type="text"
                      id="total_cost"
                      value={formatCurrency(updateFormData.total_cost)}
                      readOnly
                      className="readonly"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="request_status">Request Status</label>
                    <select
                      id="request_status"
                      name="request_status"
                      value={updateFormData.request_status}
                      onChange={handleUpdateChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="financial_status">Financial Status</label>
                    <select
                      id="financial_status"
                      name="financial_status"
                      value={updateFormData.financial_status}
                      onChange={handleUpdateChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="remark">Remarks</label>
                  <textarea
                    id="remark"
                    name="remark"
                    value={updateFormData.remark}
                    onChange={handleUpdateChange}
                    rows="3"
                    placeholder="Additional notes or specifications..."
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-save">
                    Update Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product_Request_Status;
