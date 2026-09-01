import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Phone, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 아이콘이 있는 입력 필드 공통 컴포넌트
const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, onClick, placeholder, required }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <Icon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onClick={onClick}
        placeholder={placeholder}
        required={required}
        className="auth-input"
      />
    </div>
  </div>
);

const INITIAL_SIGNUP = {
  username: '',
  password: '',
  passwordConfirm: '',
  name: '',
  email: '',
  phoneNumber: '',
  birthDate: '',
  gender: '',
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState(INITIAL_SIGNUP);
  const [forgotData, setForgotData] = useState({ username: '', email: '', newPassword: '', newPasswordConfirm: '' });
  const [isForgotPw, setIsForgotPw] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, checkAuth } = useAuth();

  const passwordMismatch = !isLogin && signupData.passwordConfirm && signupData.password !== signupData.passwordConfirm;

  const handleToggle = (toLogin) => {
    setIsLogin(toLogin);
    setIsForgotPw(false);
    setForgotStep(1);
    setForgotData({ username: '', email: '', newPassword: '', newPasswordConfirm: '' });
    setError('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && signupData.password !== signupData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isLogin && !signupData.gender) {
      setError('성별을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(loginData);
        navigate('/app');
      } else {
        const { passwordConfirm, ...payload } = signupData;
        await axios.post('/api/auth/signup', payload);
        await checkAuth();
        alert('회원가입이 완료되어 자동 로그인되었습니다.');
        navigate('/app');
      }
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : (errorData?.message || '오류가 발생했습니다. 다시 시도해주세요.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (forgotStep === 1) {
      if (!forgotData.username || !forgotData.email) {
        setError('아이디와 이메일을 입력해주세요.');
        return;
      }
      setForgotStep(2);
      return;
    }

    if (forgotStep === 2) {
      if (forgotData.newPassword !== forgotData.newPasswordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      setLoading(true);
      try {
        await axios.post('/api/auth/forgot-password', {
          username: forgotData.username,
          email: forgotData.email,
          newPassword: forgotData.newPassword
        });
        alert('비밀번호가 성공적으로 변경되었습니다. 로그인해주세요.');
        setIsForgotPw(false);
        setForgotStep(1);
        setForgotData({ username: '', email: '', newPassword: '', newPasswordConfirm: '' });
      } catch (err) {
        const errorData = err.response?.data;
        const errorMessage = typeof errorData === 'string' 
          ? errorData 
          : (errorData?.message || '오류가 발생했습니다. 다시 시도해주세요.');
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '28px 20px 40px' }}>
      {/* 헤더 */}
      <header style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(96,165,250,0.2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', border: '1px solid var(--border-color)'
        }}>
          <User size={28} color="var(--accent)" />
        </div>
        <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>
          {isLogin ? '다시 오셨군요!' : '계정 만들기'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {isLogin ? '로그인하여 자동매매 현황을 확인하세요.' : '기본 정보를 입력하고 서비스를 시작하세요.'}
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 탭 토글 */}
        <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: '12px', padding: '4px' }}>
          {[{ label: '로그인', value: true }, { label: '회원가입', value: false }].map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleToggle(value)}
              style={{
                flex: 1, padding: '11px 0', borderRadius: '8px', border: 'none',
                background: isLogin === value ? 'var(--bg-surface-elevated)' : 'transparent',
                color: isLogin === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isLogin === value ? '600' : '500',
                cursor: 'pointer', transition: 'all 0.25s ease',
                boxShadow: isLogin === value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* ── 로그인 폼 ── */}
          {isLogin && !isForgotPw && (
            <>
              <InputField label="아이디" icon={User} name="username" value={loginData.username} onChange={handleLoginChange} placeholder="아이디 입력" required />
              <InputField label="비밀번호" icon={Lock} type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="비밀번호 입력" required />
              {/* 비밀번호 찾기 링크 */}
              <button
                type="button"
                onClick={() => { setIsForgotPw(true); setForgotStep(1); setError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'right', padding: 0, alignSelf: 'flex-end', textDecoration: 'underline' }}
              >
                비밀번호를 잊으셨나요?
              </button>
            </>
          )}

          {/* ── 비밀번호 찾기 폼 ── */}
          {isLogin && isForgotPw && (
            <>
              <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {forgotStep === 1 ? '가입 시 등록한 아이디와 이메일을 입력해주세요.' : '새롭게 설정할 비밀번호를 입력해주세요.'}
                </p>
              </div>

              {forgotStep === 1 && (
                <>
                  <InputField label="아이디" icon={User} name="username" value={forgotData.username} onChange={(e) => setForgotData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder="아이디 입력" required />
                  <InputField label="이메일" icon={Mail} type="email" name="email" value={forgotData.email} onChange={(e) => setForgotData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder="가입 이메일 입력" required />
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <InputField label="새 비밀번호" icon={Lock} type="password" name="newPassword" value={forgotData.newPassword} onChange={(e) => setForgotData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder="새 비밀번호 입력" required />
                  <InputField label="새 비밀번호 확인" icon={Lock} type="password" name="newPasswordConfirm" value={forgotData.newPasswordConfirm} onChange={(e) => setForgotData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder="새 비밀번호 재입력" required />
                </>
              )}

              {error && (
                <div style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleForgotSubmit}
                disabled={loading}
                style={{ padding: '15px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.6 : 1, boxShadow: '0 8px 24px rgba(59,130,246,0.35)' }}
              >
                {loading ? <Loader2 className="spinner" size={20} /> : (forgotStep === 1 ? '다음 단계로' : '비밀번호 변경')}
              </button>
              <button
                type="button"
                onClick={() => { setIsForgotPw(false); setForgotStep(1); setError(''); setForgotData({ username: '', email: '', newPassword: '', newPasswordConfirm: '' }); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}
              >
                ← 로그인으로 돌아가기
              </button>
            </>
          )}

          {/* ── 회원가입 폼 ── */}
          {!isLogin && (
            <>
              {/* 구분선: 계정 정보 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>계정 정보</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>

              <InputField label="아이디" icon={User} name="username" value={signupData.username} onChange={handleSignupChange} placeholder="사용할 아이디 입력" required />

              <InputField label="비밀번호" icon={Lock} type="password" name="password" value={signupData.password} onChange={handleSignupChange} placeholder="비밀번호 입력" required />

              {/* 비밀번호 확인 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  비밀번호 확인
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={signupData.passwordConfirm}
                    onChange={handleSignupChange}
                    placeholder="비밀번호 재입력"
                    required
                    className="auth-input"
                    style={{ borderColor: passwordMismatch ? 'var(--danger)' : undefined }}
                  />
                </div>
                {passwordMismatch && (
                  <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px' }}>비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              {/* 구분선: 기본 정보 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>기본 정보</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>

              <InputField label="이름" icon={User} name="name" value={signupData.name} onChange={handleSignupChange} placeholder="실명 입력" required />
              <InputField label="이메일" icon={Mail} type="email" name="email" value={signupData.email} onChange={handleSignupChange} placeholder="example@email.com" required />
              <InputField label="전화번호" icon={Phone} type="tel" name="phoneNumber" value={signupData.phoneNumber} onChange={handleSignupChange} placeholder="010-0000-0000" required />
              <InputField 
                label="생년월일" 
                icon={Calendar} 
                type="date" 
                name="birthDate" 
                value={signupData.birthDate} 
                onChange={handleSignupChange} 
                onClick={(e) => {
                  // 브라우저에서 showPicker API를 지원하는 경우 달력(Date Picker)을 강제로 엽니다.
                  if (typeof e.target.showPicker === 'function') {
                    e.target.showPicker();
                  }
                }}
                required 
              />

              {/* 성별 선택 */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  성별
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[{ label: '남성', value: 'MALE' }, { label: '여성', value: 'FEMALE' }].map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSignupData((prev) => ({ ...prev, gender: value }))}
                      style={{
                        flex: 1, padding: '12px 0', borderRadius: '12px',
                        border: signupData.gender === value ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                        background: signupData.gender === value ? 'rgba(59,130,246,0.12)' : 'var(--bg-surface)',
                        color: signupData.gender === value ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: signupData.gender === value ? '600' : '400',
                        fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 에러 메시지 (로그인/회원가입 폼 용) */}
          {!isForgotPw && error && (
            <div style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {/* 제출 버튼 (비밀번호 찾기 모드 제외) */}
          {!isForgotPw && (
            <button
              type="submit"
              disabled={loading || passwordMismatch}
              style={{
                marginTop: '4px', padding: '16px', borderRadius: '16px', border: 'none',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff', fontWeight: '700', fontSize: '16px',
                cursor: loading || passwordMismatch ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading || passwordMismatch ? 0.6 : 1,
                boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
                transition: 'opacity 0.2s ease',
              }}
            >
              {loading
                ? <Loader2 className="spinner" size={20} />
                : <><span>{isLogin ? '로그인' : '가입 완료'}</span><ArrowRight size={18} /></>
              }
            </button>
          )}

          {/* ── 소셜 로그인 영역 ── */}
          {isLogin && !isForgotPw && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0 4px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>또는 소셜 로그인</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'}
                  style={{ padding: '14px', borderRadius: '12px', border: 'none', background: '#FEE500', color: '#000000', fontWeight: '600', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  카카오로 시작하기
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/naver'}
                  style={{ padding: '14px', borderRadius: '12px', border: 'none', background: '#03C75A', color: '#FFFFFF', fontWeight: '600', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  네이버로 시작하기
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                  style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Google로 시작하기
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
