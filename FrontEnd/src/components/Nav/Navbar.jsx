import React from "react";
import './Navbar.css';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <h1>Selfme.lk</h1>
      <a href="/">Home</a>
      <a href="#">Products</a>
      <a href="#">Packages</a>
      <a href="#">Service</a>
      <a href="#">About Us</a>
      <a href="#">Contact</a>
      <a href="#">Login</a>
    </nav>
  );
};

export default Navbar;
