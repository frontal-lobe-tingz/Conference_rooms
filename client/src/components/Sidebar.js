// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar__title">Admin Dashboard</h2>
      <nav className="sidebar__nav">
        <NavLink to="reports" className={({ isActive }) => (isActive ? 'sidebar__link active' : 'sidebar__link')}>
          Reports
        </NavLink>
        <NavLink to="add-room" className={({ isActive }) => (isActive ? 'sidebar__link active' : 'sidebar__link')}>
          Add Room
        </NavLink>
        <NavLink to="view-rooms" className={({ isActive }) => (isActive ? 'sidebar__link active' : 'sidebar__link')}>
          View Rooms
        </NavLink>
        
        <NavLink to="consumable-items" className={({ isActive }) => (isActive ? 'sidebar__link active' : 'sidebar__link')}>
          Consumable Items
        </NavLink>
        
      </nav>
    </div>
  );
}

export default Sidebar;
