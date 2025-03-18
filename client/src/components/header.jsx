// src/components/Header.js

import React from 'react';
import '../header.css'; // Create a separate CSS file for Header styles

export const Header = () => {
  return (
    <header id="header">
      <div className="header-intro">
        <div className="header-overlay">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 header-intro-text">
                <h1>
                  Welcome Conference Room Booking
                  <span></span>
                </h1>
                <p>Manage And Book Your Rooms.</p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
