// src/components/ConsumableItemsList.js

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ConsumableItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // You can use this to show a loader
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Retrieve the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userRole = currentUser && currentUser.role;

  // Check if the user is a manager or clerk
  const canAdjustStock = userRole === 'manager' || userRole === 'clerk';

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!currentUser) {
      alert('Please log in to access this page.');
      navigate('/'); // Redirect to login page
      return;
    }

    fetchConsumableItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConsumableItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/consumable-items/getall`, {
        headers: {
          // Include user ID or token if needed for backend authentication
          'x-user-id': currentUser.id,
        },
      });
      setItems(response.data.data); // Corrected Line
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch consumable items');
      setLoading(false);
      console.error('Error fetching consumable items:', error);
    }
  };

  const handleIncreaseStock = async (id) => {
    const quantity = parseInt(prompt('Enter quantity to increase:'));
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/consumable-items/updatestock/${id}`,
        { quantity },
        {
          headers: {
            'x-user-id': currentUser.id,
          },
        }
      );
      fetchConsumableItems(); // Refresh the list
    } catch (error) {
      alert('Failed to update stock level');
      console.error('Error updating stock level:', error);
    }
  };

  const handleDecreaseStock = async (id) => {
    const quantity = parseInt(prompt('Enter quantity to decrease:'));
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/consumable-items/updatestock/${id}`,
        { quantity: -quantity },
        {
          headers: {
            'x-user-id': currentUser.id,
          },
        }
      );
      fetchConsumableItems(); // Refresh the list
    } catch (error) {
      alert('Failed to update stock level');
      console.error('Error updating stock level:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/consumable-items/delete/${id}`, {
          headers: {
            'x-user-id': currentUser.id,
          },
        });
        fetchConsumableItems(); // Refresh the list
      } catch (error) {
        alert('Failed to delete item');
        console.error('Error deleting consumable item:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Consumable Items</h2>
      {/* Only managers and clerks can add new items */}
      {canAdjustStock && (
        <Link to="/consumable-items/add" className="btn btn-primary mb-3">
          Add New Item
        </Link>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : items.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Current Stock Level</th>
              <th>Reorder Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.itemId}
                className={item.currentStockLevel <= item.reorderLevel ? 'table-danger' : ''}
              >
                <td>{item.itemId}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.currentStockLevel}</td>
                <td>{item.reorderLevel}</td>
                <td>
                  {canAdjustStock && (
                    <>
                      <button
                        className="btn btn-sm btn-success mr-2"
                        onClick={() => handleIncreaseStock(item.itemId)}
                      >
                        Increase Stock
                      </button>
                      <button
                        className="btn btn-sm btn-warning mr-2"
                        onClick={() => handleDecreaseStock(item.itemId)}
                      >
                        Decrease Stock
                      </button>
                      <Link
                        to={`/consumable-items/update/${item.itemId}`}
                        className="btn btn-sm btn-info mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.itemId)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {/* Non-privileged users can only view details */}
                  {!canAdjustStock && (
                    <Link
                      to={`/consumable-items/${item.itemId}`}
                      className="btn btn-sm btn-secondary"
                    >
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No consumable items found.</p>
      )}
    </div>
  );
}

export default ConsumableItemsList;
