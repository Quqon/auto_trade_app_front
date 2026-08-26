import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, LineChart, Search, UserCircle } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/app', icon: Home, label: '홈' },
    { path: '/app/trade', icon: LineChart, label: '자동매매' },
    { path: '/app/search', icon: Search, label: '검색' },
  ];

  const handleMyPage = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/app/mypage');
    } else {
      navigate('/auth');
    }
  };

  const isMyPageActive = location.pathname === '/app/mypage';

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
            end={item.path === '/app'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={22} strokeWidth={2.5} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* 마이페이지 - 로그인 여부 확인 후 분기 */}
        <button
          id="nav-mypage"
          onClick={handleMyPage}
          className={`nav-item ${isMyPageActive ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <UserCircle size={22} strokeWidth={2.5} />
          <span>마이페이지</span>
        </button>
      </nav>
    </>
  );
};

export default Layout;
