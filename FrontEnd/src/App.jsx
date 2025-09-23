import React from "react";
import Nav from "./components/Nav/Navbar";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import InventoryManagementHome from "./components/Inventory_Management/Inventory_Management_Home/Inventory_Management_Home";
import Add_Items from "./components/Inventory_Management/Add_Items/Add_Items";
import View_All_Items from "./components/Inventory_Management/View_All_Items/View_All_Items";
import Update_Items from "./components/Inventory_Management/Update_Items/Update_Items";
import View_Stock_Levels from "./components/Inventory_Management/View_Stock_levels/View_Stock_levels";
import Re_Order from "./components/Inventory_Management/Re_Order/Re_Order";
import Product_Request from "./components/Inventory_Management/Product_Request/Product_Request";
import Product_Request_Status from "./components/Inventory_Management/Product_Request_Status/Product_Request_Status";
import Inevntory_Damaged_Return from "./components/Inventory_Management/Inevntory_Damaged_Return/Inevntory_Damaged_Return";
import Add_Suppliers from "./components/Inventory_Management/Supplier/Supplier";
import View_Suppliers from "./components/Inventory_Management/View_Suppliers/View_Suppliers";
import Order_Place from "./components/Inventory_Management/Order_Place/Order_Place";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Routes>
        <Route path="/inventory" element={<InventoryManagementHome />} />
        <Route path="/addItems" element={<Add_Items />} />
        <Route path="/viewAllItems" element={<View_All_Items />} />
        <Route path="/updateItem/:id" element={<Update_Items />} />
        <Route path="/stocklevels" element={<View_Stock_Levels />} />
        <Route path="/reorderlevels" element={<Re_Order />} />

        <Route path="/product_request" element={<Product_Request />} />
        <Route path="/product_status" element={<Product_Request_Status />} />

        <Route
          path="/damage_return_add"
          element={<Inevntory_Damaged_Return />}
        />

<Route
          path="/order_placing"
          element={<Order_Place />}
        />
        {/* <Route
          path="/material_outgoings"
          element={<Inevntory_Damaged_Return />}
        /> */}

        <Route path="/addSupplier" element={<Add_Suppliers />} />
        <Route path="/viewSuppliers" element={<View_Suppliers />} />
      </Routes>
    </div>
  );
}

export default App;
