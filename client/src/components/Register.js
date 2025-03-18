import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import Framer Motion
import '../Register.css'; // Import the CSS for styling

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        email, password, name, department, contactInfo
      });

      if (response.data.user) {
        console.log('Registered User:', response.data.user);  // Debug log
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/home");
      }
    } catch (err) {
      setError('Registration failed');
      console.error('Registration error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <motion.div
        className="register-card"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
      >
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="register-input"
          />
          <input
            type="text"
            placeholder="Contact Information"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p>Already have an account? <a href="/" className="login-link">Login here</a></p>
      </motion.div>
    </div>
  );
};

export default Register;
