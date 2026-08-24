import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap } from 'lucide-react';

const Dashboard = () => {
  // 샘플 데이터 상태
  const [balance, setBalance] = useState({
    total: 15420000,
    profit: 340000,
    profitRate: 2.25
  });

  const positions = [
    { id: 1, name: '삼성전자', code: '005930', qty: 50, avgPrice: 75000, currentPrice: 78000 },
    { id: 2, name: 'SK하이닉스', code: '000660', qty: 20, avgPrice: 150000, currentPrice: 148000 },
    { id: 3, name: 'NAVER', code: '035420', qty: 10, avgPrice: 195000, currentPrice: 188000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <header>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
          2026. 08. 24
        </p>
        <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: '700' }}>
          Overview
        </h1>
      </header>

      {/* Account Balance Card */}
      <section className="glass-panel" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
        {/* 장식용 글로우 효과 */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.25, borderRadius: '50%' }}></div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>총 자산 추정</p>
        <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.5px' }}>
          ₩ {balance.total.toLocaleString()}
        </h2>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: balance.profit >= 0 ? 'var(--success)' : 'var(--danger)', background: balance.profit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '12px' }}>
            {balance.profit >= 0 ? <TrendingUp size={18} strokeWidth={3} /> : <TrendingDown size={18} strokeWidth={3} />}
            <span style={{ fontWeight: '600', fontSize: '14px' }}>{balance.profit >= 0 ? '+' : ''}{balance.profit.toLocaleString()} ({balance.profitRate}%)</span>
          </div>
        </div>
      </section>

      {/* Auto Trading Status */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>스케줄러 상태</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
            <Activity size={14} />
            <span>Active</span>
          </div>
        </div>
        
        <div className="glass-panel hover-scale" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Zap size={24} fill="currentColor" opacity={0.2} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '15px', fontWeight: '600' }}>모멘텀 돌파 전략</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>마지막 실행: 3분 전</p>
          </div>
        </div>
      </section>

      {/* Holdings List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>내 보유 종목</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>전체 보기</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {positions.map(pos => {
            const profit = (pos.currentPrice - pos.avgPrice) * pos.qty;
            const profitRate = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
            const isProfit = profit >= 0;
            
            return (
              <div key={pos.id} className="glass-panel hover-scale" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{pos.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>{pos.code}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{pos.currentPrice.toLocaleString()}원</p>
                  <p style={{ fontSize: '13px', color: isProfit ? 'var(--success)' : 'var(--danger)', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontWeight: '500' }}>
                    {isProfit ? '+' : ''}{profitRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
