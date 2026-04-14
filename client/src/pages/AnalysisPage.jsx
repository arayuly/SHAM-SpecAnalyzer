import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // или ваш api.js
import GrantAnalysisDashboard from '../components/GrantAnalysisDashboard';
import api from "../api";
import { AlertTriangle} from "lucide-react";

export default function AnalysisPage() {
    const { id } = useParams(); 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                // Замените URL на ваш реальный бэкенд
                const response = await api.get(`/documents/${id}/full_analysis`);
                setData(response.data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Ошибка при загрузке анализа. Проверьте соединение с бэкендом.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAnalysis();
    }, [id]);

   if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-[var(--background)] transition-colors duration-300">
            <div className="relative flex items-center justify-center">
                {/* Внешнее пульсирующее кольцо */}
                <div className="absolute w-20 h-20 border-4 border-[var(--accent)] opacity-20 rounded-full animate-ping"></div>
                
                {/* Основной спиннер */}
                <div className="w-14 h-14 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
                
                {/* Иконка или буква по центру (опционально) */}
                <div className="absolute text-[var(--accent)] font-black text-xs">AI</div>
            </div>

            <div className="text-center space-y-2">
                <p className="text-[var(--foreground)] font-black uppercase tracking-[0.2em] text-xs">
                    Llama 3 анализирует
                </p>
                <p className="text-[var(--muted)] text-sm font-medium animate-pulse">
                    Сверка критериев гранта...
                </p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-[var(--background)] p-6 transition-colors duration-300">
            <div className="max-w-md w-full p-8 bg-[var(--card)] border border-red-500/20 rounded-[32px] text-center shadow-xl shadow-red-500/5 backdrop-blur-md">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>
                
                <h3 className="text-xl font-black text-[var(--foreground)] mb-2 tracking-tight">
                    Упс! Что-то пошло не так
                </h3>
                
                <p className="text-[var(--muted)] text-sm mb-8 leading-relaxed">
                    {error || "Произошла непредвиденная ошибка при обработке документа. Попробуйте обновить страницу."}
                </p>
                
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all active:scale-95"
                >
                    Повторить попытку
                </button>
            </div>
        </div>
    );
    
    return <GrantAnalysisDashboard data={data} />;
}