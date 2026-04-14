import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; 
import Dashboard from "./pages/Dashboard";
import ResultView from "./pages/ResultView"; 
import AnalysisPage from "./pages/AnalysisPage";

function App() {
  return (
    // ВСЁ, что использует хуки роутера (useLocation, useNavigate), 
    // ДОЛЖНО быть внутри этого тега <Router>
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        
        {/* Теперь Sidebar внутри Router, и ошибка исчезнет */}
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
              Hackathon Prototype v1.0
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/result/:id" element={<ResultView />} />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
              <Route path="/analysis/latest" element={<AnalysisPage isLatest={true} />} />
            </Routes>
          </main>
        </div>

      </div>
    </Router>
  );
}

export default App;