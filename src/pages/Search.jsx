import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search as SearchIcon, X, Clock, TrendingUp, ChevronRight, ArrowUpRight, ArrowDownRight, Flame, Loader2 } from 'lucide-react';

// 실시간 인기 종목 더미 데이터
const HOT_STOCKS = [
  { rank: 1, code: '005930', name: '삼성전자', price: '78,500', change: '+1.42%', up: true },
  { rank: 2, code: '000660', name: 'SK하이닉스', price: '195,000', change: '+3.17%', up: true },
  { rank: 3, code: '035420', name: 'NAVER', price: '215,000', change: '-0.92%', up: false },
  { rank: 4, code: '051910', name: 'LG화학', price: '312,500', change: '+0.64%', up: true },
  { rank: 5, code: '035720', name: '카카오', price: '42,350', change: '-1.28%', up: false },
  { rank: 6, code: '207940', name: '삼성바이오로직스', price: '1,024,000', change: '+2.01%', up: true },
  { rank: 7, code: '006400', name: '삼성SDI', price: '298,000', change: '-0.33%', up: false },
  { rank: 8, code: '005380', name: '현대차', price: '248,500', change: '+1.84%', up: true },
  { rank: 9, code: '068270', name: '셀트리온', price: '178,900', change: '+0.45%', up: true },
  { rank: 10, code: '105560', name: 'KB금융', price: '98,200', change: '-0.71%', up: false },
];

const RECENT_KEY = 'recent_searches';

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularStocks, setPopularStocks] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(true);

  // 디바운스 처리: 사용자가 입력을 멈추고 300ms 후에 debouncedQuery 업데이트
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // debouncedQuery가 변경될 때마다 백엔드 검색 API 호출
  useEffect(() => {
    const searchStocks = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const response = await axios.get(`/api/stocks/search?keyword=${encodeURIComponent(debouncedQuery)}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('검색 실패:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    searchStocks();
  }, [debouncedQuery]);

  // 최근 검색 불러오기 및 실시간 인기 종목 조회
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    setRecentSearches(stored);

    const fetchPopularStocks = async () => {
      try {
        const response = await axios.get('/api/stocks/popular');
        if (!response.data || response.data.length === 0) {
          throw new Error("API returned empty data.");
        }
        
        const mapped = response.data.map((item, index) => {
          const changeRate = parseFloat(item.changeRate);
          return {
            rank: index + 1,
            code: item.stockCode,
            name: item.stockName,
            price: parseInt(item.currentPrice, 10).toLocaleString(),
            change: `${changeRate > 0 ? '+' : ''}${changeRate.toFixed(2)}%`,
            up: changeRate > 0,
          };
        });
        setPopularStocks(mapped);
      } catch (error) {
        console.error("인기 종목을 불러오는데 실패했습니다:", error);
        setPopularStocks(HOT_STOCKS); // 에러 시 폴백(Mock) 사용
      } finally {
        setLoadingStocks(false);
      }
    };
    
    fetchPopularStocks();
  }, []);

  const saveSearch = (keyword) => {
    if (!keyword.trim()) return;
    const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const updated = [keyword, ...prev.filter((k) => k !== keyword)].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const removeSearch = (keyword) => {
    const updated = recentSearches.filter((k) => k !== keyword);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const clearAll = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  };

  const handleStockClick = (code, name) => {
    saveSearch(name);
    navigate(`/app/stock/${code}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (searchResults.length > 0) {
      const target = searchResults.find(s => s.name === query || s.code === query) || searchResults[0];
      handleStockClick(target.code, target.name);
    } else {
      saveSearch(query);
    }
  };

  const handleRecentClick = (keyword) => {
    setQuery(keyword);
    // 클릭 시 바로 이동하려면 code를 알아야 하는데, 
    // 최근 검색어는 이름만 있으므로 자동완성을 열어줍니다.
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 헤더 */}
      <header>
        <h1 className="text-gradient" style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
          종목 검색
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          관심 종목을 검색하고 실시간 동향을 파악하세요.
        </p>
      </header>

      {/* 검색 입력창 */}
      <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 10 }}>
        <SearchIcon
          size={20}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="종목명 또는 종목코드 검색 (예: ㅎ, 삼성)"
          className="auth-input"
          style={{ paddingRight: query ? '44px' : '16px' }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSearchResults([]);
            }}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}
        
        {/* 자동완성 드롭다운 */}
        {query && (searchResults.length > 0 || isSearching) && (
          <div 
            className="glass-panel" 
            style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              marginTop: '8px', 
              maxHeight: '300px', 
              overflowY: 'auto', 
              padding: '8px 0',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              zIndex: 20
            }}
          >
            {isSearching ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Loader2 className="spinner" size={20} style={{ display: 'inline-block' }} />
              </div>
            ) : (
              searchResults.map((stock) => (
                <div 
                  key={stock.code}
                  className="hover-dim"
                  onClick={() => handleStockClick(stock.code, stock.name)}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {stock.name}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {stock.code}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </form>

      {/* 최근 검색 목록 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>최근 검색</span>
          </div>
          {recentSearches.length > 0 && (
            <button
              onClick={clearAll}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px' }}
            >
              전체 삭제
            </button>
          )}
        </div>

        {recentSearches.length === 0 ? (
          <div
            className="glass-panel"
            style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}
          >
            최근 검색 내역이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentSearches.map((keyword) => (
              <div
                key={keyword}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <button
                  onClick={() => handleRecentClick(keyword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '500',
                    padding: 0,
                  }}
                >
                  {keyword}
                </button>
                <button
                  onClick={() => removeSearch(keyword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 실시간 인기 종목 */}
      <section style={{ paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Flame size={16} color="var(--warning)" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>실시간 인기 종목</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            기준: 거래량 상위
          </span>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden', minHeight: '300px' }}>
          {loadingStocks ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px 0' }}>
              <Loader2 className="spinner" size={24} color="var(--accent)" />
            </div>
          ) : (
            popularStocks.map((stock, idx) => (
              <div
                key={stock.code}
                className="hover-dim"
                onClick={() => handleStockClick(stock.code, stock.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderBottom: idx < popularStocks.length - 1 ? '1px solid var(--border-color)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* 순위 */}
              <span style={{
                width: '22px',
                fontSize: '13px',
                fontWeight: '700',
                color: idx < 3 ? 'var(--accent)' : 'var(--text-muted)',
                textAlign: 'center',
                flexShrink: 0,
              }}>
                {stock.rank}
              </span>

              {/* 종목명 & 코드 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {stock.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {stock.code}
                </div>
              </div>

              {/* 가격 & 등락 */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  ₩{stock.price}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: stock.up ? 'var(--success)' : 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '2px',
                  marginTop: '2px',
                }}>
                  {stock.up
                    ? <ArrowUpRight size={13} />
                    : <ArrowDownRight size={13} />
                  }
                  {stock.change}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
