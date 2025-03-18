// src/components/Reports.js

import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import './Reports.css'; // Import scoped CSS

function Reports({
  data,
  userBookingData,
  popularTimesData,
  roomAvailability,
  roomUsageStatistics,
}) {
  // Define color schemes for bars
  const userColorScheme = ['#6a994e', '#f4a261', '#e76f51', '#2a9d8f', '#e9c46a'];
  const timeColorScheme = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Prepare room usage data for the bar chart
  const roomUsageData = roomUsageStatistics.map(room => ({
    room: room.name,
    totalBookings: room.totalBookings,
    totalHoursBooked: room.totalHoursBooked,
  }));

  // Prepare room availability data
  const availableRooms = roomAvailability.filter(room => room.bookings.length === 0);
  const unavailableRooms = roomAvailability.filter(room => room.bookings.length > 0);

  return (
    <div className="reports__container">
      <h2 className="reports__main-title">Room Booking Analytics</h2>

      {/* Pie Chart Section */}
      <div className="reports__chart-section">
        <h3 className="reports__chart-title">Popular Rooms</h3>
        <div className="reports__chart">
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'category10' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextColor="#333333"
            radialLabelsLinkColor={{ from: 'color' }}
            sliceLabelsSkipAngle={10}
            sliceLabelsTextColor="#333333"
            // Manually calculate the label to avoid NaN issues
            label={({ id, value }) =>
              `${id}: ${((value / totalValue) * 100).toFixed(2)}%`
            }
            tooltip={({ datum: { id, value, color } }) => (
              <div
                style={{ padding: '12px', background: '#fff', border: `1px solid ${color}` }}
              >
                <strong style={{ color }}>{id}</strong>
                <br />
                Bookings: {value}
                <br />
                Percentage: {((value / totalValue) * 100).toFixed(2)}%
              </div>
            )}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      {/* Users' Booking Counts Bar Chart */}
      {userBookingData && userBookingData.length > 0 && (
        <div className="reports__chart-section">
          <h3 className="reports__chart-title">Users' Finalized Bookings</h3>
          <div className="reports__chart">
            <ResponsiveBar
              data={userBookingData}
              keys={['bookings']}
              indexBy="user"
              margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={bar => userColorScheme[bar.index % userColorScheme.length]} // Assign colors based on index
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'User',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Bookings',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              tooltip={({ id, value, color }) => (
                <div
                  style={{
                    padding: '12px',
                    background: '#fff',
                    border: `1px solid ${color}`,
                    borderRadius: '4px',
                  }}
                >
                  <strong style={{ color }}>{id}</strong>
                  <br />
                  Bookings: {value}
                </div>
              )}
            />
          </div>
        </div>
      )}

      {/* Popular Booking Times Bar Chart */}
      {popularTimesData && popularTimesData.length > 0 && (
        <div className="reports__chart-section">
          <h3 className="reports__chart-title">Popular Booking Times</h3>
          <div className="reports__chart">
            <ResponsiveBar
              data={popularTimesData}
              keys={['bookings']}
              indexBy="time"
              margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
              padding={0.3}
              colors={bar => timeColorScheme[bar.index % timeColorScheme.length]} // Assign colors based on index
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Time',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Bookings',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              tooltip={({ indexValue, value, color }) => (
                <div
                  style={{
                    padding: '12px',
                    background: '#fff',
                    border: `1px solid ${color}`,
                    borderRadius: '4px',
                  }}
                >
                  <strong style={{ color }}>{indexValue}</strong>
                  <br />
                  Bookings: {value}
                </div>
              )}
            />
          </div>
        </div>
      )}

      {/* Room Usage Statistics Bar Chart */}
      {roomUsageData && roomUsageData.length > 0 && (
        <div className="reports__chart-section">
          <h3 className="reports__chart-title">Room Usage Statistics</h3>
          <div className="reports__chart">
            <ResponsiveBar
              data={roomUsageData}
              keys={['totalBookings', 'totalHoursBooked']}
              indexBy="room"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              groupMode="grouped"
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Room',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              tooltip={({ id, value, color }) => (
                <div
                  style={{
                    padding: '12px',
                    background: '#fff',
                    border: `1px solid ${color}`,
                    borderRadius: '4px',
                  }}
                >
                  <strong style={{ color }}>{id}</strong>
                  <br />
                  Value: {value}
                </div>
              )}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* Room Availability Section */}
      <div className="reports__chart-section">
      
    

        <h4>Unavailable Rooms</h4>
        {unavailableRooms.length > 0 ? (
          <table className="reports__table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Capacity</th>
                <th>Amenities</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {unavailableRooms.map(room => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}</td>
                  <td>
                    {room.bookings.map(booking => (
                      <div key={booking.id}>
                        {booking.fromDate} to {booking.toDate} ({booking.startTime} - {booking.endTime})
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>All rooms are available.</p>
        )}
      </div>
    </div>
  );
}

export default Reports;
