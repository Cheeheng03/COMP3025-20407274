import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import './fonts.css';
import Landing from './pages/Landing';
import CreditScore from './pages/CreditScore';
import Chart from './charts/chart'
function App() {
  const headerRef = useRef(null);
  const contentContainerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const updateContentHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
    setHeaderHeight(headerHeight);
    
    if (contentContainerRef.current) {
      contentContainerRef.current.style.height = `calc(var(--vh, 1vh) * 100 - ${headerHeight}px)`;
    }
  };

  useEffect(() => {
    updateContentHeight();
    window.addEventListener('resize', updateContentHeight);

    return () => {
      window.removeEventListener('resize', updateContentHeight);
    };
  }, []);

  return (
    <Router>
      <div className="App flex flex-col h-screen">
        <Header ref={headerRef} />

        <div className="flex-1 content-container overflow-auto" ref={contentContainerRef}>
          <Routes>
            {/* Pass the dynamically calculated headerHeight as a prop to the Landing page */}
            <Route path="/" element={<Landing headerHeight={headerHeight} />} />
            <Route path="/credit-score" element={<CreditScore />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
