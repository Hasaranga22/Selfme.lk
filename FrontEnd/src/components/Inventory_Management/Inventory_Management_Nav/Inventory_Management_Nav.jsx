import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Inventory_Management_Nav.css";
import logo from "./logo selfme.png"; // Corrected import path

const InventoryManagementNav = () => {
  const location = useLocation(); // for active link highlighting

  // Categories always expanded
  const [activeDropdown] = useState([0, 1, 2, 3]);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="inv-nav">
      {/* Brand Section with Logo */}
      <div className="inv-nav__brand">
        <img src={logo} alt="Selfme Logo" className="inv-nav__logo" />
        <Link to="/inventory" className="inv-nav__brand-link">
          Selfme.lk
        </Link>
        <span className="inv-nav__subtitle">Inventory Management</span>
      </div>

      {/* Navigation */}
      <nav className="inv-nav__menu" aria-label="Inventory Navigation">
        <ul className="inv-nav__list">
          {/* Product Management */}
          <li className="inv-nav__item">
            <button className="inv-nav__header">
              <span>Product Management</span>
            </button>
            <div className="inv-nav__submenu">
              <Link
                to="/addItems"
                className={`inv-nav__link ${
                  isActive("/addItems") ? "active" : ""
                }`}
              >
                Add Items
              </Link>
              <Link
                to="/viewAllItems"
                className={`inv-nav__link ${
                  isActive("/viewAllItems") ? "active" : ""
                }`}
              >
                View / Update / Delete Items
              </Link>
              <Link
                to="/stocklevels"
                className={`inv-nav__link ${
                  isActive("/stocklevels") ? "active" : ""
                }`}
              >
                Stock Levels
              </Link>
              <Link
                to="/damage_return_add"
                className={`inv-nav__link ${
                  isActive("/damage_return_add") ? "active" : ""
                }`}
              >
                Mark Damaged / Return Items
              </Link>
            </div>
          </li>

          {/* Re-Order Handle */}
          <li className="inv-nav__item">
            <button className="inv-nav__header">
              <span>Re-Order Handle</span>
            </button>
            <div className="inv-nav__submenu">
              <Link
                to="/reorderlevels"
                className={`inv-nav__link ${
                  isActive("/reorderlevels") ? "active" : ""
                }`}
              >
                Re-Order Handle
              </Link>
              <Link
                to="/product_status"
                className={`inv-nav__link ${
                  isActive("/product_status") ? "active" : ""
                }`}
              >
                Approve / Reject Requests
              </Link>
            </div>
          </li>

          {/* Supplier */}
          <li className="inv-nav__item">
            <button className="inv-nav__header">
              <span>Supplier</span>
            </button>
            <div className="inv-nav__submenu">
              <Link
                to="/addSupplier"
                className={`inv-nav__link ${
                  isActive("/addSupplier") ? "active" : ""
                }`}
              >
                Add Supplier
              </Link>
              <Link
                to="/viewSuppliers"
                className={`inv-nav__link ${
                  isActive("/viewSuppliers") ? "active" : ""
                }`}
              >
                Manage Supplier
              </Link>
            </div>
          </li>

          {/* Reports */}
          <li className="inv-nav__item">
            <button className="inv-nav__header">
              <span>Reports</span>
            </button>
            <div className="inv-nav__submenu">
              <Link
                to="/reports/stock"
                className={`inv-nav__link ${
                  isActive("/reports/stock") ? "active" : ""
                }`}
              >
                Stock Summary
              </Link>
              <Link
                to="/reports/supplier"
                className={`inv-nav__link ${
                  isActive("/reports/supplier") ? "active" : ""
                }`}
              >
                Supplier Report
              </Link>
              <Link
                to="/reports/request"
                className={`inv-nav__link ${
                  isActive("/reports/request") ? "active" : ""
                }`}
              >
                Request Fulfillment
              </Link>
              <Link
                to="/reports/damage"
                className={`inv-nav__link ${
                  isActive("/reports/damage") ? "active" : ""
                }`}
              >
                Damaged Items Report
              </Link>
              <Link
                to="/reports/valuation"
                className={`inv-nav__link ${
                  isActive("/reports/valuation") ? "active" : ""
                }`}
              >
                Inventory Valuation
              </Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="inv-nav__footer">
        <button className="inv-nav__signout">Sign Out</button>
      </div>
    </aside>
  );
};

export default InventoryManagementNav;
