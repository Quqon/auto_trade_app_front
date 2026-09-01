import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Loader2, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StockDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [basicInfo, setBasicInfo] = useState(null);
  const [priceInfo, setPriceInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [basicRes, priceRes, chartRes] = await Promise.all([
          axios.get(`/api/stocks/${code}/basic`),
          axios.get(`/api/stocks/${code}/price`),
          axios.get(`/api/stocks/${code}/chart`)
        ]);

        if (basicRes.data?.output) setBasicInfo(basicRes.data.output);
        if (priceRes.data?.output) setPriceInfo(priceRes.data.output);
        
        if (chartRes.data?.output2) {
          // KIS API 차트 데이터는 최신 날짜가 먼저 오므로 역순 정렬 필요
          const rawData = [...chartRes.data.output2].reverse();
          const formattedData = rawData.map(item => {
            const y = item.stck_bsop_date ? item.stck_bsop_date.substring(0, 4) : '';
            const m = item.stck_bsop_date ? item.stck_bsop_date.substring(4, 6) : '';
            const d = item.stck_bsop_date ? item.stck_bsop_date.substring(6, 8) : '';
            
            // Mock API에서 받은 경우
            const y_mock = item.date ? item.date.substring(0, 4) : y;
            const m_mock = item.date ? item.date.substring(4, 6) : m;
            const d_mock = item.date ? item.date.substring(6, 8) : d;
            
            const close = item.stck_clpr ? parseInt(item.stck_clpr, 10) : (item.closePrice ? parseInt(item.closePrice, 10) : 0);
            
            return {
              date: `${m_mock}/${d_mock}`,
              price: close
            };
          });
          setChartData(formattedData);
        }
      } catch (err) {
        console.error("종목 상세 데이터를 불러오는데 실패했습니다.", err);
        setError("종목 데이터를 불러오는데 실패했습니다. (API 설정 확인 필요)");
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchStockData();
    }
  }, [code]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="spinner" size={32} color="var(--accent)" />
      </div>
    );
  }

  if (error || !basicInfo) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
        <p>{error || "데이터를 찾을 수 없습니다."}</p>
        <button className="auth-button" style={{ marginTop: '20px', width: 'auto', padding: '10px 20px' }} onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  const currentPrice = priceInfo?.stck_prpr || priceInfo?.currentPrice || '0';
  const changeRate = priceInfo?.prdy_ctrt || priceInfo?.changeRate || '0';
  const isUp = parseFloat(changeRate) > 0;
  const isDown = parseFloat(changeRate) < 0;
  
  const formattedPrice = parseInt(currentPrice, 10).toLocaleString();
  const formattedChange = `${isUp ? '+' : ''}${changeRate}%`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {basicInfo.prdt_name || basicInfo.prdtName}
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>{code}</span>
          </h1>
        </div>
      </header>

      {/* 현재가 카드 */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>현재가</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-primary)' }}>
            ₩{formattedPrice}
          </span>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: isUp ? 'var(--success)' : isDown ? 'var(--danger)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {isUp ? <ArrowUpRight size={18} /> : isDown ? <ArrowDownRight size={18} /> : null}
            {formattedChange}
          </span>
        </div>
        
        {/* 부가 정보 */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Calendar size={14} />
            <span>상장연도: {basicInfo.saleStrtYear || (basicInfo.sale_strt_dt?.substring(0,4)) || '정보없음'}</span>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: 'var(--text-primary)' }}>최근 5개월 시세 흐름</h3>
        
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDown ? "var(--danger)" : "var(--accent)"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isDown ? "var(--danger)" : "var(--accent)"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
                  dy={10}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
                  width={60}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                  itemStyle={{ color: 'var(--accent)', fontWeight: '600' }}
                  formatter={(value) => [`₩${value.toLocaleString()}`, '종가']}
                  labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isDown ? "var(--danger)" : "var(--accent)"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            차트 데이터를 불러올 수 없습니다.
          </div>
        )}
      </div>

    </div>
  );
};

export default StockDetail;
