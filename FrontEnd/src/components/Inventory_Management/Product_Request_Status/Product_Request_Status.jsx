import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./Product_Request_Status.css";

function Product_Request_Status() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/productrequests');
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch requests. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (request) => {
    setSelectedRequest(request);
    setUpdateFormData({
      supplier_name: request.supplier_name,
      product_item: request.product_item,
      quantity: request.quantity,
      need_date: request.need_date.split('T')[0],
      unit_price: request.unit_price,
      remark: request.remark || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'quantity' || name === 'unit_price') {
      const quantity = name === 'quantity' ? parseFloat(value) || 0 : parseFloat(updateFormData.quantity) || 0;
      const unitPrice = name === 'unit_price' ? parseFloat(value) || 0 : parseFloat(updateFormData.unit_price) || 0;
      setUpdateFormData(prev => ({
        ...prev,
        total_cost: quantity * unitPrice
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
      setRequests(prev => prev.map(req => req._id === selectedRequest._id ? response.data : req));
      setShowUpdateModal(false);
      setSelectedRequest(null);
      setError(null);
    } catch (err) {
      setError('Failed to update request. Please try again.');
      console.error('Error updating request:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      await axios.delete(`http://localhost:5000/productrequests/${id}`);
      setRequests(prev => prev.filter(req => req._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete request. Please try again.');
      console.error('Error deleting request:', err);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.request_status === filterStatus;
    const matchesSearch =
      request.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.product_item.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'completed': return '#3b82f6';
      default: return '#f59e0b';
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading) {
    return (
      <div>
        <InventoryManagementNav />
        <div className="loading-container">
          <div className="spinner"></div>
          Loading requests...
        </div>
      </div>
    );
  }

  return (
    <div>
      <InventoryManagementNav />
      <div className="requests-container">
        <div className="requests-header">
          <h1>Product Request Status</h1>
          <p>Manage and track all product requests</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Search + Filter */}
        <div className="controls-row">
          <input
            type="text"
            placeholder="Search by supplier or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Summary */}
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Total Requests</h3>
            <span className="stat-number">{requests.length}</span>
          </div>
          <div className="summary-card">
            <h3>Pending Value</h3>
            <span className="stat-number">{formatCurrency(requests.filter(r => r.request_status === 'pending').reduce((a,b) => a + (b.total_cost||0),0))}</span>
          </div>
          <div className="summary-card">
            <h3>Approved Value</h3>
            <span className="stat-number">{formatCurrency(requests.filter(r => r.request_status === 'approved').reduce((a,b) => a + (b.total_cost||0),0))}</span>
          </div>
        </div>

        {/* Table */}
        <div className="requests-table-container">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">No requests found.</div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Need Date</th>
                  <th>Unit Price</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                  <th>Requested On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
                  <tr key={req._id}>
                    <td>{req.supplier_name}</td>
                    <td>{req.product_item}</td>
                    <td>{req.quantity}</td>
                    <td>{formatDate(req.need_date)}</td>
                    <td>{formatCurrency(req.unit_price)}</td>
                    <td>{formatCurrency(req.total_cost)}</td>
                    <td><span className="status-badge" style={{backgroundColor: getStatusColor(req.request_status)}}>{req.request_status}</span></td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td className="action-buttons">
                      <button className="btn-update" onClick={() => handleUpdateClick(req)}>Update</button>
                      <button className="btn-delete" onClick={() => handleDelete(req._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Update Request</h2>
                <button className="modal-close" onClick={() => setShowUpdateModal(false)}>×</button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Supplier Name *</label>
                    <input type="text" name="supplier_name" value={updateFormData.supplier_name} onChange={handleUpdateChange} required />
                  </div>
                  <div className="form-group">
                    <label>Product Item *</label>
                    <input type="text" name="product_item" value={updateFormData.product_item} onChange={handleUpdateChange} required />
                  </div>
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input type="number" name="quantity" value={updateFormData.quantity} onChange={handleUpdateChange} min="1" required />
                  </div>
                  <div className="form-group">
                    <label>Need Date *</label>
                    <input type="date" name="need_date" value={updateFormData.need_date} onChange={handleUpdateChange} required />
                  </div>
                  <div className="form-group">
                    <label>Unit Price ($) *</label>
                    <input type="number" name="unit_price" value={updateFormData.unit_price} onChange={handleUpdateChange} min="0" step="0.01" required />
                  </div>
                  <div className="form-group">
                    <label>Total Cost</label>
                    <input type="text" value={formatCurrency(updateFormData.quantity * updateFormData.unit_price || 0)} readOnly className="readonly-input"/>
                  </div>
                  <div className="form-group full-width">
                    <label>Remarks</label>
                    <textarea name="remark" value={updateFormData.remark} onChange={handleUpdateChange} rows="3" placeholder="Additional notes..." />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                  <button type="submit" className="btn-save">Update</button>
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
