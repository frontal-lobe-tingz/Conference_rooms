// src/components/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Reports from './Reports';
import AddRoom from './AddRoom';
import ViewRooms from './ViewRooms';
import ConsumableItemsList from './ConsumableItemsList';
import ViewAllBookings from './ViewallBookings';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [reportData, setReportData] = useState([]); // State for report data
  const [userBookingData, setUserBookingData] = useState([]); // State for users' booking counts
  const [popularTimesData, setPopularTimesData] = useState([]);
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [roomUsageStatistics, setRoomUsageStatistics] = useState([]);
  const [loading, setLoading] = useState({
    rooms: true,
    users: true,
    times: true,
    availability: true,
    usageStatistics: true,
  });
  const [error, setError] = useState({
    rooms: null,
    users: null,
    times: null,
    availability: null,
    usageStatistics: null,
  });

  // Define the date range for the whole year
  const currentYear = new Date().getFullYear();
  const fromDate = `${currentYear}-01-01`;
  const toDate = `${currentYear}-12-31`;

  useEffect(() => {
    const fetchRoomAvailability = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms/availability', {
          params: {
            fromDate,
            toDate,
          },
        });
        console.log('Fetched room availability:', response.data); // Debugging
        setRoomAvailability(response.data.rooms);
      } catch (err) {
        console.error('Error fetching room availability:', err);
        setError(prev => ({ ...prev, availability: 'Failed to load room availability' }));
      } finally {
        setLoading(prev => ({ ...prev, availability: false }));
      }
    };

    const fetchRoomUsageStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms/usageStatistics');
        console.log('Fetched room usage statistics:', response.data); // Debugging
        setRoomUsageStatistics(response.data.rooms);
      } catch (err) {
        console.error('Error fetching room usage statistics:', err);
        setError(prev => ({ ...prev, usageStatistics: 'Failed to load room usage statistics' }));
      } finally {
        setLoading(prev => ({ ...prev, usageStatistics: false }));
      }
    };

    const fetchUserBookingCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/userBookingCounts');
        const bookingData = response.data.users.map(user => ({
          user: user.user,
          bookings: user.bookingCount,
        }));
        setUserBookingData(bookingData);
      } catch (err) {
        console.error('Error fetching user booking counts:', err);
        setError(prev => ({ ...prev, users: 'Failed to load user booking counts' }));
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    const fetchPopularTimes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/popularTimes');
        setPopularTimesData(response.data.data);
      } catch (err) {
        console.error('Error fetching popular times:', err);
        setError(prev => ({ ...prev, times: 'Failed to load popular times' }));
      } finally {
        setLoading(prev => ({ ...prev, times: false }));
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms/popularRooms');
        setReportData(
          response.data.map(room => ({
            id: room.name,
            value: room.bookingCount || 0,
          }))
        );
      } catch (err) {
        console.error('Error fetching popular rooms:', err);
        setError(prev => ({ ...prev, rooms: 'Failed to load popular rooms' }));
      } finally {
        setLoading(prev => ({ ...prev, rooms: false }));
      }
    };

    fetchRoomAvailability();
    fetchRoomUsageStatistics();
    fetchUserBookingCounts();
    fetchPopularTimes();
    fetchRooms();
  }, []);

  return (
    <div className="admin-dashboard__container">
      <Sidebar />
      <div className="admin-dashboard__content">
        {Object.values(loading).some(isLoading => isLoading) ? (
          <div className="admin-dashboard__loading">Loading...</div>
        ) : (
          <>
            {Object.values(error).some(errMsg => errMsg) && (
              <div className="admin-dashboard__error">
                {Object.entries(error).map(
                  ([key, errMsg]) => errMsg && <p key={key}>{errMsg}</p>
                )}
              </div>
            )}
            <Routes>
              <Route
                path="reports"
                element={
                  <Reports
                    data={reportData}
                    userBookingData={userBookingData}
                    popularTimesData={popularTimesData}
                    roomAvailability={roomAvailability}
                    roomUsageStatistics={roomUsageStatistics}
                    fromDate={fromDate}
                    toDate={toDate}
                  />
                }
              />
              <Route path="add-room" element={<AddRoom />} />
              <Route path="view-rooms" element={<ViewRooms />} />
              <Route path="consumable-items" element={<ConsumableItemsList />} />
              <Route path="view-all-bookings" element={<ViewAllBookings />} />
              <Route
                path="*"
                element={
                  <Reports
                    data={reportData}
                    userBookingData={userBookingData}
                    popularTimesData={popularTimesData}
                    roomAvailability={roomAvailability}
                    roomUsageStatistics={roomUsageStatistics}
                    fromDate={fromDate}
                    toDate={toDate}
                  />
                }
              />
            </Routes>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
