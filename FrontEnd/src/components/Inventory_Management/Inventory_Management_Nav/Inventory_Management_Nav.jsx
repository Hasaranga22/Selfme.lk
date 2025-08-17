import React from "react";
import { Link } from "react-router-dom";
import "./Inventory_Management_Nav.css";

const InventoryManagementNav = () => {
  return (
    <nav className="inv-navbar" id="inv-nav">
      <div className="inv-brand" id="inv-brand">
        <Link to="/" className="inv-logo-link" id="inv-logo">
          Selfme.lk
        </Link>
      </div>

      <div className="inv-links" id="inv-links">
        <Link to="/inventory/add" className="inv-link" id="inv-add">
          Add Inventory Items
        </Link>
        <Link to="/inventory/view" className="inv-link" id="inv-view">
          View All Inventory Items
        </Link>
        <Link to="/inventory/stock-levels" className="inv-link" id="inv-stock">
          Stock Levels
        </Link>
        <Link
          to="/inventory/reorder-levels"
          className="inv-link"
          id="inv-reorder"
        >
          Re-Order Levels
        </Link>
        <Link
          to="/inventory/damaged-returns"
          className="inv-link"
          id="inv-damaged"
        >
          Damaged & Returned Items
        </Link>
        <Link to="/inventory/reports" className="inv-link" id="inv-reports">
          Reports
        </Link>
      </div>

      <div className="inv-actions" id="inv-actions">
        <button className="inv-signout-btn" id="inv-signout">
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default InventoryManagementNav;
