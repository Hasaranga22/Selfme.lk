import React from "react";
import { Link } from "react-router-dom";
import "./Inventory_Management_Nav.css";

const InventoryManagementNav = () => {
  return (
    <nav className="inv-navbar" id="inv-nav">
      {/* Brand */}
      <div className="inv-brand" id="inv-brand">
        <Link to="/inventory" className="inv-logo-link" id="inv-logo">
          Selfme.lk
        </Link>
      </div>

      {/* Nav Links */}
      <ul className="inv-links" id="inv-links">

        {/* Inventory */}
        <li className="dropdown">
          <span className="dropbtn">Inventory ▾</span>
          <div className="dropdown-content">
            <Link to="/addItems">Add Items</Link>
            <Link to="/viewAllItems">View / Update / Delete Items</Link>
            <Link to="/stocklevels">Stock Levels</Link>
            <Link to="/inventory/reorder-levels">Reorder Alerts</Link>
          </div>
        </li>

        {/* Suppliers */}
        <li className="dropdown">
          <span className="dropbtn">Suppliers ▾</span>
          <div className="dropdown-content">
            <Link to="/suppliers/add">Add Supplier</Link>
            <Link to="/suppliers/view">View / Update / Delete Suppliers</Link>
            <Link to="/suppliers/rating">Rate Suppliers</Link>
            <Link to="/suppliers/blacklist">Blacklist Suppliers</Link>
          </div>
        </li>

        {/* Requests */}
        <li className="dropdown">
          <span className="dropbtn">Requests ▾</span>
          <div className="dropdown-content">
            <Link to="/requests/pending">Pending Requests</Link>
            <Link to="/requests/approve">Approve / Reject Requests</Link>
            <Link to="/requests/supply">Supply Items</Link>
            <Link to="/requests/reports">Request Reports</Link>
          </div>
        </li>

        {/* Damage & Returns */}
        <li className="dropdown">
          <span className="dropbtn">Damage & Returns ▾</span>
          <div className="dropdown-content">
            <Link to="/damage/add">Mark Damaged Item</Link>
            <Link to="/returns/add">Return to Supplier</Link>
            <Link to="/damage/reports">Damage Reports</Link>
          </div>
        </li>

        {/* Reports */}
        <li className="dropdown">
          <span className="dropbtn">Reports ▾</span>
          <div className="dropdown-content">
            <Link to="/reports/stock">Stock Summary</Link>
            <Link to="/reports/supplier">Supplier Report</Link>
            <Link to="/reports/request">Request Fulfillment</Link>
            <Link to="/reports/damage">Damaged Items Report</Link>
            <Link to="/reports/valuation">Inventory Valuation</Link>
          </div>
        </li>
      </ul>

      {/* Actions */}
      <div className="inv-actions" id="inv-actions">
        <button className="inv-signout-btn" id="inv-signout">
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default InventoryManagementNav;
