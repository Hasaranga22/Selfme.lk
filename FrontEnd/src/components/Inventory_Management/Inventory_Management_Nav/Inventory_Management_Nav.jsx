// InventoryManagementNav.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Inventory_Management_Nav.css";

const InventoryManagementNav = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <aside className="inv-nav">
      <div className="inv-nav__brand">
        <Link to="/inventory" className="inv-nav__brand-link">
          Selfme.lk
        </Link>
      </div>

      <nav className="inv-nav__menu" aria-label="Inventory Navigation">
        <ul className="inv-nav__list">
          {/* Inventory */}
          <li className="inv-nav__item">
            <button
              className={`inv-nav__header ${
                activeDropdown === 0 ? "is-active" : ""
              }`}
              onClick={() => toggleDropdown(0)}
              aria-expanded={activeDropdown === 0}
            >
              <span>Inventory</span>
              <span className="inv-nav__arrow">▾</span>
            </button>
            <div
              className={`inv-nav__submenu ${
                activeDropdown === 0 ? "is-open" : ""
              }`}
            >
              <Link to="/addItems" className="inv-nav__link">
                Add Items
              </Link>
              <Link to="/viewAllItems" className="inv-nav__link">
                View / Update / Delete Items
              </Link>
              <Link to="/stocklevels" className="inv-nav__link">
                Stock Levels
              </Link>
              <Link to="/reorderlevels" className="inv-nav__link">
                Reorder Alerts
              </Link>
              <Link to="/damage_return_add" className="inv-nav__link">
                Mark Damaged Item
              </Link>
            </div>
          </li>

          {/* Inventory Tracking */}
          <li className="inv-nav__item">
            <button
              className={`inv-nav__header ${
                activeDropdown === 1 ? "is-active" : ""
              }`}
              onClick={() => toggleDropdown(1)}
              aria-expanded={activeDropdown === 1}
            >
              <span>Inventory Tracking</span>
              <span className="inv-nav__arrow">▾</span>
            </button>
            <div
              className={`inv-nav__submenu ${
                activeDropdown === 1 ? "is-open" : ""
              }`}
            >
              <Link to="/order_placing" className="inv-nav__link">
                Place Order
              </Link>
              <Link to="/material_outgoings" className="inv-nav__link">
                Material Outgoings
              </Link>
            </div>
          </li>

          {/* Order Requests */}
          <li className="inv-nav__item">
            <button
              className={`inv-nav__header ${
                activeDropdown === 2 ? "is-active" : ""
              }`}
              onClick={() => toggleDropdown(2)}
              aria-expanded={activeDropdown === 2}
            >
              <span>Order Requests</span>
              <span className="inv-nav__arrow">▾</span>
            </button>
            <div
              className={`inv-nav__submenu ${
                activeDropdown === 2 ? "is-open" : ""
              }`}
            >
              <Link to="/product_request" className="inv-nav__link">
                Product Request
              </Link>
              <Link to="/product_status" className="inv-nav__link">
                Approve / Reject Requests
              </Link>
            </div>
          </li>

          {/* Supplier */}
          <li className="inv-nav__item">
            <button
              className={`inv-nav__header ${
                activeDropdown === 3 ? "is-active" : ""
              }`}
              onClick={() => toggleDropdown(3)}
              aria-expanded={activeDropdown === 3}
            >
              <span>Suppliers</span>
              <span className="inv-nav__arrow">▾</span>
            </button>
            <div
              className={`inv-nav__submenu ${
                activeDropdown === 3 ? "is-open" : ""
              }`}
            >
              <Link to="/addSupplier" className="inv-nav__link">
                Add Supplier
              </Link>
              <Link to="/viewSuppliers" className="inv-nav__link">
                View / Update / Delete Suppliers
              </Link>
            </div>
          </li>

          {/* Reports */}
          <li className="inv-nav__item">
            <button
              className={`inv-nav__header ${
                activeDropdown === 4 ? "is-active" : ""
              }`}
              onClick={() => toggleDropdown(4)}
              aria-expanded={activeDropdown === 4}
            >
              <span>Reports</span>
              <span className="inv-nav__arrow">▾</span>
            </button>
            <div
              className={`inv-nav__submenu ${
                activeDropdown === 4 ? "is-open" : ""
              }`}
            >
              <Link to="/reports/stock" className="inv-nav__link">
                Stock Summary
              </Link>
              <Link to="/reports/supplier" className="inv-nav__link">
                Supplier Report
              </Link>
              <Link to="/reports/request" className="inv-nav__link">
                Request Fulfillment
              </Link>
              <Link to="/reports/damage" className="inv-nav__link">
                Damaged Items Report
              </Link>
              <Link to="/reports/valuation" className="inv-nav__link">
                Inventory Valuation
              </Link>
            </div>
          </li>
        </ul>
      </nav>

      <div className="inv-nav__footer">
        <button className="inv-nav__signout">Sign Out</button>
      </div>
    </aside>
  );
};

export default InventoryManagementNav;
