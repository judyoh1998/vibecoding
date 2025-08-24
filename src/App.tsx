import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import ConflictPage from './pages/ConflictPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/conflict" element={<ConflictPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </div>
  );
}

export default App;