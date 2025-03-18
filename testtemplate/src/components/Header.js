import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <h1>Conference Rooms</h1>
      </div>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.link}>Home</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/about" style={styles.link}>About Us</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/rooms" style={styles.link}>Rooms</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/contact" style={styles.link}>Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// Basic styles for the Header
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#0044cc',
    color: 'white'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  navItem: {
    fontSize: '1.2rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  }
};

export default Header;
