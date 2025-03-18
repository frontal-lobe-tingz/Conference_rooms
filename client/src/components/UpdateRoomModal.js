import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../UpdateRoomModal.css'; // Ensure the CSS is imported

function UpdateRoomModal({ room, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: room.name,
    description: room.description,
    capacity: room.capacity,
    amenities: Array.isArray(room.amenities)
      ? room.amenities
      : room.amenities.split(','),
    imageurl: room.imageurl || '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle amenities change (comma-separated input)
  const handleAmenitiesChange = (e) => {
    const amenitiesArray = e.target.value
      .split(',')
      .map((amenity) => amenity.trim());
    setFormData({ ...formData, amenities: amenitiesArray });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/rooms/updateroom/${room.id}`,
        formData
      );
      Swal.fire('Success', response.data.message, 'success');
      onUpdate(); // Refresh the rooms list after the update
      onClose(); // Close the modal
    } catch (error) {
      Swal.fire('Error', 'Failed to update room', 'error');
      console.error('Error updating room:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Room</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          {/* Capacity Input */}
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          {/* Amenities Input */}
          <div className="form-group">
            <label>Amenities (Comma-separated)</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities.join(', ')}
              onChange={handleAmenitiesChange}
              className="form-control"
              required
            />
          </div>

          {/* Optional: Image URL Input */}
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="imageurl"
              value={formData.imageurl}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          {/* Buttons */}
          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRoomModal;
