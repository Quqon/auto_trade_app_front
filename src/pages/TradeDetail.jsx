import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, Hand, ArrowLeft, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

const investmentTypes = {
  aggressive: {
    id: 'AGGRESSIVE',
    name: '공격투자형',
    desc: '높은 리스크를 감수하며 시장 수익률 이상의 높은 수익을 추구합니다.',
    icon: Zap,
    color: 'var(--danger)',
    bg: 'rgba(239, 68, 68, 0.1)',
    riskRate: '25.0%',
    period: '7일',
    details: [
      '급등락이 심한 테마주 및 변동성이 큰 종목을 위주로 매매합니다.',
      '단기 모멘텀 지표를 활용하여 빠른 진입과 청산을 반복합니다.',
      '시장 하락 시에도 숏 포지션 혹은 인버스 투자로 수익을 추구합니다.'
    ],
    target: '단기간에 높은 수익을 원하며 원금 손실을 감내할 수 있는 투자자'
  },
  moderate: {
    id: 'MODERATE',
    name: '위험중립형',
    desc: '리스크와 수익률의 적절한 밸런스를 유지하며 시장 흐름에 편승합니다.',
    icon: Activity,
    color: 'var(--warning)',
    bg: 'rgba(245, 158, 11, 0.1)',
    riskRate: '10.5%',
    period: '1개월',
    details: [
      '우량주와 성장주를 적절히 배분하여 포트폴리오를 구성합니다.',
      '추세 추종 매매 기법을 주로 사용하며 안정적인 수익 누적을 목표로 합니다.',
      '시장 급변 시 현금 비중을 늘려 리스크를 관리합니다.'
    ],
    target: '시장 평균 이상의 수익을 원하면서 과도한 리스크는 피하고 싶은 투자자'
  },
  conservative: {
    id: 'CONSERVATIVE',
    name: '안정추구형',
    desc: '원금 손실을 최소화하며 시장 수익률 정도의 안정적인 수익을 목표로 합니다.',
    icon: ShieldCheck,
    color: 'var(--success)',
    bg: 'rgba(16, 185, 129, 0.1)',
    riskRate: '2.5%',
    period: '6개월',
    details: [
      '배당주, 대형 가치주 위주의 보수적인 투자를 진행합니다.',
      '장기적인 관점에서 우상향하는 종목을 선별하여 매수 후 보유(Buy & Hold) 전략을 취합니다.',
      '손절 기준을 엄격하게 적용하여 자산을 보호합니다.'
    ],
    target: '수익률보다는 원금 보전과 안정성을 가장 중요하게 생각하는 투자자'
  },
  manual: {
    id: 'MANUAL',
    name: '직접투자 (수동)',
    desc: '자동매매 시스템 개입을 중지하고 본인이 직접 판단하여 매매를 진행합니다.',
    icon: Hand,
    color: 'var(--accent)',
    bg: 'rgba(59, 130, 246, 0.1)',
    riskRate: '-',
    period: '-',
    details: [
      '자동매매 봇이 어떠한 매수/매도 주문도 실행하지 않습니다.',
      '앱 내 제공되는 데이터와 지표를 참고하여 투자자가 직접 거래소에서 주문을 넣습니다.',
      '원할 때 언제든지 다른 자동매매 전략으로 전환할 수 있습니다.'
    ],
    target: '자신의 투자 철학에 맞춰 모든 결정을 스스로 내리고 싶은 투자자'
  }
};

const TradeDetail = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  
  const strategy = investmentTypes[mode?.toLowerCase()];

  if (!strategy) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
        존재하지 않는 매매 전략입니다.
        <br />
        <button 
          onClick={() => navigate('/app/trade')}
          style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  const Icon = strategy.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 뒤로가기 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px', marginLeft: '-8px', borderRadius: '50%',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
          전략 상세
        </h1>
      </div>

      {/* 전략 헤더 정보 */}
      <div className="glass-panel" style={{ padding: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: `4px solid ${strategy.color}` }}>
        <div style={{ 
          width: '72px', height: '72px', borderRadius: '24px', 
          background: strategy.bg, color: strategy.color,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: `0 8px 32px ${strategy.bg}`
        }}>
          <Icon size={36} strokeWidth={2.5} />
        </div>
        
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {strategy.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
            {strategy.desc}
          </p>
        </div>

        {strategy.id !== 'MANUAL' && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px', background: 'var(--bg-surface)', padding: '16px 32px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>예상 위험률</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{strategy.riskRate}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>추천 투자기간</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{strategy.period}</div>
            </div>
          </div>
        )}
      </div>

      {/* 전략 상세 내용 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <section>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color={strategy.color} />
            투자 방식 및 특징
          </h3>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {strategy.details.map((detail, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={18} color={strategy.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--warning)" />
            이런 분들께 추천해요
          </h3>
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', fontWeight: '500' }}>
              {strategy.target}
            </p>
          </div>
        </section>

      </div>

      {/* 하단 CTA (로그인 유도) */}
      <div style={{ marginTop: '16px' }}>
        <button 
          onClick={() => navigate('/auth')}
          className="auth-button"
          style={{ 
            width: '100%', 
            padding: '16px', 
            fontSize: '16px', 
            fontWeight: '700',
            background: `linear-gradient(135deg, ${strategy.color}, var(--accent))`,
            boxShadow: `0 4px 14px ${strategy.bg}`
          }}
        >
          로그인하고 이 전략 시작하기
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
          * 본 서비스가 제공하는 자동매매 알고리즘은 원금을 보장하지 않으며, 투자 결과에 대한 책임은 투자자 본인에게 있습니다.
        </p>
      </div>

    </div>
  );
};

export default TradeDetail;
