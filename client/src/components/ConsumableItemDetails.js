
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

function ConsumableItemDetails() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsumableItem();
  }, []);

  const fetchConsumableItem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/consumable-items/${id}`);
      setItem(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch item');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Consumable Item Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : item ? (
        <div>
          <p><strong>Item ID:</strong> {item.itemId}</p>
          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Current Stock Level:</strong> {item.currentStockLevel}</p>
          <p><strong>Reorder Level:</strong> {item.reorderLevel}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/consumable-items')}>Back to List</button>
        </div>
      ) : null}
    </div>
  );
}

export default ConsumableItemDetails;
