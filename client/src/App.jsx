import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResultView from "./pages/ResultView"; 
import AnalysisPage from "./pages/AnalysisPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AcademyPage from "./pages/AcademyPage";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import FloatingAssistant from "./components/FloatingAssistant";

function App() {
  const [currentFileName, setCurrentFileName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem('lastFileName');
    if (savedName) setCurrentFileName(savedName);
  }, []);

  const handleFileSelect = (id, name) => {
    localStorage.setItem('lastId', id);
    localStorage.setItem('lastFileName', name);
    setCurrentFileName(name);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
        
          
          <Routes>
            {/* ПУБЛИЧНЫЕ РОУТЫ (без сайдбара и хедера) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

           
            <Route
              element={
                <ProtectedRoute>
                  {/* MainLayout теперь сам рисует Sidebar и Header */}
                  <MainLayout currentFileName={currentFileName} />
                </ProtectedRoute>
              }
            >
              <Route 
                path="/" 
                element={<Dashboard onFileSelect={handleFileSelect} />} 
              />
              <Route 
                path="/result/:id"  
                element={<ResultView onFileSelect={handleFileSelect}/>} 
              />
              <Route 
                path="/analysis/:id" 
                element={<AnalysisPage onFileSelect={handleFileSelect} />} 
              />
              <Route 
                path="/academy" 
                element={<AcademyPage />} 
              />
              <Route 
                path="/analysis/latest" 
                element={<AnalysisPage isLatest={true} onFileSelect={handleFileSelect} />} 
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Ассистент всегда поверх всего */}
          <FloatingAssistant />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;