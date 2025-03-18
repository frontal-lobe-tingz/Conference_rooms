// src/components/RoomCarousel.js
import React from 'react';
import Slider from 'react-slick';
import RoomCard from './RoomCard';  // Only RoomCard component
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from './RoomCarousel.module.css';  // Import CSS Module

function RoomCarousel({ rooms }) {
  const filteredRooms = rooms.filter(room => room.booked);
  console.log('Filtered Rooms for Carousel:', filteredRooms); // Debugging

  const settings = {
    dots: true,
    infinite: filteredRooms.length > 3, // Infinite scroll only if more slides are present
    speed: 500,
    slidesToShow: Math.min(3, filteredRooms.length),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, filteredRooms.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(1, filteredRooms.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Currently Booked & Scheduled Rooms</h2>
      <Slider {...settings}>
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </Slider>
    </div>
  );
}

export default RoomCarousel;
