import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import "../Navbar.css"; // Import the CSS for styling

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login after logout
  };

  return (
    <nav className="conference-navbar navbar-expand-lg navbar-light custom-navbar">
      <Link className="navbar-brand" to="/home">
        Conference Rooms
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {user && (user.role === "clerk" || user.role === "manager") ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/addroom">
                  Add Room
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/viewrooms">
                  View Rooms
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/view-bookings">
                  Clerk View
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/consumable-items">
                  Consumable Items
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/view-all-bookings">
                  View Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="navbar-icons">
          <Link to="/cart" className="icon-container">
            <FaShoppingCart className="icon" />
            <span className="cart-text">Cart</span>
          </Link>
          <div className="icon-container logout-icon" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <span className="logout-text">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
