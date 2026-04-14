import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // или ваш api.js
import GrantAnalysisDashboard from '../components/GrantAnalysisDashboard';
import api from "../api";

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
        <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-[#F8FAFC]">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Llama 3 анализирует ТЗ по критериям гранта...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center shadow-sm">
                <p className="font-bold">Упс! Что-то пошло не так</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
    );
    
    return <GrantAnalysisDashboard data={data} />;
}