import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddConsumableItem() {
  const [item, setItem] = useState({
    name: '',
    description: '',
    currentStockLevel: 0,
    reorderLevel: 0,
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Retrieve the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userRole = currentUser && currentUser.role;

  // Check if the user is a manager or clerk
  const canAdjustStock = userRole === 'manager' || userRole === 'clerk';

  useEffect(() => {
    // Redirect unauthorized users
    if (!canAdjustStock) {
      alert('Access denied');
      navigate('/consumable-items');
    }
  }, [canAdjustStock, navigate]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/consumable-items/add`,
        item,
        {
          headers: {
            'x-user-id': currentUser.id,
          },
        }
      );
      alert('Consumable item added successfully');
      navigate('/consumable-items');
    } catch (error) {
      setError('Failed to add item');
      console.error('Error adding consumable item:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Consumable Item</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={item.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={item.description}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* Current Stock Level */}
        <div className="form-group">
          <label>Current Stock Level</label>
          <input
            type="number"
            className="form-control"
            name="currentStockLevel"
            value={item.currentStockLevel}
            onChange={handleChange}
            required
          />
        </div>
        {/* Reorder Level */}
        <div className="form-group">
          <label>Reorder Level</label>
          <input
            type="number"
            className="form-control"
            name="reorderLevel"
            value={item.reorderLevel}
            onChange={handleChange}
            required
          />
        </div>
        {/* Submit */}
        <button type="submit" className="btn btn-primary">
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddConsumableItem;
