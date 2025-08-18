import React from "react";
import Nav from "./components/Nav/Navbar";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import InventoryManagementHome from "./components/Inventory_Management/Inventory_Management_Home/Inventory_Management_Home";
import Add_Items from "./components/Inventory_Management/Add_Items/Add_Items";
import View_All_Items from "./components/Inventory_Management/View_All_Items/View_All_Items";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Routes>
        <Route path="/inventory" element={<InventoryManagementHome />} />
        <Route path="/addItems" element={<Add_Items />} />
        <Route path="/viewAllItems" element
        ={<View_All_Items />} />
      </Routes>
    </div>
  );
}

export default App;
