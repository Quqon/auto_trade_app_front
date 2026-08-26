import React, { useState, useEffect } from 'react';
import { Lock, User, Mail, Phone, Calendar, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, required, readOnly }) => (
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
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className="auth-input"
        style={readOnly ? { background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)', cursor: 'not-allowed', opacity: 0.8 } : {}}
      />
    </div>
  </div>
);

const Account = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');
  const { user } = useAuth();
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/user/verify-password', { password: verifyPassword });
      
      // Verification success
      setIsVerified(true);
    } catch (err) {
      setError(err.response?.data || '비밀번호 확인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (pwdData.newPassword !== pwdData.newPasswordConfirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await axios.put('/api/user/password', {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });
      setSuccessMsg('비밀번호가 성공적으로 변경되었습니다.');
      setPwdData({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
    } catch (err) {
      setError(err.response?.data || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '28px 20px 40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>
          계정 정보
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {isVerified ? '내 정보를 확인하고 수정하세요.' : '안전한 사용을 위해 비밀번호를 다시 입력해주세요.'}
        </p>
      </header>

      {!isVerified ? (
        <div className="glass-panel" style={{ padding: '24px 20px' }}>
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InputField 
              label="현재 비밀번호" 
              icon={Lock} 
              type="password" 
              name="verifyPassword" 
              value={verifyPassword} 
              onChange={(e) => setVerifyPassword(e.target.value)} 
              placeholder="비밀번호 입력" 
              required 
            />
            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px', padding: '16px', borderRadius: '16px', border: 'none',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', fontWeight: '700', fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.6 : 1, boxShadow: '0 8px 24px rgba(59,130,246,0.35)'
              }}
            >
              {loading ? <Loader2 className="spinner" size={20} /> : <><span>확인</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>기본 정보</h3>
            <InputField label="아이디" icon={User} value={user?.username || ''} readOnly />
            <InputField label="이름" icon={User} value={user?.name || ''} readOnly />
            <InputField label="이메일" icon={Mail} value={user?.email || ''} readOnly />
            <InputField label="전화번호" icon={Phone} value={user?.phoneNumber || ''} readOnly />
            <InputField label="생년월일" icon={Calendar} value={user?.birthDate || ''} readOnly />
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>성별</label>
              <div style={{
                padding: '14px 14px 14px 46px', borderRadius: '14px', background: 'var(--bg-surface-elevated)',
                color: 'var(--text-muted)', fontSize: '14px', position: 'relative'
              }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                {user?.gender === 'MALE' ? '남성' : user?.gender === 'FEMALE' ? '여성' : '미설정'}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>비밀번호 변경</h3>
              <InputField label="현재 비밀번호" icon={Lock} type="password" name="currentPassword" value={pwdData.currentPassword} onChange={(e) => setPwdData(p => ({ ...p, [e.target.name]: e.target.value }))} required />
              <InputField label="새 비밀번호" icon={Lock} type="password" name="newPassword" value={pwdData.newPassword} onChange={(e) => setPwdData(p => ({ ...p, [e.target.name]: e.target.value }))} required />
              <InputField label="새 비밀번호 확인" icon={Lock} type="password" name="newPasswordConfirm" value={pwdData.newPasswordConfirm} onChange={(e) => setPwdData(p => ({ ...p, [e.target.name]: e.target.value }))} required />
              
              {error && (
                <div style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                  {error}
                </div>
              )}
              {successMsg && (
                <div style={{ color: 'var(--success)', fontSize: '13px', textAlign: 'center', padding: '8px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px' }}>
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || pwdData.newPassword !== pwdData.newPasswordConfirm}
                style={{
                  marginTop: '8px', padding: '16px', borderRadius: '16px', border: 'none',
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', fontWeight: '700', fontSize: '16px',
                  cursor: loading || pwdData.newPassword !== pwdData.newPasswordConfirm ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: loading || pwdData.newPassword !== pwdData.newPasswordConfirm ? 0.6 : 1, boxShadow: '0 8px 24px rgba(59,130,246,0.35)'
                }}
              >
                {loading ? <Loader2 className="spinner" size={20} /> : '비밀번호 변경'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
