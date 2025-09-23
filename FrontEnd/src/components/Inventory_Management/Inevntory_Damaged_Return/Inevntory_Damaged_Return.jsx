import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Inevntory_Damaged_Return.css";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";

const Inevntory_Damaged_Return = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    item: null,
    loading: false,
    newStatus: "",
    remark: "",
  });

  const navigate = useNavigate();

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

  const statusOptions = ["Damaged", "Returned", "Available"];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category !== "all") params.append("category", filters.category);
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const res = await axios.get(`http://localhost:5000/products?${params}`);
      const damagedReturnedItems = res.data.filter(
        (item) => item.status === "Damaged" || item.status === "Returned"
      );
      setItems(damagedReturnedItems);
      setFilteredItems(damagedReturnedItems);
    } catch (error) {
      setError("Failed to fetch damaged/returned items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters.category, filters.status, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    const results = items.filter((item) =>
      Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const openStatusModal = (item) =>
    setStatusModal({
      isOpen: true,
      item,
      loading: false,
      newStatus: item.status,
      remark: item.product_remark || "",
    });

  const closeStatusModal = () =>
    setStatusModal({ isOpen: false, item: null, loading: false, newStatus: "", remark: "" });

  const handleStatusChange = (e) => {
    setStatusModal((prev) => ({ ...prev, newStatus: e.target.value }));
  };

  const handleRemarkChange = (e) => {
    setStatusModal((prev) => ({ ...prev, remark: e.target.value }));
  };

  const handleStatusUpdate = async () => {
    if (!statusModal.item) return;
    try {
      setStatusModal((prev) => ({ ...prev, loading: true }));
      const updateData = {
        status: statusModal.newStatus,
        product_remark: statusModal.remark,
      };
      await axios.put(`http://localhost:5000/products/${statusModal.item._id}`, updateData);
      fetchItems();
      closeStatusModal();
    } catch (err) {
      setError("Failed to update status");
      setStatusModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const totalItems = items.length;
  const damagedItems = items.filter((item) => item.status === "Damaged").length;
  const returnedItems = items.filter((item) => item.status === "Returned").length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity_in_stock * item.purchase_price,
    0
  );

  if (loading)
    return (
      <div id="idr_loading-page">
        <InventoryManagementNav />
        <div className="idr_loading-container">
          <p className="idr_loading-text">Loading damaged & returned items...</p>
        </div>
      </div>
    );

  return (
    <div id="idr_inventory-damaged-return">
      <InventoryManagementNav />
      <div className="idr_damaged-return-container">
        <div className="idr_page-header">
          <h2>Damaged & Returned Inventory</h2>
          <p className="idr_page-subtitle">Manage and track products marked as damaged or returned</p>
        </div>

        {/* Statistics */}
        <div className="idr_stats-container">
          <div className="idr_stat-card">
            <h3>Damaged Items</h3>
            <p className="idr_stat-number">{damagedItems}</p>
          </div>
          <div className="idr_stat-card">
            <h3>Returned Items</h3>
            <p className="idr_stat-number">{returnedItems}</p>
          </div>
          <div className="idr_stat-card">
            <h3>Total Items</h3>
            <p className="idr_stat-number">{totalItems}</p>
          </div>
          <div className="idr_stat-card">
            <h3>Total Value</h3>
            <p className="idr_stat-number">LKR {totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="idr_filters-container">
          <div className="idr_search-box">
            <input
              type="text"
              placeholder="Search damaged/returned items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="idr_search-input"
            />
          </div>
          <div className="idr_filter-group">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value, filters.sortOrder)}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="item_name">Sort by Name</option>
              <option value="purchase_price">Sort by Cost</option>
              <option value="quantity_in_stock">Sort by Quantity</option>
            </select>
          </div>
        </div>

        {error && <div className="idr_error-message">{error}</div>}

        {/* Items Grid */}
        <div className="idr_items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className={`idr_item-card`}>
                <div className="idr_item-image-container">
                  <img
                    src={item.item_image ? `http://localhost:5000/images/${item.item_image}` : "/placeholder-image.png"}
                    alt={item.item_name}
                    className="idr_item-image"
                    onError={(e) => (e.target.src = "/placeholder-image.png")}
                  />
                  <div className={`idr_status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                  </div>
                </div>
                <div className="idr_item-details">
                  <h3 className="idr_item-name">{item.item_name}</h3>
                  <p className="idr_item-serial">SN: {item.serial_number}</p>
                  <p className="idr_item-category">{item.category}</p>
                  <p className="idr_stock-quantity">{item.quantity_in_stock} units</p>
                  <p className="idr_cost-price">Cost: LKR {item.purchase_price?.toLocaleString()}</p>
                  <p className="idr_loss-value">
                    Loss: LKR {(item.quantity_in_stock * item.purchase_price)?.toLocaleString()}
                  </p>
                  {item.product_remark && (
                    <p className="idr_item-remark"><strong>Reason:</strong> {item.product_remark}</p>
                  )}
                  {item.description && <p className="idr_item-description">{item.description}</p>}
                </div>
                <div className="idr_item-actions">
                  <button className="idr_btn-update" onClick={() => openStatusModal(item)}>
                    Update Status
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="idr_no-items-found">
              <h3>No Damaged or Returned Items Found</h3>
              <p>Currently no items are marked as damaged or returned.</p>
              {searchTerm && (
                <button className="idr_btn-clear-search" onClick={() => setSearchTerm("")}>
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {statusModal.isOpen && (
          <div className="idr_modal-overlay">
            <div className="idr_modal">
              <h3>Update Item Status</h3>
              <p>Update the status for "{statusModal.item?.item_name}"</p>

              <div className="idr_form-group">
                <label>Status:</label>
                <select value={statusModal.newStatus} onChange={handleStatusChange}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="idr_form-group">
                <label>Reason/Remarks:</label>
                <textarea
                  value={statusModal.remark}
                  onChange={handleRemarkChange}
                  placeholder="Enter reason for status change..."
                  rows="3"
                />
              </div>

              <div className="idr_modal-actions">
                <button className="idr_btn-cancel" onClick={closeStatusModal} disabled={statusModal.loading}>
                  Cancel
                </button>
                <button
                  className="idr_btn-confirm-update"
                  onClick={handleStatusUpdate}
                  disabled={statusModal.loading}
                >
                  {statusModal.loading ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inevntory_Damaged_Return;
