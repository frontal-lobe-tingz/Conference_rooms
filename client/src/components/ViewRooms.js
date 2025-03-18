import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import UpdateRoomModal from './UpdateRoomModal'; // Import the modal component
import { motion } from 'framer-motion';
import '../ViewRooms.css'; // Import the CSS for styling

export function ViewRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null); // State to manage the selected room for update
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  // Fetch all rooms from the API
  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms/getallrooms');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  // Delete room
  const deleteRoom = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/rooms/deleteroom/${id}`);
      Swal.fire('Success', response.data.message, 'success');
      setRooms(rooms.filter(room => room.id !== id)); // Remove the deleted room from state
    } catch (error) {
      Swal.fire('Error', 'Failed to delete room', 'error');
      console.error(error);
    }
  };

  // Open modal for updating room
  const updateRoom = (room) => {
    console.log('Update button clicked for room:', room);
    setSelectedRoom(room); // Set the selected room for editing
    setShowModal(true);    // Show the modal
  };

  // Refresh rooms after an update
  const refreshRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms/getallrooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms', error);
    }
  };

  return (
    <motion.div
      className="view-rooms-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>View Rooms</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <motion.table
          className="table table-striped"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Description</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <motion.tr
                key={room.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 150 }}
              >
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>{room.description}</td>
                <td>{room.amenities}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => updateRoom(room)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteRoom(room.id)}>
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}

      {/* Show update modal when a room is selected */}
      {showModal && selectedRoom && (
  console.log('Rendering UpdateRoomModal'),
  <UpdateRoomModal
    room={selectedRoom}
    onClose={() => setShowModal(false)}
    onUpdate={refreshRooms}
  />
)}
    </motion.div>
  );
}

export default ViewRooms