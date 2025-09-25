import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryManagementNav from "../Inventory_Management_Nav/Inventory_Management_Nav";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "./logo selfme.png";
import "./View_Stock_Levels.css";

const categories = [
  "All Categories",
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

function View_Stock_Levels() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setItems(res.data);
        setFilteredItems(res.data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= reorderLevel) return "low-stock";
    if (quantity <= reorderLevel * 2) return "medium-stock";
    return "good-stock";
  };

  const getStatusText = (quantity, reorderLevel) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Reorder Needed";
    if (quantity <= reorderLevel * 2) return "Low Stock";
    return "In Stock";
  };

  useEffect(() => {
    let results = items.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (filterStatus !== "all") {
      results = results.filter(
        (item) =>
          getStockStatus(item.quantity_in_stock, item.re_order_level) ===
          filterStatus
      );
    }

    if (filterCategory !== "All Categories") {
      results = results.filter((item) => item.category === filterCategory);
    }

    setFilteredItems(results);
    setSelectedItems(new Set());
  }, [searchTerm, filterStatus, filterCategory, items]);

  // Selection
  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) newSelected.delete(itemId);
    else newSelected.add(itemId);
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((item) => item._id)));
    }
  };

  const calculateStats = () => {
    const totalItems = items.length;
    const lowStockItems = items.filter(
      (item) =>
        item.quantity_in_stock <= item.re_order_level &&
        item.quantity_in_stock > 0
    ).length;
    const outOfStockItems = items.filter(
      (item) => item.quantity_in_stock === 0
    ).length;
    return { totalItems, lowStockItems, outOfStockItems };
  };

  const stats = calculateStats();

  // PDF (kept same as before, images included)
  const generatePDF = async (itemsToExport, reportType = "all") => {
    setPdfLoading(true);
    try {
      const doc = new jsPDF();
      const date = new Date();
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();

      doc.addImage(logo, "PNG", 15, 8, 25, 25);
      doc.setFontSize(16);
      doc.text("SelfMe Pvt Ltd", 45, 15);
      doc.setFontSize(10);
      doc.text("No/346, Madalanda, Dompe, Colombo, Sri Lanka", 45, 22);
      doc.text(
        "Phone: +94 717 882 883 | Email: Selfmepvtltd@gmail.com",
        45,
        28
      );
      doc.line(15, 35, 195, 35);

      doc.setFontSize(14);
      let title =
        reportType === "selected"
          ? "SELECTED ITEMS REPORT"
          : "FULL INVENTORY REPORT";
      doc.text(title, 105, 48, { align: "center" });

      doc.setFontSize(10);
      doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, 20, 58);

      const tableColumns = [
        "#",
        "Image",
        "Serial",
        "Product Name",
        "Category",
        "Stock",
        "Reorder Level",
        "Status",
      ];
      const tableRows = itemsToExport.map((item, index) => [
        index + 1,
        item.item_image
          ? `http://localhost:5000/images/${item.item_image}`
          : "/placeholder-image.png",
        item.serial_number,
        item.item_name,
        item.category,
        item.quantity_in_stock.toString(),
        item.re_order_level.toString(),
        getStatusText(item.quantity_in_stock, item.re_order_level),
      ]);

      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 70,
        theme: "grid",
        headStyles: {
          fillColor: [66, 153, 225],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        didDrawCell: (data) => {
          if (data.column.index === 1 && data.cell.section === "body") {
            const imgUrl = data.cell.raw;
            const dim = 10;
            const x = data.cell.x + 1;
            const y = data.cell.y + 1;
            const img = new Image();
            img.src = imgUrl;
            img.crossOrigin = "Anonymous";
            img.onload = () => {
              doc.addImage(img, "PNG", x, y, dim, dim);
            };
          }
        },
      });

      const fileName = `Stock_Report_${reportType}_${formattedDate.replace(
        /\//g,
        "-"
      )}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleAllItemsPDF = () => {
    if (items.length === 0) return alert("No items in inventory.");
    generatePDF(items, "all");
  };

  const handleSelectedPDF = () => {
    const selectedProducts = filteredItems.filter((item) =>
      selectedItems.has(item._id)
    );
    if (selectedProducts.length === 0) return alert("Please select items.");
    generatePDF(selectedProducts, "selected");
  };

  if (loading) {
    return (
      <div id="stock-levels-page">
        <InventoryManagementNav />
        <div className="loading-container">Loading stock levels...</div>
      </div>
    );
  }

  return (
    <div id="stock-levels-page">
      <InventoryManagementNav />
      <div id="stock-levels-container">
        <div className="header-section">
          <h2>Inventory Stock Levels</h2>
        </div>

        {/* Stats */}
        <div className="stats-cards">
          <div className="stat-card total-items">
            <h3>Total Items</h3>
            <p>{stats.totalItems}</p>
          </div>
          <div className="stat-card low-stock">
            <h3>Low Stock</h3>
            <p>{stats.lowStockItems}</p>
          </div>
          <div className="stat-card out-of-stock">
            <h3>Out of Stock</h3>
            <p>{stats.outOfStockItems}</p>
          </div>
          <div className="stat-card selected-items">
            <h3>Selected Items</h3>
            <p>{selectedItems.size}</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by item name, serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Stock Status</option>
            <option value="good-stock">In Stock</option>
            <option value="medium-stock">Low Stock</option>
            <option value="low-stock">Reorder Needed</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="selection-controls">
            <button
              className="select-all-btn"
              onClick={selectAllItems}
              disabled={filteredItems.length === 0}
            >
              {selectedItems.size === filteredItems.length &&
              filteredItems.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* PDF buttons near table */}
        <div className="pdf-controls" style={{ marginBottom: "12px" }}>
          <button
            className="pdf-btn primary"
            onClick={handleAllItemsPDF}
            disabled={pdfLoading || items.length === 0}
          >
            {pdfLoading ? "Generating..." : "Full Inventory PDF"}
          </button>
          <button
            className="pdf-btn accent"
            onClick={handleSelectedPDF}
            disabled={pdfLoading || selectedItems.size === 0}
          >
            {pdfLoading
              ? "Generating..."
              : `Selected (${selectedItems.size}) PDF`}
          </button>
        </div>

        {/* Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.size === filteredItems.length &&
                      filteredItems.length > 0
                    }
                    onChange={selectAllItems}
                    disabled={filteredItems.length === 0}
                  />
                </th>
                <th>#</th>
                <th>Product Image</th>
                <th>Serial Number</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const status = getStockStatus(
                    item.quantity_in_stock,
                    item.re_order_level
                  );
                  const statusText = getStatusText(
                    item.quantity_in_stock,
                    item.re_order_level
                  );
                  const percentage = Math.min(
                    Math.round(
                      (item.quantity_in_stock /
                        (item.re_order_level * 3 || 1)) *
                        100
                    ),
                    100
                  );

                  return (
                    <tr
                      key={item._id}
                      className={`${status} ${
                        selectedItems.has(item._id) ? "selected" : ""
                      }`}
                    >
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            item.item_image
                              ? `http://localhost:5000/images/${item.item_image}`
                              : "/placeholder-image.png"
                          }
                          alt={item.item_name}
                          className="table-item-image"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      </td>
                      <td>{item.serial_number}</td>
                      <td>{item.item_name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity_in_stock}</td>
                      <td>{item.re_order_level}</td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          {statusText}
                        </span>
                      </td>
                      <td>
                        <div className="stock-bar-container">
                          <div
                            className={`stock-bar ${status}`}
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="stock-bar-label">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="no-items-cell">
                    No items found{searchTerm && ` matching "${searchTerm}"`}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default View_Stock_Levels;
