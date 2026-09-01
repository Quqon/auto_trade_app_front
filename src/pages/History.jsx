import React, { useState } from 'react';
import { ArrowLeft, History as HistoryIcon, Download, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState('ALL'); // ALL, BUY, SELL

  // 거래 내역 더미 데이터
  const tradeHistory = [
    { id: 'T1001', date: '2026. 08. 24', time: '10:30:12', type: 'BUY', name: '삼성전자', qty: 50, price: 75000, total: 3750000, fee: 562, status: '체결완료' },
    { id: 'T1002', date: '2026. 08. 23', time: '14:15:45', type: 'SELL', name: 'SK하이닉스', qty: 10, price: 152000, total: 1520000, fee: 228, profit: 45000, profitRate: 3.05, status: '체결완료' },
    { id: 'T1003', date: '2026. 08. 22', time: '09:45:00', type: 'BUY', name: 'NAVER', qty: 10, price: 191000, total: 1910000, fee: 286, status: '체결완료' },
    { id: 'T1004', date: '2026. 08. 20', time: '11:20:30', type: 'SELL', name: '현대차', qty: 5, price: 215000, total: 1075000, fee: 161, profit: -12000, profitRate: -1.10, status: '체결완료' },
    { id: 'T1005', date: '2026. 08. 15', time: '15:10:05', type: 'BUY', name: 'LG에너지솔루션', qty: 2, price: 420000, total: 840000, fee: 126, status: '체결완료' },
  ];

  const filteredHistory = filter === 'ALL' ? tradeHistory : tradeHistory.filter(t => t.type === filter);

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <HistoryIcon size={48} color="var(--text-muted)" />
        <p style={{ color: 'var(--text-secondary)' }}>로그인 후 이용 가능합니다.</p>
        <button onClick={() => navigate('/auth')} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700' }}>거래 내역</h1>
        </div>
        <button style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
          <Download size={16} /> 다운로드
        </button>
      </header>

      {/* 필터 및 검색 바 */}
      <section style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: '12px', padding: '4px' }}>
          {[
            { label: '전체', value: 'ALL' },
            { label: '매수', value: 'BUY' },
            { label: '매도', value: 'SELL' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                background: filter === f.value ? 'var(--accent)' : 'transparent',
                color: filter === f.value ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: filter === f.value ? '600' : '500',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="종목명 검색" 
            style={{ width: '100%', padding: '10px 10px 10px 34px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '13px' }}
          />
        </div>
        <button style={{ padding: '10px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Filter size={18} />
        </button>
      </section>

      {/* 내역 리스트 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredHistory.map((trade, idx) => (
          <div key={trade.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{trade.date} {trade.time}</span>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>{trade.status}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: trade.type === 'BUY' ? 'var(--danger)' : 'var(--accent)', background: trade.type === 'BUY' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {trade.type === 'BUY' ? '매수' : '매도'}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{trade.name}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {trade.price.toLocaleString()}원 × {trade.qty}주
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '16px', fontWeight: '700' }}>
                  {trade.total.toLocaleString()}원
                </p>
                {trade.type === 'SELL' && trade.profit !== undefined && (
                  <p style={{ fontSize: '12px', color: trade.profit >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: '500' }}>
                    실현손익 {trade.profit >= 0 ? '+' : ''}{trade.profit.toLocaleString()}원 ({trade.profitRate > 0 ? '+' : ''}{trade.profitRate}%)
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredHistory.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            해당하는 거래 내역이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
};

export default History;
