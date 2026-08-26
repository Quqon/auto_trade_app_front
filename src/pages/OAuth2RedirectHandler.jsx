import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/app', { replace: true });
    } else {
      alert('로그인에 실패했습니다.');
      navigate('/auth', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px' }}>
      <Loader2 className="spinner" size={40} color="var(--accent)" />
      <p style={{ color: 'var(--text-secondary)' }}>소셜 로그인 처리 중입니다...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
