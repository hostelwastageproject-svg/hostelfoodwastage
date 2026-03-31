import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import Students from './pages/Students';
import Bookings from './pages/Bookings';
import MenuUpload from './pages/MenuUpload';
import Notices from './pages/Notices';
import Complaints from './pages/Complaints';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="menu" element={<MenuUpload />} />
          <Route path="notices" element={<Notices />} />
          <Route path="complaints" element={<Complaints />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
