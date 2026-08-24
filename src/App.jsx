import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trade from './pages/Trade';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="trade" element={<Trade />} />
          <Route path="search" element={<div className="glass-panel hover-scale" style={{padding:'24px'}}><h2>종목 검색</h2><p style={{color:'var(--text-secondary)'}}>준비 중입니다.</p></div>} />
          <Route path="settings" element={<div className="glass-panel hover-scale" style={{padding:'24px'}}><h2>설정</h2><p style={{color:'var(--text-secondary)'}}>준비 중입니다.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
