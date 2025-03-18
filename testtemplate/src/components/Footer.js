import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p>© {new Date().getFullYear()} Conference Rooms. All rights reserved.</p>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <a href="/terms" style={styles.link}>Terms of Service</a>
          </li>
          <li style={styles.navItem}>
            <a href="/privacy" style={styles.link}>Privacy Policy</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

// Basic styles for the Footer
const styles = {
  footer: {
    backgroundColor: '#0044cc',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0
  },
  navItem: {
    fontSize: '1rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  }
};

export default Footer;
