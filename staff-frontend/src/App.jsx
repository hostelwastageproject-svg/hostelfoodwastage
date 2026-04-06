import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StaffLayout from './components/StaffLayout';
import StaffDashboard from './pages/StaffDashboard';
import Scanner from './pages/Scanner';
import MenuUpload from './pages/MenuUpload';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="menu" element={<MenuUpload />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
