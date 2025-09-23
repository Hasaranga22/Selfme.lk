import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import "./View_Suppliers.css";

const View_Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/suppliers");
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Open edit modal
  const openEditModal = (supplier) => {
    setSelectedSupplier({
      ...supplier,
      newImage: null,
      imagePreview: supplier.image ? `http://localhost:5000/uploads/${supplier.image}` : null
    });
    setIsEditModalOpen(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image change in edit form
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSupplier(prev => ({
        ...prev,
        newImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Update supplier
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();
      Object.keys(selectedSupplier).forEach(key => {
        if (key !== 'image' && key !== 'imagePreview' && selectedSupplier[key] !== undefined) {
          formData.append(key, selectedSupplier[key] || '');
        }
      });

      if (selectedSupplier.newImage) {
        formData.append("image", selectedSupplier.newImage);
      }

      await axios.put(`http://localhost:5000/suppliers/${selectedSupplier._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUpdateSuccess(true);
      setIsEditModalOpen(false);
      fetchSuppliers();
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.error || "Failed to update supplier.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete supplier
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/suppliers/${supplierToDelete._id}`);
      setSuppliers(suppliers.filter((s) => s._id !== supplierToDelete._id));
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
    } catch (err) {
      alert("Failed to delete supplier.");
    }
  };

  // Open delete modal
  const openDeleteModal = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="suppliers-page">
      <InventoryManagementNav />

      <div className="suppliers-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-info">
            <h1>Supplier Management</h1>
            <p>Manage all supplier information</p>
          </div>
          <div className="header-actions">
            <button onClick={() => window.location.href = '/supplier'}>Add New Supplier</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-item">
            <h3>{suppliers.length}</h3>
            <p>Total Suppliers</p>
          </div>
          <div className="stat-item">
            <h3>{suppliers.filter(s => s.status === 'Active').length}</h3>
            <p>Active Suppliers</p>
          </div>
          <div className="stat-item">
            <h3>{suppliers.filter(s => s.status === 'Inactive').length}</h3>
            <p>Inactive Suppliers</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {updateSuccess && <div className="alert alert-success">Supplier updated successfully!</div>}

        {/* Supplier Cards */}
        <div className="suppliers-container">
          {loading ? (
            <p>Loading...</p>
          ) : suppliers.length === 0 ? (
            <p>No suppliers found.</p>
          ) : (
            <div className="suppliers-grid">
              {suppliers.map((supplier) => (
                <div key={supplier._id} className="supplier-card">
                  <div className="card-image">
                    {supplier.image ? <img src={`http://localhost:5000/uploads/${supplier.image}`} alt={supplier.name} /> :
                    <div className="image-placeholder">No Image</div>}
                  </div>
                  <div className="card-content">
                    <div className="supplier-header">
                      <h3>{supplier.name}</h3>
                      <span className={`status ${supplier.status?.toLowerCase() || 'active'}`}>{supplier.status || 'Active'}</span>
                    </div>
                    <div className="supplier-info">
                      <p>Company: {supplier.company_name || 'N/A'}</p>
                      <p>Email: {supplier.email || 'N/A'}</p>
                      <p>Phone: {supplier.phone || 'N/A'}</p>
                      <p>Address: {supplier.address || 'N/A'}</p>
                      {supplier.remark && <p>Remark: {supplier.remark}</p>}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => openEditModal(supplier)}>Edit</button>
                      <button onClick={() => openDeleteModal(supplier)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedSupplier && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Supplier</h2>
            <form onSubmit={handleUpdate}>
              <input type="text" name="name" value={selectedSupplier.name} onChange={handleInputChange} placeholder="Supplier Name" required />
              <input type="text" name="company_name" value={selectedSupplier.company_name || ''} onChange={handleInputChange} placeholder="Company Name" />
              <input type="email" name="email" value={selectedSupplier.email || ''} onChange={handleInputChange} placeholder="Email" />
              <input type="tel" name="phone" value={selectedSupplier.phone || ''} onChange={handleInputChange} placeholder="Phone" />
              
              {/* Status select */}
              <select name="status" value={selectedSupplier.status || 'Active'} onChange={handleInputChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <textarea name="address" value={selectedSupplier.address || ''} onChange={handleInputChange} placeholder="Address" rows="3" />
              <textarea name="remark" value={selectedSupplier.remark || ''} onChange={handleInputChange} placeholder="Remark" rows="2" />

              <input type="file" onChange={handleImageChange} />
              {selectedSupplier.imagePreview && <img src={selectedSupplier.imagePreview} alt="Preview" className="preview-img" />}

              {updateError && <p className="form-error">{updateError}</p>}

              <button type="submit">{updateLoading ? "Updating..." : "Update Supplier"}</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && supplierToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{supplierToDelete.name}</strong>?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default View_Suppliers;
