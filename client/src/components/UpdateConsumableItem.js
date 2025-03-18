import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

function UpdateConsumableItem() {
  const [item, setItem] = useState({
    name: '',
    description: '',
    currentStockLevel: 0,
    reorderLevel: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Retrieve the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!currentUser) {
      alert('Please log in to access this page.');
      navigate('/'); // Redirect to login page
      return;
    }

    fetchConsumableItem();
  }, []);

  const fetchConsumableItem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consumable-items/${id}`, {
        headers: {
          'x-user-id': currentUser.id,
        },
      });
      setItem(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch item');
      setLoading(false);
      console.error('Error fetching consumable item:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setItem(prevItem => ({
      ...prevItem,
      [name]: name === 'currentStockLevel' || name === 'reorderLevel' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/consumable-items/update/${id}`, item, {
        headers: {
          'x-user-id': currentUser.id,
        },
      });
      alert('Consumable item updated successfully');
      navigate('/consumable-items');
    } catch (error) {
      setError('Failed to update item');
      console.error('Error updating consumable item:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Consumable Item</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
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
              value={item.description || ''}
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
              min="0"
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
              min="0"
            />
          </div>
          {/* Submit */}
          <button type="submit" className="btn btn-primary">Update Item</button>
        </form>
      )}
    </div>
  );
}

export default UpdateConsumableItem;
