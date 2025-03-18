import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function FilterForm() {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [capacity, setCapacity] = useState('');
  const [amenities, setAmenities] = useState([]);

  const availableAmenities = ['Projector', 'Whiteboard', 'Video Conference', 'Air Conditioning'];

  const handleAmenityChange = (e) => {
    const { value } = e.target;
    if (amenities.includes(value)) {
      setAmenities(amenities.filter((amenity) => amenity !== value));
    } else {
      setAmenities([...amenities, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      checkInDate,
      checkOutDate,
      capacity,
      amenities
    };
    console.log('Applied Filters: ', filters);
    // Logic to apply filters to your room booking system
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      {/* Date Pickers for Check-in and Check-out */}
      <div className="form-group">
        <label>Check-In Date</label>
        <DatePicker
          selected={checkInDate}
          onChange={(date) => setCheckInDate(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Check-Out Date</label>
        <DatePicker
          selected={checkOutDate}
          onChange={(date) => setCheckOutDate(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control"
        />
      </div>

      {/* Capacity Input */}
      <div className="form-group">
        <label>Capacity</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Enter room capacity"
          className="form-control"
        />
      </div>

      {/* Amenities Checkboxes */}
      <div className="form-group">
        <label>Amenities</label>
        {availableAmenities.map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              value={amenity}
              checked={amenities.includes(amenity)}
              onChange={handleAmenityChange}
            />
            <label>{amenity}</label>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary">
        Apply Filters
      </button>
    </form>
  );
}

export default FilterForm;
