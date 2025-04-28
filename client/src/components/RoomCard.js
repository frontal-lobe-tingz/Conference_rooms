// src/components/RoomCard.js
import React from 'react';
import styles from './RoomCard.module.css'; // Import CSS Module

function RoomCard({ room }) {
  console.log('Rendering RoomCard:', room); // Debugging
  return (
    <div className={styles.container}>
      <img 
        src={room.imageurl || `${process.env.REACT_APP_API_URL}/uploads/default-image.jpg`} 
        alt={room.name} 
        className={styles.image}
      />
      <h3 className={styles.title}>{room.name}</h3>
      <p className={styles.text}>Capacity: {room.capacity}</p>
      <p className={styles.text}>Amenities: {room.amenities.join(', ')}</p>
      <p className={styles.dates}>Start: {new Date(room.startTime).toLocaleString()}</p>
      <p className={styles.dates}>End: {new Date(room.endTime).toLocaleString()}</p>
      <button className={styles.button} onClick={() => window.location.href=`/room/${room.id}`}>View Details</button>
    </div>
  );
}

export default RoomCard;
