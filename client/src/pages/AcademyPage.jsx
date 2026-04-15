import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  BookOpen, FileText, Target, Award, Lightbulb, CheckCircle,
  Edit, UploadCloud, Search, Users, ArrowRight, Zap
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};


export default function AcademyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--background)] min-h-screen transition-colors duration-300">
      <div className="p-6 max-w-5xl mx-auto space-y-20 pb-20">
        
        {/* Header */}
        <div className="text-center pt-10">
          <motion.div 
            {...fadeUp} 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-6 border border-[var(--accent)]/20"
          >
            <Zap size={12} className="fill-[var(--accent)]"/> Knowledge Base
          </motion.div>
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6 tracking-tight">
            Гид исследователя: <br/>
            <span className="text-[var(--accent)]">От идеи до финансирования</span>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="text-[var(--muted)] max-w-2xl mx-auto text-lg font-medium">
            Полное руководство по составлению НТЗ, подготовке документов и прохождению государственной экспертизы.
          </motion.p>
        </div>

        {/* Section 1: Rules */}
        <section>
          <motion.h2 {...fadeUp} className="text-2xl font-black text-[var(--foreground)] mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--hover)] flex items-center justify-center border border-[var(--card-border)]">
              <BookOpen className="w-5 h-5 text-[var(--accent)]" />
            </div>
            Правила написания НТЗ
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: 'Структура по ГОСТу', desc: 'Ваше ТЗ должно чётко делиться на: Введение, Цели, Задачи, Методологию и Ожидаемые результаты. Без «воды».' },
              { icon: Target, title: 'SMART-Задачи', desc: 'Каждая задача должна быть измеримой. Не «изучить процесс», а «провести 50 тестов и получить точность 95%».' },
              { icon: Award, title: 'Обоснование новизны', desc: 'Комиссия ищет уникальность. Обязательно сравните ваше решение с текущими мировыми аналогами.' },
              { icon: Lightbulb, title: 'Практическая польза', desc: 'Укажите, где именно будет применяться разработка и какой экономический эффект принесёт.' },
            ].map((card, i) => (
              <motion.div 
                key={i} {...fadeUp} transition={{ delay: i * 0.1 }} 
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-[28px] p-8 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <card.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="font-black text-[var(--foreground)] mb-3 text-lg">{card.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-medium">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Checklist */}
        <section>
          <motion.div {...fadeUp} className="bg-gradient-to-br from-[var(--card)] to-[var(--hover)] border border-[var(--card-border)] rounded-[32px] p-10 relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl font-black text-[var(--foreground)] mb-8">Чек-лист: Пакет документов</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Научно-техническое задание (НТЗ)',
                    'Календарный план работ',
                    'Смета расходов (бюджет)',
                    'Письма поддержки партнеров',
                    'Решение этической комиссии',
                    'Справка об оригинальности (антиплагиат)',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--card-border)]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_var(--accent)]/30">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-[var(--foreground)]">{item}</span>
                    </motion.div>
                  ))}
                </div>
             </div>
          </motion.div>
        </section>

        {/* Section 3: Timeline */}
        <section>
          <motion.h2 {...fadeUp} className="text-2xl font-black text-[var(--foreground)] mb-10 text-center">
            Маршрут заявки
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { icon: Edit, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Создание заявки', desc: 'Пишете НТЗ и прогоняете через SHAM AI для достижения оценки 85+/100.' },
              { icon: UploadCloud, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Подача в НЦГНТЭ / Фонд науки', desc: 'Загрузка полного пакета документов на портал единой экспертизы.' },
              { icon: Search, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Формальная проверка', desc: 'Проверка юристами на соответствие правилам конкурса (5-10 дней).' },
              { icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10', title: 'Государственная экспертиза', desc: 'Оценка 3-мя независимыми экспертами по 7 критериям SHAM AI.' },
              { icon: CheckCircle, color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/10', title: 'Одобрение и грант', desc: 'Национальный научный совет выносит финальное решение.' },
            ].map((step, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex gap-6 p-6 rounded-[24px] hover:bg-[var(--hover)] transition-colors group">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-sm border border-current/10`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  {i < 4 && <div className="w-px h-full bg-[var(--card-border)] my-2" />}
                </div>
                <div className="pt-2">
                  <h4 className="font-black text-[var(--foreground)] text-lg leading-none">{step.title}</h4>
                  <p className="text-sm text-[var(--muted)] mt-2 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

     
    
      </div>
    </div>
  );
}