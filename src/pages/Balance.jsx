import React, { useState } from 'react';
import { ArrowLeft, Wallet, PieChart as PieChartIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Balance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 더미 데이터
  const [balance] = useState({
    total: 15420000,
    cash: 3420000,
    invested: 12000000,
    profit: 340000,
    profitRate: 2.91
  });

  const positions = [
    { id: 1, name: '삼성전자', code: '005930', qty: 50, avgPrice: 75000, currentPrice: 78000, totalValue: 3900000 },
    { id: 2, name: 'SK하이닉스', code: '000660', qty: 20, avgPrice: 150000, currentPrice: 148000, totalValue: 2960000 },
    { id: 3, name: 'NAVER', code: '035420', qty: 10, avgPrice: 195000, currentPrice: 188000, totalValue: 1880000 },
    { id: 4, name: '현대차', code: '005380', qty: 15, avgPrice: 210000, currentPrice: 217000, totalValue: 3255000 },
  ];

  // PieChart 데이터 구성 (현금 + 각 주식 비중)
  const portfolioData = [
    { name: '예수금(현금)', value: balance.cash, color: 'rgba(255, 255, 255, 0.2)' },
    { name: '삼성전자', value: positions[0].totalValue, color: '#3b82f6' },
    { name: 'SK하이닉스', value: positions[1].totalValue, color: '#f59e0b' },
    { name: 'NAVER', value: positions[2].totalValue, color: '#10b981' },
    { name: '현대차', value: positions[3].totalValue, color: '#8b5cf6' },
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <Wallet size={48} color="var(--text-muted)" />
        <p style={{ color: 'var(--text-secondary)' }}>로그인 후 이용 가능합니다.</p>
        <button onClick={() => navigate('/auth')} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>내 계좌 잔고</h1>
      </header>

      {/* 자산 요약 요약 카드 */}
      <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(70px)', opacity: 0.15, borderRadius: '50%' }}></div>
        
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>총 자산 추정</p>
          <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            ₩ {balance.total.toLocaleString()}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>총 평가 수익</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: balance.profit >= 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {balance.profit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {balance.profit >= 0 ? '+' : ''}{balance.profit.toLocaleString()}원
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>수익률</p>
            <p style={{ fontSize: '16px', fontWeight: '600', color: balance.profitRate >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {balance.profitRate >= 0 ? '+' : ''}{balance.profitRate}%
            </p>
          </div>
        </div>
      </section>

      {/* 포트폴리오 비중 차트 */}
      <section>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChartIcon size={20} color="var(--accent)" />
          자산 비중
        </h3>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '140px', height: '140px', flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₩ ${value.toLocaleString()}`}
                  contentStyle={{ background: 'rgba(30,30,30,0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {portfolioData.slice(0, 4).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  {((item.value / balance.total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
              *기타 등 생략
            </div>
          </div>
        </div>
      </section>

      {/* 보유 종목 상세 */}
      <section>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          보유 종목 <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '400', marginLeft: '6px' }}>총 {positions.length}건</span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 현금(예수금) 항목 */}
          <div className="glass-panel hover-scale" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>예수금 (현금)</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>매매 대기 자금</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>{balance.cash.toLocaleString()}원</p>
            </div>
          </div>

          {/* 주식 리스트 */}
          {positions.map(pos => {
            const profit = (pos.currentPrice - pos.avgPrice) * pos.qty;
            const profitRate = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
            const isProfit = profit >= 0;
            
            return (
              <div key={pos.id} className="glass-panel hover-scale" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{pos.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {pos.qty}주 <span style={{ margin: '0 4px' }}>|</span> 평단 {pos.avgPrice.toLocaleString()}원
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{pos.totalValue.toLocaleString()}원</p>
                  <p style={{ fontSize: '13px', color: isProfit ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: '500' }}>
                    {isProfit ? '+' : ''}{profit.toLocaleString()}원 ({profitRate.toFixed(2)}%)
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

export default Balance;
