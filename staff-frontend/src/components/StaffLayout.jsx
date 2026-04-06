import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ChefHat, LayoutDashboard, ScanLine, FileText } from 'lucide-react';

const StaffLayout = () => {
  const menuItems = [
    { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/scanner', label: 'ID Scanner', icon: <ScanLine size={20} /> },
    { path: '/menu', label: 'Menu Upload', icon: <FileText size={20} /> },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ChefHat size={32} color="var(--brand-secondary)" />
          Staff Portal
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        <header className="top-bar">
          <h2 style={{ opacity: 0 }}>Dashboard</h2> {/* Spacer or future breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Kitchen Manager</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Staff Member</div>
            </div>
            <div style={{ 
              width: 40, height: 40, borderRadius: '50%', 
              background: 'var(--brand-gradient)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '16px', boxShadow: 'var(--shadow-sm)'
            }}>
              KM
            </div>
          </div>
        </header>
        
        {/* Render child routes */}
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
