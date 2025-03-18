import React from 'react';
import RoomItem from './RoomItem';

function RoomsSection() {
  const rooms = [
    {
      id: 1,
      title: 'Single Room',
      image: 'img_1.jpg',
      price: 90,
    },
    {
      id: 2,
      title: 'Double Room',
      image: 'img_2.jpg',
      price: 120,
    },
    {
      id: 3,
      title: 'Suite',
      image: 'img_3.jpg',
      price: 200,
    },
    // Add more rooms as needed
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          {rooms.map((room) => (
            <RoomItem key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoomsSection;
