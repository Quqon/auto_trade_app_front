import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronRight, ShieldCheck, Bell, HelpCircle, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 className="spinner" size={24} color="var(--accent)" />
      </div>
    );
  }

  const menuItems = [
    { icon: User, label: '계정 정보', onClick: () => navigate('/app/account') },
    { icon: Bell, label: '알림 설정', onClick: () => {} },
    { icon: ShieldCheck, label: '보안 설정', onClick: () => {} },
    { icon: HelpCircle, label: '고객센터 / 도움말', onClick: () => {} },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 className="text-gradient" style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
          마이페이지
        </h1>
      </header>

      {/* 프로필 카드 */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(30,30,30,0.6))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 8px 20px rgba(59,130,246,0.35)',
        }}>
          <UserCircle size={36} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
          {user ? (
            <>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {user.name} 님
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {user.email || '자동매매 서비스 이용 중'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                게스트 모드
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                로그인하면 모든 기능을 이용할 수 있습니다.
              </div>
            </>
          )}
        </div>
      </div>

      {/* 로그인 안 된 경우 로그인 유도 버튼 */}
      {!user && (
        <button
          onClick={() => navigate('/auth')}
          className="hover-scale"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
          }}
        >
          로그인 / 회원가입
        </button>
      )}

      {/* 메뉴 목록 */}
      <div className="glass-panel" style={{ padding: '8px 0', overflow: 'hidden' }}>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              borderBottom: idx < menuItems.length - 1 ? '1px solid var(--border-color)' : 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <item.icon size={20} color="var(--text-secondary)" strokeWidth={2} />
            <span style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{item.label}</span>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
        ))}
      </div>

      {/* 로그아웃 버튼 (로그인 상태일 때만) */}
      {user && (
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="hover-scale"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.08)',
            color: 'var(--danger)',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut size={18} />
          로그아웃
        </button>
      )}
    </div>
  );
};

export default MyPage;
