import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, ChevronRight, Activity, ShieldCheck, Zap, Loader2 } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: '주식 투자 경험이 얼마나 되시나요?',
    options: [
      { text: '1년 미만 (초보자)', score: 1 },
      { text: '1년 ~ 3년 (중급자)', score: 2 },
      { text: '3년 이상 (경험 풍부)', score: 3 }
    ]
  },
  {
    id: 2,
    question: '투자를 통해 기대하는 연 목표 수익률은 어느 정도인가요?',
    options: [
      { text: '5~10% (예금보다 조금 높은 수준의 안정적 수익)', score: 1 },
      { text: '10~20% (시장 평균 이상의 적절한 수익)', score: 2 },
      { text: '20% 이상 (위험을 감수하더라도 높은 수익)', score: 3 }
    ]
  },
  {
    id: 3,
    question: '보유 중인 주식이 한 달 만에 15% 하락했다면 어떻게 하시겠습니까?',
    options: [
      { text: '불안해서 전량 매도한다', score: 1 },
      { text: '시장 상황을 지켜보며 보유한다', score: 2 },
      { text: '저가 매수의 기회라 생각하고 추가 매수한다', score: 3 }
    ]
  },
  {
    id: 4,
    question: '가장 선호하는 투자 방식은 무엇인가요?',
    options: [
      { text: '원금 손실이 거의 없는 우량주 장기 투자', score: 1 },
      { text: '가치와 성장성이 적절히 분배된 분산 투자', score: 2 },
      { text: '단기 모멘텀 및 테마주 중심의 적극적 투자', score: 3 }
    ]
  }
];

const STRATEGIES = {
  CONSERVATIVE: {
    id: 'CONSERVATIVE',
    name: '안정추구형',
    desc: '원금 손실을 최소화하며 시장 수익률 정도의 안정적인 수익을 목표로 합니다.',
    icon: ShieldCheck,
    color: 'var(--success)',
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  MODERATE: {
    id: 'MODERATE',
    name: '위험중립형',
    desc: '리스크와 수익률의 적절한 밸런스를 유지하며 시장 흐름에 편승합니다.',
    icon: Activity,
    color: 'var(--warning)',
    bg: 'rgba(245, 158, 11, 0.1)'
  },
  AGGRESSIVE: {
    id: 'AGGRESSIVE',
    name: '공격투자형',
    desc: '높은 리스크를 감수하며 시장 수익률 이상의 높은 수익을 추구합니다.',
    icon: Zap,
    color: 'var(--danger)',
    bg: 'rgba(239, 68, 68, 0.1)'
  }
};

const Survey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [recommended, setRecommended] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSelectOption = (questionId, score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult({ ...answers, [questionId]: score });
    }
  };

  const calculateResult = (finalAnswers) => {
    const totalScore = Object.values(finalAnswers).reduce((a, b) => a + b, 0);
    
    let resultMode;
    if (totalScore <= 6) {
      resultMode = 'CONSERVATIVE';
    } else if (totalScore <= 9) {
      resultMode = 'MODERATE';
    } else {
      resultMode = 'AGGRESSIVE';
    }
    
    setRecommended(STRATEGIES[resultMode]);
    setIsFinished(true);
  };

  const handleSaveStrategy = async () => {
    if (!recommended) return;
    setSaving(true);
    try {
      await axios.post('/api/preference/mode', { mode: recommended.id });
      navigate('/app/trade');
    } catch (error) {
      console.error('설정 실패:', error);
      alert('설정 저장에 실패했습니다. 백엔드 서버 상태를 확인해주세요.');
      setSaving(false);
    }
  };

  const progress = ((currentStep) / QUESTIONS.length) * 100;

  if (isFinished && recommended) {
    const Icon = recommended.icon;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
        <header style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1 className="text-gradient" style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
            분석 완료!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            입력해주신 정보와 투자 성향을 바탕으로<br />가장 적합한 매매 전략을 찾았습니다.
          </p>
        </header>

        <section style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <div className="glass-panel hover-scale" style={{ padding: '32px 24px', textAlign: 'center', width: '100%', maxWidth: '400px', border: `1px solid ${recommended.color}`, boxShadow: `0 8px 32px ${recommended.bg}` }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: recommended.bg, color: recommended.color, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
              <Icon size={40} strokeWidth={2} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: recommended.color }}>
              {recommended.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {recommended.desc}
            </p>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={handleSaveStrategy}
            disabled={saving}
            style={{ padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(59,130,246,0.35)', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <Loader2 className="spinner" size={20} /> : <><CheckCircle2 size={20} /> 추천 전략으로 설정하기</>}
          </button>
          
          <button
            onClick={() => navigate('/app/trade')}
            disabled={saving}
            style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}
          >
            설정하지 않고 돌아가기
          </button>
        </section>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => currentStep > 0 ? setCurrentStep(p => p - 1) : navigate(-1)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>투자 성향 분석</h1>
      </header>

      {/* 진행 상태 바 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
          <span>진행 상황</span>
          <span style={{ color: 'var(--accent)' }}>{currentStep + 1} / {QUESTIONS.length}</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
        </div>
      </section>

      {/* 질문 및 선택지 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', lineHeight: '1.4', wordBreak: 'keep-all' }}>
          <span style={{ color: 'var(--accent)', marginRight: '8px' }}>Q{currentQ.id}.</span>
          {currentQ.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(currentQ.id, opt.score)}
              className="hover-dim"
              style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
            >
              <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                {opt.text}
              </span>
              <ChevronRight size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: '12px' }} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Survey;
