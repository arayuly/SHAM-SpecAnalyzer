import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Send,
  Calendar,
  Target,
  DollarSign,
  Activity,
  Loader2,
} from "lucide-react";
import api from "../api";

export default function ResultView() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const [grantResult, setGrantResult] = useState(null);
  const [isCheckingGrant, setIsCheckingGrant] = useState(false);
  const [grantName, setGrantName] = useState(
    "Грант Министерства Науки и Высшего Образования РК",
  );

  const [templateMatch, setTemplateMatch] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  const [metrics, setMetrics] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get(`/documents/${id}/analysis`);
      setData(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/documents/${id}/export-docx`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Улучшенное_ТЗ_SHAM_${id}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка скачивания Word-документа:", error);
    }
  };

  const handleCheckGrant = async () => {
    setIsCheckingGrant(true);
    try {
      const response = await api.post(`/documents/${id}/check-grant`, {
        grant_name: grantName,
      });
      setGrantResult(response.data);
    } catch (error) {
      console.error("Ошибка проверки на грант:", error);
    } finally {
      setIsCheckingGrant(false);
    }
  };

  const handleCompareTemplate = async () => {
    setIsMatching(true);
    try {
      const response = await api.post(`/documents/${id}/compare-template`);
      setTemplateMatch(response.data);
    } catch (error) {
      console.error("Ошибка при сравнении с шаблоном:", error);
    } finally {
      setIsMatching(false);
    }
  };

  const handleExtractMetrics = async () => {
    setIsExtracting(true);
    try {
      const response = await api.get(`/documents/${id}/metrics`);
      setMetrics(response.data);
    } catch (error) {
      console.error("Ошибка при извлечении метрик:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  

  // Стилизованный экран загрузки
  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-lg gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        Загрузка результатов анализа...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
      {/* Левая колонка: Основной отчет */}
      <div className="flex-1 space-y-6">
        

        {/* Шапка с оценкой (Glassmorphism) */}
        <div className="bg-[var(--card)] backdrop-blur-md border border-[var(--card-border)] p-8 rounded-[28px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm transition-all duration-300">
        <div>
          {/* Основной заголовок: станет темным в светлой теме и белым в темной */}
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Результаты анализа ТЗ
          </h1>
          {/* Второстепенный текст: адаптируется через переменную --muted */}
          <p className="text-[var(--muted)] font-medium mt-1">
            Система выявила ряд неточностей и подготовила рекомендации.
          </p>
        </div>

        {/* Блок с оценкой */}
        <div className="bg-[var(--hover)] rounded-2xl px-8 py-4 border border-[var(--card-border)] text-center min-w-[140px]">
          <div
            className={`text-4xl font-black transition-colors ${
              data.score > 75
                ? "text-emerald-500" // В светлой теме чуть насыщеннее
                : data.score > 40
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {data.score}/100
          </div>
          <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mt-1">
            Оценка качества
          </div>
        </div>
      </div>

       {/* БЛОК: Экстрактор метрик и KPI */}
        <div className="bg-[var(--card)] backdrop-blur-md border border-[var(--card-border)] p-6 rounded-[28px] shadow-sm transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center text-[var(--foreground)]">
                <Activity className="w-6 h-6 mr-2 text-blue-500" /> Извлеченные метрики (KPI)
              </h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                Автоматический поиск сроков, бюджетов и целевых показателей.
              </p>
            </div>
            {!metrics && (
              <button
                onClick={handleExtractMetrics}
                disabled={isExtracting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold rounded-xl hover:bg-blue-500/20 transition-all disabled:opacity-50"
              >
                {isExtracting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isExtracting ? "Сканирование..." : "Найти KPI"}
              </button>
            )}
          </div>

          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 animate-fade-in">
              {/* Сроки и Даты */}
              <div className="bg-blue-500/[0.07] p-5 rounded-2xl border border-blue-500/10">
                <div className="flex items-center mb-3 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <Calendar className="w-4 h-4 mr-2" /> Сроки и Даты
                </div>
                <ul className="text-sm text-[var(--foreground)] opacity-80 space-y-2">
                  {metrics.deadlines && metrics.deadlines.length > 0 ? (
                    metrics.deadlines.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span> {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-[var(--muted)] italic">Сроки не обнаружены</li>
                  )}
                </ul>
              </div>

              {/* Бюджет */}
              <div className="bg-emerald-500/[0.07] p-5 rounded-2xl border border-emerald-500/10">
                <div className="flex items-center mb-3 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
                  <DollarSign className="w-4 h-4 mr-2" /> Бюджет
                </div>
                <ul className="text-sm text-[var(--foreground)] opacity-80 space-y-2">
                  {metrics.budget && metrics.budget.length > 0 ? (
                    metrics.budget.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span> {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-[var(--muted)] italic">Бюджет не указан</li>
                  )}
                </ul>
              </div>

              {/* Показатели KPI */}
            <div className="bg-purple-500/[0.07] p-6 rounded-[24px] border border-purple-500/10 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/5">
              <div className="flex items-center mb-4 text-purple-600 dark:text-purple-400 font-black text-[10px] uppercase tracking-[0.15em]">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-4 h-4" />
                </div>
                Показатели KPI
              </div>
              
              <ul className="text-sm text-[var(--foreground)] space-y-3">
                {metrics.kpis && metrics.kpis.length > 0 ? (
                  metrics.kpis.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="text-purple-500 font-bold mt-0.5 group-hover:scale-125 transition-transform">•</span>
                      <span className="opacity-80 leading-relaxed">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[var(--muted)] italic text-xs opacity-60 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[var(--muted)] rounded-full" />
                    KPI не обнаружены
                  </li>
                )}
              </ul>
            </div>
            </div>
          )}
        </div>

       {/* БЛОК: Нормоконтроль (Template Matcher) */}
      <div className="bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.08] dark:from-purple-500/10 dark:to-pink-500/10 backdrop-blur-md p-8 rounded-[32px] border border-purple-500/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Нормоконтроль (ГОСТ/Эталон)
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              Проверка структуры документа на соответствие шаблону.
            </p>
          </div>
          {!templateMatch && (
            <button
              onClick={handleCompareTemplate}
              disabled={isMatching}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
            >
              {isMatching && <Loader2 className="w-4 h-4 animate-spin" />}
              {isMatching ? "Сверяю..." : "Запустить проверку"}
            </button>
          )}
        </div>

        {templateMatch && (
          <div className="mt-4 animate-fade-in">
            <div className="flex items-center mb-8">
              <div className="relative w-24 h-24 flex items-center justify-center bg-[var(--card)] rounded-full border-4 border-purple-500/30 shadow-inner mr-6">
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {templateMatch.match_percentage}%
                </span>
                {/* Декоративное кольцо */}
                <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin-slow opacity-20" />
              </div>
              <div className="text-sm text-[var(--foreground)] font-bold leading-tight">
                Совпадение
                <br />
                <span className="text-[var(--muted)] font-medium">с эталонной структурой</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              {/* Ошибки: Отсутствующие разделы */}
              <div className="bg-red-500/[0.04] dark:bg-red-500/[0.08] p-5 rounded-2xl border border-red-500/20">
                <span className="font-black text-red-600 dark:text-red-400 text-[10px] uppercase tracking-widest block mb-3">
                  ❌ Отсутствующие разделы
                </span>
                <ul className="list-disc pl-5 text-[var(--foreground)] opacity-80 space-y-1.5">
                  {templateMatch.missing_sections.length > 0 ? (
                    templateMatch.missing_sections.map((sec, i) => (
                      <li key={i}>{sec}</li>
                    ))
                  ) : (
                    <li className="text-[var(--muted)] italic">Все разделы присутствуют</li>
                  )}
                </ul>
              </div>

              {/* Предупреждения: Нестандартные разделы */}
              <div className="bg-yellow-500/[0.04] dark:bg-yellow-500/[0.08] p-5 rounded-2xl border border-yellow-500/20">
                <span className="font-black text-yellow-600 dark:text-yellow-400 text-[10px] uppercase tracking-widest block mb-3">
                  ⚠️ Нестандартные разделы
                </span>
                <ul className="list-disc pl-5 text-[var(--foreground)] opacity-80 space-y-1.5">
                  {templateMatch.extra_sections.length > 0 ? (
                    templateMatch.extra_sections.map((sec, i) => (
                      <li key={i}>{sec}</li>
                    ))
                  ) : (
                    <li className="text-[var(--muted)] italic">Не обнаружено</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-5 bg-purple-500/[0.06] dark:bg-purple-500/10 rounded-2xl text-purple-700 dark:text-purple-200 text-sm font-medium border border-purple-500/20 flex gap-3">
              <span className="text-xl">📝</span>
              <div>
                <span className="font-bold block mb-0.5">Вывод нормоконтролера:</span>
                {templateMatch.conclusion}
              </div>
            </div>
          </div>
        )}
      </div>
        {/* Блоки с ошибками */}
        {/* Блоки с ошибками */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300">
  
  {/* Логические ошибки */}
  <div className="bg-red-500/[0.05] dark:bg-red-500/[0.1] p-6 rounded-[24px] border border-red-500/20 shadow-sm shadow-red-500/5">
    <h3 className="font-black text-red-600 dark:text-red-400 flex items-center mb-4 text-xs uppercase tracking-[0.1em]">
      <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center mr-3">
        <AlertTriangle className="w-4 h-4" />
      </div>
      Логические ошибки
    </h3>
    <ul className="space-y-2 text-sm text-[var(--foreground)]">
      {data.errors.logical_errors?.length > 0 ? (
        data.errors.logical_errors.map((err, i) => (
          <li key={i} className="flex gap-3 opacity-80 leading-relaxed">
            <span className="text-red-500 font-bold">•</span>
            {err}
          </li>
        ))
      ) : (
        <li className="text-[var(--muted)] italic opacity-60">Логических ошибок не обнаружено</li>
      )}
    </ul>
  </div>

  {/* Отсутствующие KPI */}
      <div className="bg-yellow-500/[0.05] dark:bg-yellow-500/[0.1] p-6 rounded-[24px] border border-yellow-500/20 shadow-sm shadow-yellow-500/5">
        <h3 className="font-black text-yellow-700 dark:text-yellow-400 flex items-center mb-4 text-xs uppercase tracking-[0.1em]">
          <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center mr-3">
            <AlertTriangle className="w-4 h-4" />
          </div>
          Отсутствующие KPI
        </h3>
        <ul className="space-y-2 text-sm text-[var(--foreground)]">
          {data.errors.missing_kpis?.length > 0 ? (
            data.errors.missing_kpis.map((err, i) => (
              <li key={i} className="flex gap-3 opacity-80 leading-relaxed">
                <span className="text-yellow-500 font-bold">•</span>
                {err}
              </li>
            ))
          ) : (
            <li className="text-[var(--muted)] italic opacity-60">Все ключевые показатели на месте</li>
          )}
        </ul>
      </div>
    </div>

       {/* Рекомендации по улучшению */}
      <div className="bg-emerald-500/[0.05] dark:bg-emerald-500/[0.1] p-8 rounded-[32px] border border-emerald-500/20 shadow-sm transition-all duration-300">
        <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-400 flex items-center mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          Рекомендации по улучшению
        </h2>

        <ul className="space-y-4 text-[var(--foreground)]">
          {data.improvements?.map((rec, i) => (
            <li key={i} className="flex items-start group">
              <div className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0" />
              <span className="opacity-80 leading-relaxed text-sm font-medium">{rec}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleDownload}
          className="mt-8 flex items-center justify-center gap-3 px-6 py-3.5 bg-emerald-600 text-white rounded-[18px] hover:bg-emerald-500 active:scale-[0.98] transition-all font-bold shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
        >
          <Download className="w-5 h-5" />
          Скачать улучшенное ТЗ (.docx)
        </button>
      </div>

       {/* БЛОК: Проверка на соответствие грантам */}
      <div className="bg-gradient-to-br from-indigo-500/[0.05] to-blue-500/[0.05] dark:from-indigo-500/10 dark:to-blue-500/10 p-8 rounded-[32px] border border-indigo-500/20 shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-[var(--foreground)]">
              Проверка на соответствие грантам
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1 font-medium">
              Оцените шансы ТЗ пройти формальную экспертизу фонда.
            </p>
          </div>
          {!grantResult && (
            <button
              onClick={handleCheckGrant}
              disabled={isCheckingGrant}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95"
            >
              {isCheckingGrant ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Анализирую...</span>
                </>
              ) : (
                <span>Запустить проверку</span>
              )}
            </button>
          )}
        </div>

        {grantResult && (
          <div className="mt-4 animate-fade-in space-y-6">
            {/* Счётчик готовности */}
            <div className="flex items-center p-4 bg-[var(--card)] rounded-2xl border border-[var(--card-border)] w-fit">
              <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mr-4">
                {grantResult.compliance_score}%
              </div>
              <div className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider leading-tight">
                Готовность к подаче<br />на грант
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Что есть */}
              <div className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.08] p-5 rounded-2xl border border-emerald-500/20">
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-widest block mb-3">
                  ✅ Присутствует:
                </span>
                <ul className="space-y-2 text-[var(--foreground)] opacity-80 font-medium">
                  {grantResult.present_sections.map((sec, i) => (
                    <li key={i} className="flex gap-2">• {sec}</li>
                  ))}
                </ul>
              </div>

              {/* Чего нет */}
              <div className="bg-red-500/[0.03] dark:bg-red-500/[0.08] p-5 rounded-2xl border border-red-500/20">
                <span className="font-black text-red-600 dark:text-red-400 text-[10px] uppercase tracking-widest block mb-3">
                  ❌ Отсутствует (Критично):
                </span>
                <ul className="space-y-2 text-[var(--foreground)] opacity-80 font-medium">
                  {grantResult.missing_sections.map((sec, i) => (
                    <li key={i} className="flex gap-2">• {sec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Совет эксперта */}
            <div className="mt-4 p-5 bg-indigo-500/[0.06] dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex gap-4 transition-colors">
              <span className="text-2xl">💡</span>
              <div>
                <span className="font-black text-indigo-700 dark:text-indigo-300 text-xs uppercase tracking-widest block mb-1">
                  Совет эксперта
                </span>
                <p className="text-[var(--foreground)] text-sm opacity-90 leading-relaxed font-medium">
                  {grantResult.expert_advice}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

 
    </div>
  );
}