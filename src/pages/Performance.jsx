import React from 'react';
import { ArrowLeft, Download, Info } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import PerformanceChart from '../components/PerformanceChart';
import { useAuth } from '../contexts/AuthContext';

const Performance = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null; // 로딩 중에는 아무것도 렌더링하지 않음

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>상세 성과 분석</h1>
        </div>
        <button style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
          <Download size={16} /> 리포트
        </button>
      </header>

      <section>
        <PerformanceChart />
      </section>

      <section style={{ display: 'flex', gap: '12px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>최대 낙폭 (MDD)</span>
            <Info size={14} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--danger)' }}>-4.2%</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>승률 (Win Rate)</span>
            <Info size={14} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>68.5%</span>
        </div>
      </section>

      <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>최근 주요 거래 내역</h3>
          <span 
            onClick={() => navigate('/app/history')}
            style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            더보기
          </span>
        </div>
        {[
          { name: '삼성전자', type: '매수', price: 75000, date: '08. 24 10:30' },
          { name: 'SK하이닉스', type: '매도', price: 152000, date: '08. 23 14:15', profit: '+1.2%' },
          { name: 'NAVER', type: '매수', price: 191000, date: '08. 22 09:45' }
        ].map((trade, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: idx < 2 ? '1px solid var(--border-color)' : 'none' }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{trade.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{trade.date}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: trade.type === '매수' ? 'var(--danger)' : 'var(--accent)' }}>
                {trade.type} {trade.price.toLocaleString()}원
              </p>
              {trade.profit && <p style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>{trade.profit}</p>}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Performance;
