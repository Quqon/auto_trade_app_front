import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// 더미 데이터 생성
const generateData = (days, startVal, volatility) => {
  let data = [];
  let currentVal = startVal;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    currentVal = currentVal + (Math.random() - 0.5) * volatility;
    data.push({
      date: d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      value: Number(currentVal.toFixed(2))
    });
  }
  return data;
};

const mockData = {
  '1D': generateData(24, 100, 2), // 24 hours fake data
  '1W': generateData(7, 100, 5),
  '1M': generateData(30, 100, 4)
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isPositive = payload[0].value >= 100;
    return (
      <div style={{
        background: 'rgba(30, 30, 30, 0.9)',
        border: '1px solid var(--border-color)',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: isPositive ? 'var(--success)' : 'var(--danger)', fontSize: '16px', fontWeight: 'bold' }}>
          {payload[0].value.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = () => {
  const [period, setPeriod] = useState('1W');
  const data = mockData[period];
  
  // 현재 수익률 (시작점(100) 대비)
  const currentReturn = (data[data.length - 1].value - 100).toFixed(2);
  const isPositive = currentReturn >= 0;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 헤더 및 토글 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>수익률 추이</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
              {isPositive ? '+' : ''}{currentReturn}%
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: '12px' }}>
          {['1D', '1W', '1M'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: period === p ? 'var(--accent)' : 'transparent',
                color: period === p ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: period === p ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 차트 영역 */}
      <div style={{ width: '100%', height: '240px', marginTop: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text-secondary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
