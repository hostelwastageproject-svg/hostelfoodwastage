import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  FileText, 
  Bell, 
  MessageSquareWarning, 
  LogOut,
  Utensils
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <UtensilsCrossed size={20} /> },
    { name: 'Menu Upload', path: '/menu', icon: <FileText size={20} /> },
    { name: 'Notices', path: '/notices', icon: <Bell size={20} /> },
    { name: 'Complaints', path: '/complaints', icon: <MessageSquareWarning size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Utensils size={28} />
          <span>Hostel Food</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
          
          <div style={{ marginTop: 'auto' }}>
            <button className="nav-item" style={{ width: '100%', background: 'transparent' }} onClick={handleLogout}>
              <LogOut size={20} color="var(--danger)" />
              <span style={{ color: 'var(--danger)' }}>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="main-content">
        <header className="top-header">
          <h2 style={{ fontSize: '18px', margin: 0 }}>Admin Portal</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Admin</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hostel Manager</div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content embedded here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
