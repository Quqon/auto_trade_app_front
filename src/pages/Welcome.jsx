import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, LogIn } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '0 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 장식 글로우 */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '120px',
        right: '-60px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 상단 영역: 로고 및 헤드라인 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>

        {/* 앱 아이콘 */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(59, 130, 246, 0.4)',
        }}>
          <TrendingUp size={40} color="#fff" strokeWidth={2} />
        </div>

        {/* 타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', color: 'var(--text-primary)' }}>
            나만의<br />
            <span className="text-gradient">자동매매</span><br />
            시스템
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>
            AI 기반 전략으로 시장을 분석하고<br />
            최적의 타이밍에 자동으로 거래합니다.
          </p>
        </div>

        {/* 수치 뱃지 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: '전략 유형', value: '3가지' },
            { label: '자동 실행', value: '24/7' },
            { label: '평균 수익', value: '+12%' },
          ].map((item) => (
            <div
              key={item.label}
              className="glass-panel"
              style={{ flex: 1, padding: '14px 10px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div style={{
        paddingBottom: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {/* 둘러보기 버튼 */}
        <button
          id="btn-guest"
          onClick={() => navigate('/app')}
          className="hover-scale"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowRight size={20} />
          로그인 없이 둘러보기
        </button>

        {/* 로그인/회원가입 버튼 */}
        <button
          id="btn-auth"
          onClick={() => navigate('/auth')}
          className="hover-scale"
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '18px',
            border: 'none',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          <LogIn size={20} />
          로그인 / 회원가입
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
          둘러보기 모드에서는 일부 기능이 제한될 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
