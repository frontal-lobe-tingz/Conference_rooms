import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddRoom from './components/AddRoom';
import { ViewRooms } from './components/ViewRooms';
import Homescreen from './components/Homescreen';
import RoomDetails from './components/RoomDetails';
import ViewAllBookings from './components/ViewallBookings';
import Login from './components/Login';
import Register from './components/Register';
import Clerkviewbookings from './components/Clerkviewbookings';
import CartScreen from './components/CartScreen';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ProfileUpdate from './components/ProfileUpdate';
// Import Consumable Item Components
import ConsumableItemsList from './components/ConsumableItemsList';
import AddConsumableItem from './components/AddConsumableItem';
import UpdateConsumableItem from './components/UpdateConsumableItem';
import ConsumableItemDetails from './components/ConsumableItemDetails';
import Reports from './components/Reports';
import AdminDashboard from './components/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import UpdateRoomModal from './components/UpdateRoomModal';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Homescreen />} />
          <Route path="/addroom" element={<AddRoom />} />
          <Route path="/viewrooms" element={<ViewRooms />} />
          <Route path="/room/:roomId" element={<RoomDetails />} />
          <Route path="/view-all-bookings" element={<ViewAllBookings />} />
          <Route path="/view-bookings" element={<Clerkviewbookings />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/profile" element={<ProfileUpdate />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Consumable Item Routes */}
          <Route path="/consumable-items" element={<ConsumableItemsList />} />
          <Route path="/consumable-items/add" element={<AddConsumableItem />} />
          <Route path="/consumable-items/update/:id" element={<UpdateConsumableItem />} />
          <Route path="/consumable-items/:id" element={<ConsumableItemDetails />} />
          
          {/* Admin Dashboard Route */}
          <Route path="/admin-dashboard*" element={<AdminDashboard />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
