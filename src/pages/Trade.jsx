import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, ShieldCheck, Zap, Hand } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Trade = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState('MANUAL');
  const [rates, setRates] = useState({
    AGGRESSIVE: 0,
    MODERATE: 0,
    CONSERVATIVE: 0,
    MANUAL: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ratesRes, modeRes] = await Promise.all([
        axios.get('/api/preference/rates'),
        axios.get('/api/preference/mode')
      ]);
      setRates(ratesRes.data);
      setCurrentMode(modeRes.data.mode);
    } catch (error) {
      console.error('API 데이터를 불러오는데 실패했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (mode) => {
    if (!user) {
      navigate('/app/trade/detail/' + mode.toLowerCase());
      return;
    }
    
    try {
      await axios.post('/api/preference/mode', { mode });
      setCurrentMode(mode);
    } catch (error) {
      console.error('모드 변경 실패:', error);
      if (error.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        alert('설정 변경에 실패했습니다. 백엔드 서버가 켜져있는지 확인해주세요.');
      }
    }
  };

  const investmentTypes = [
    {
      id: 'AGGRESSIVE',
      name: '공격투자형',
      desc: '높은 리스크를 감수하며 시장 수익률 이상의 높은 수익을 추구합니다.',
      icon: Zap,
      color: 'var(--danger)',
      bg: 'rgba(239, 68, 68, 0.1)',
      riskRate: '25.0%',
      period: '7일'
    },
    {
      id: 'MODERATE',
      name: '위험중립형',
      desc: '리스크와 수익률의 적절한 밸런스를 유지하며 시장 흐름에 편승합니다.',
      icon: Activity,
      color: 'var(--warning)',
      bg: 'rgba(245, 158, 11, 0.1)',
      riskRate: '10.5%',
      period: '1개월'
    },
    {
      id: 'CONSERVATIVE',
      name: '안정추구형',
      desc: '원금 손실을 최소화하며 시장 수익률 정도의 안정적인 수익을 목표로 합니다.',
      icon: ShieldCheck,
      color: 'var(--success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      riskRate: '2.5%',
      period: '6개월'
    },
    {
      id: 'MANUAL',
      name: '직접투자 (수동)',
      desc: '자동매매 시스템 개입을 중지하고 본인이 직접 판단하여 매매를 진행합니다.',
      icon: Hand,
      color: 'var(--accent)',
      bg: 'rgba(59, 130, 246, 0.1)',
      riskRate: '-',
      period: '-'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 className="text-gradient" style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
          매매 전략 설정
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
          선택한 성향에 따라 자동매매 시스템이<br />가장 알맞은 타이밍에 거래를 진행합니다.
        </p>
      </header>

      {/* 투자 성향 테스트 배너 */}
      <section>
        <div 
          onClick={() => navigate('/app/survey')}
          className="glass-panel hover-scale" 
          style={{ 
            padding: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer', 
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.05))', 
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '16px'
          }}
        >
          <div>
            <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700', marginBottom: '6px' }}>💡 어떤 전략이 좋을지 고민된다면?</p>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>나만의 투자 성향 테스트하기</h3>
          </div>
          <button style={{ 
            padding: '10px 16px', 
            borderRadius: '10px', 
            border: 'none', 
            background: 'var(--accent)', 
            color: '#fff', 
            fontWeight: '600', 
            fontSize: '13px', 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }}>
            시작하기
          </button>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {investmentTypes.map((type) => {
          const isActive = currentMode === type.id;
          const expectedRate = rates[type.id] || 0;

          return (
            <div
              key={type.id}
              onClick={() => handleModeChange(type.id)}
              className={`glass-panel hover-scale ${isActive ? 'active-mode' : ''}`}
              style={{
                padding: '22px',
                cursor: 'pointer',
                border: isActive ? `1px solid ${type.color}` : '1px solid var(--border-color)',
                boxShadow: isActive ? `0 0 20px ${type.bg}` : 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {isActive && (
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 16px', background: type.color, color: '#fff', fontSize: '11px', fontWeight: '700', borderBottomLeftRadius: '12px' }}>
                  현재 적용 중
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '16px',
                  background: type.bg,
                  color: type.color,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  flexShrink: 0
                }}>
                  <type.icon size={26} strokeWidth={2.5} />
                </div>

                <div style={{ flex: 1, marginTop: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: type.id !== 'MANUAL' ? '8px' : '0' }}>
                        {type.name}
                      </h3>
                      {type.id !== 'MANUAL' && (
                        <span style={{
                          fontSize: '11px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid var(--border-color)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: 'var(--text-secondary)'
                        }}>
                          예상 최대 투자기간: {type.period}
                        </span>
                      )}
                    </div>
                    {type.id !== 'MANUAL' && (
                      <div style={{ display: 'flex', gap: '12px', textAlign: 'right' }}>
                        <div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>예상 위험률</p>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            {type.riskRate}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>기대 수익률(평균)</p>
                          <p style={{ fontSize: '16px', fontWeight: '800', color: type.color }}>
                            {loading ? '...' : `${expectedRate > 0 ? '+' : ''}${expectedRate}%`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: type.id !== 'MANUAL' ? '12px' : '8px', lineHeight: '1.45' }}>
                    {type.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Trade;
