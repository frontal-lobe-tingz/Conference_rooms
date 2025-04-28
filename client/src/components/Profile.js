import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../Profile.css'; // Import the CSS for styling

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${storedUser._id}`);
          setUser(response.data);
          setName(response.data.name);
          setDepartment(response.data.department);
          setContactInfo(response.data.contactInfo);
        } catch (error) {
          console.error('Error fetching profile', error);
        }
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const updatedUser = { name, department, contactInfo };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${user._id}`, updatedUser);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Profile
      </motion.h2>
      
      <motion.div
        className="profile-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
        />
        <input
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="Contact Information"
        />
        <motion.button
          onClick={updateProfile}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="update-button"
        >
          Update Profile
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
