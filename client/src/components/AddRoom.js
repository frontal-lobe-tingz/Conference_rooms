import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import '../AddRoom.css'; // Import the CSS file for styling

function AddRoom() {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Predefined list of 10 amenities
  const availableAmenities = [
    "Wi-Fi", "Projector", "Whiteboard", "Video Conferencing", 
    "TeleVision", "Air-Conditioner", "Sound System", "Coffee Machine", 
    "Smartboard", "Conference Phone"
  ];

  // Handle amenities selection using checkboxes
  const handleAmenitiesChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  async function addRoom() {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('capacity', capacity);
    formData.append('description', description);
    
    // Don't stringify the array twice; send it directly
    formData.append('amenities', JSON.stringify(selectedAmenities)); 
    
    formData.append('image', image); // Append image file
    
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/rooms/addroom`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      Swal.fire('Success', 'Room added successfully!', 'success');
      setName('');
      setCapacity('');
      setDescription('');
      setSelectedAmenities([]);
      setImage(null);
    } catch (error) {
      setLoading(false);
      Swal.fire('Error', 'Failed to add room', 'error');
      console.error(error);
    }
  }
  
  
  return (
    <motion.div 
      className="add-room-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Checkboxes for amenities */}
      <div className="amenities-checkbox-group">
        <h4>Select Amenities:</h4>
        {availableAmenities.map((amenity) => (
          <div key={amenity} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={amenity}
              value={amenity}
              checked={selectedAmenities.includes(amenity)}
              onChange={() => handleAmenitiesChange(amenity)}
            />
            <label className="form-check-label" htmlFor={amenity}>
              {amenity}
            </label>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setImage(e.target.files[0])} // Capture the selected image file
        />
        <motion.button
          className="btn btn-primary"
          onClick={addRoom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Adding...' : 'Add Room'}
        </motion.button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
    </motion.div>
  );
}

export default AddRoom;
