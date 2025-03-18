// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Optional: For styling the footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              We provide the best rooms for your needs. Quality and comfort guaranteed.
            </p>
          </div>

          {/* Contact Section */}
          <div className="col-md-4">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li>Email: clerk@gmail.com</li>
              <li>Phone: 012000</li>
              <li>Country: South Africa</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="social-links list-unstyled">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12 text-center">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
