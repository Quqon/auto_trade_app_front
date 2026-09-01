import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trade from './pages/Trade';
import TradeDetail from './pages/TradeDetail';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import MyPage from './pages/MyPage';
import SearchPage from './pages/Search';
import Account from './pages/Account';
import Performance from './pages/Performance';
import Balance from './pages/Balance';
import History from './pages/History';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import StockDetail from './pages/StockDetail';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 웰컴 화면 - 첫 진입점 */}
          <Route path="/" element={<Welcome />} />

          {/* 로그인/회원가입 */}
          <Route path="/auth" element={<Auth />} />
          
          {/* OAuth2 리다이렉트 */}
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* 앱 메인 (둘러보기 or 로그인 후 진입) */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="trade" element={<Trade />} />
            <Route path="trade/detail/:mode" element={<TradeDetail />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="stock/:code" element={<StockDetail />} />
            <Route path="performance" element={<Performance />} />
            <Route path="balance" element={<Balance />} />
            <Route path="history" element={<History />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
