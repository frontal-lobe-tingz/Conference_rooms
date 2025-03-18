function Room({ room, onView, selected, onSelect }) {
  const imageSrc = room.imageurl.includes('http') ? room.imageurl : `/src/images/${room.imageurl}`;

  // Ensure amenities is an array; if not, convert or provide a fallback
  const amenitiesList = Array.isArray(room.amenities) ? room.amenities : (room.amenities ? room.amenities.split(',') : []);

  return (
    <div className={`room-card ${selected ? 'selected' : ''}`} onClick={() => onSelect && onSelect(room.id)}>
      <img 
        src={imageSrc} 
        alt={room.name} 
        className="smallimg" 
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <h2>{room.name}</h2>
      <button className="btn btn-primary" onClick={onView}>View Details</button>
    </div>
  );
}

export default Room;
