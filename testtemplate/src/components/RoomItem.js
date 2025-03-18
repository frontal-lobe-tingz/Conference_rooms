import React from 'react';

function RoomItem({ room }) {
  return (
    <div className="col-md-6 col-lg-4" data-aos="fade-up">
      <a href="#" className="room">
        <figure className="img-wrap">
          <img 
            src={require(`../assets/images/${room.image}`)} 
            alt={room.title} 
            className="img-fluid mb-3" 
          />
        </figure>
        <div className="p-3 text-center room-info">
          <h2>{room.title}</h2>
          <span className="text-uppercase letter-spacing-1">${room.price} / per night</span>
        </div>
      </a>
    </div>
  );
}

export default RoomItem;
