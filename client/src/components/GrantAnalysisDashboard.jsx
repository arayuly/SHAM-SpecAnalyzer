import React, { useState, useMemo } from 'react';

// Иконки берем из lucide-react
import { 
  Target, Lightbulb, Zap, CheckCircle2, TrendingUp, ShieldCheck, Key,
  AlertTriangle, MessageSquare, Info 
} from 'lucide-react';

// Графики берем из recharts
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

const CRITERIA_CONFIG = {
  goals_tasks: { label: "Цель и задачи", icon: Target, color: "#3B82F6" },
  scientific_novelty: { label: "Научная новизна", icon: Lightbulb, color: "#A855F7" },
  practical_applicability: { label: "Практическая применимость", icon: Zap, color: "#F59E0B" },
  expected_results: { label: "Ожидаемые результаты", icon: CheckCircle2, color: "#10B981" },
  socio_economic_effect: { label: "Соц-экономический эффект", icon: TrendingUp, color: "#EC4899" },
  feasibility: { label: "Реализуемость", icon: ShieldCheck, color: "#64748B" },
  strategic_relevance: { label: "Стратегическая релевантность", icon: Key, color: "#EF4444" }
};

export default function GrantAnalysisDashboard({ data }) {
  const { original_text, found_issues, criteria_analysis } = data;
  const [selectedIssue, setSelectedIssue] = useState(null);

  // 1. Подготовка данных для радара
  const radarData = criteria_analysis.map(c => ({
    subject: c.label,
    A: c.score,
    fullMark: 10,
  }));

  // 2. Логика подсветки текста (разбиваем строку на части)
  const highlightedContent = useMemo(() => {
    if (!original_text) return null;
    
    let parts = [original_text];
    found_issues.forEach((issue) => {
      const newParts = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }
        const split = part.split(issue.phrase);
        for (let i = 0; i < split.length; i++) {
          newParts.push(split[i]);
          if (i < split.length - 1) {
            newParts.push(
              <mark
                key={issue.phrase + i}
                onClick={() => setSelectedIssue(issue)}
                className={`cursor-pointer px-1 rounded transition-all border-b-2 ${
                  selectedIssue?.phrase === issue.phrase 
                  ? 'bg-blue-300 border-blue-700' 
                  : 'bg-amber-100 border-amber-400 hover:bg-amber-200'
                }`}
              >
                {issue.phrase}
              </mark>
            );
          }
        }
      });
      parts = newParts;
    });
    return parts;
  }, [original_text, found_issues, selectedIssue]);

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9]">
      {/* Header */}
      <div className="h-14 bg-white border-b px-6 flex items-center justify-between shadow-sm">
        <h2 className="font-bold text-slate-700 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={20}/> AI Spec Analyzer Pro
        </h2>
        <div className="flex gap-4">
          {criteria_analysis.map(c => (
             <div key={c.id} className="flex flex-col items-center">
               <span className="text-[10px] text-slate-400 uppercase font-bold">{c.weight}</span>
               <div className="w-8 h-1 bg-slate-200 rounded-full mt-0.5 overflow-hidden">
                 <div className="h-full bg-blue-500" style={{width: `${c.score*10}%`}} />
               </div>
             </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        
        {/* ЛЕВАЯ ПАНЕЛЬ: Текст ТЗ */}
        <div className="flex-[2] bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <MessageSquare size={14}/> ОРИГИНАЛЬНЫЙ ТЕКСТ С ПРАВКАМИ
            </span>
          </div>
          <div className="p-8 overflow-y-auto leading-relaxed text-slate-700 font-serif text-lg">
            {highlightedContent}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: Аналитика */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
          
          {/* Радарная диаграмма */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Баланс критериев</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748B'}} />
                  <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Карточка конкретной проблемы */}
          <div className="flex-1">
            {selectedIssue ? (
              <div className="bg-[#1E293B] text-white p-6 rounded-3xl shadow-xl sticky top-0 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-500/30 uppercase">
                    {selectedIssue.category}
                  </span>
                  {(() => {
                    const config = CRITERIA_CONFIG[selectedIssue.criterion];
                    const Icon = config?.icon || Info;
                    return (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Icon size={14} style={{color: config?.color}} />
                        <span className="text-[10px] font-bold uppercase">{config?.label}</span>
                      </div>
                    );
                  })()}
                </div>
                
                <p className="text-slate-400 text-xs mb-1 uppercase font-bold tracking-tight">Проблема в тексте:</p>
                <p className="text-lg font-medium mb-6 italic">"{selectedIssue.phrase}"</p>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                  <h4 className="text-emerald-400 text-xs font-bold flex items-center gap-2 mb-2 uppercase">
                    <Zap size={14}/> Рекомендуемое исправление (SMART)
                  </h4>
                  <p className="text-emerald-50 text-md leading-relaxed">
                    {selectedIssue.replacement}
                  </p>
                </div>
                
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="mt-6 w-full text-center text-slate-500 text-xs hover:text-white transition"
                >
                  Закрыть детализацию
                </button>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center p-10 text-center text-slate-400">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <Info size={32} />
                </div>
                <p className="font-bold text-slate-500">Правки не выбраны</p>
                <p className="text-xs mt-1">Кликните на выделенное слово в тексте, чтобы увидеть решение от ИИ</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}