import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, LineChart, Search, Settings } from 'lucide-react';

const Layout = () => {
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/trade', icon: LineChart, label: '자동매매' },
    { path: '/search', icon: Search, label: '검색' },
    { path: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <>
      <div className="content-area">
        <Outlet />
      </div>
      <nav className="bottom-nav glass-panel">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={22} strokeWidth={2.5} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Layout;
