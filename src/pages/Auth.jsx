import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', password: '' });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await axios.post('/api/auth/login', formData);
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/');
      } else {
        await axios.post('/api/auth/signup', formData);
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        setIsLogin(true);
        setFormData({ username: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data || '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100%',
      padding: '0 20px',
      gap: '32px'
    }}>
      <header style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '1px solid var(--border-color)'
        }}>
          <User size={32} color="var(--accent)" />
        </div>
        <h1 className="text-gradient" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
          {isLogin ? '다시 오셨군요!' : '계정 만들기'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          {isLogin ? '자동매매 시스템에 로그인하여 수익을 확인하세요.' : '가입하고 자동매매 서비스를 시작해보세요.'}
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: '12px', padding: '4px' }}>
          <button
            onClick={() => !isLogin && handleToggle()}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: '8px',
              border: 'none',
              background: isLogin ? 'var(--bg-surface-elevated)' : 'transparent',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isLogin ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLogin ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            로그인
          </button>
          <button
            onClick={() => isLogin && handleToggle()}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: '8px',
              border: 'none',
              background: !isLogin ? 'var(--bg-surface-elevated)' : 'transparent',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: !isLogin ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: !isLogin ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              아이디
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
                className="auth-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
                className="auth-input"
              />
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', marginTop: '-8px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn hover-scale"
            style={{
              marginTop: '12px',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
          >
            {loading ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                {isLogin ? '로그인' : '회원가입'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
