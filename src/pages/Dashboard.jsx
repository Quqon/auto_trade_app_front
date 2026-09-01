import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, ChevronRight, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
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

  const navigate = useNavigate();

  // 미니 차트용 더미 데이터
  const miniChartData = [
    { value: 100 }, { value: 102 }, { value: 101 }, { value: 105 }, 
    { value: 104 }, { value: 108 }, { value: 107 }, { value: 112 }
  ];

  // 비로그인 시 보여줄 전략별 수익률 더미 데이터
  const strategyData = [
    { name: '모멘텀 돌파', return: 15.4 },
    { name: '초단타(스캘핑)', return: 18.7 },
    { name: '스윙 트레이딩', return: 12.1 },
    { name: '가치 투자', return: 8.2 },
    { name: '배당주 모으기', return: 5.5 }
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

      {user ? (
        <>
          {/* Account Balance Card */}
          <section 
            className="glass-panel hover-scale" 
            onClick={() => navigate('/app/balance')}
            style={{ padding: '28px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
          >
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
            
            <div 
              className="glass-panel hover-scale" 
              onClick={() => navigate('/app/trade')}
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Zap size={24} fill="currentColor" opacity={0.2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: '600' }}>모멘텀 돌파 전략</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>마지막 실행: 3분 전</p>
              </div>
            </div>
          </section>

          {/* Performance Mini Chart Preview */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>수익률 추이</h3>
            </div>
            
            <div 
              className="glass-panel hover-scale" 
              onClick={() => navigate('/app/performance')}
              style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>주간 누적 수익률</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>+12.0%</p>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '6px', borderRadius: '50%' }}>
                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              </div>
              
              <div style={{ width: '100%', height: '80px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="miniColorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#miniColorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Holdings List */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>내 보유 종목</h3>
              <span 
                onClick={() => navigate('/app/balance')}
                style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                전체 보기 <ChevronRight size={14} style={{ marginLeft: '2px' }} />
              </span>
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
        </>
      ) : (
        /* 비로그인 유저 화면 */
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={20} color="var(--accent)" />
              매매전략별 평균 수익률
            </h3>
          </div>
          
          <div className="glass-panel" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                현재 다른 사용자들은 이런 전략으로<br />
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>안정적인 수익</span>을 내고 있어요!
              </p>
            </div>
            
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                  <XAxis 
                    type="number" 
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    tickFormatter={(val) => `${val}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{
                            background: 'rgba(30, 30, 30, 0.9)', border: '1px solid var(--border-color)',
                            padding: '10px 12px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{payload[0].payload.name}</p>
                            <p style={{ color: 'var(--accent)', fontSize: '15px', fontWeight: 'bold' }}>+{payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                  <Bar 
                    dataKey="return" 
                    fill="var(--accent)" 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <button 
              onClick={() => navigate('/auth')}
              style={{
                marginTop: '12px', padding: '14px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff',
                fontWeight: '600', fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
              }}
            >
              로그인하고 내 전략 만들기
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
