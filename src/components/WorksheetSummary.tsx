import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Share2, 
  FileSpreadsheet, 
  Users,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

interface WorksheetSummaryProps {
  studentName: string;
  score: number;
  totalScore: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  onRetry: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenGoogleModal: (tab: 'classroom' | 'sheets') => void;
}

export const WorksheetSummary: React.FC<WorksheetSummaryProps> = ({
  studentName,
  score,
  totalScore,
  percentage,
  correctCount,
  totalQuestions,
  timeSpentSeconds,
  onRetry,
  onOpenTeacherDashboard,
  onOpenGoogleModal,
}) => {
  const incorrectCount = totalQuestions - correctCount;
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback if confetti canvas not ready
      }
    }
  }, [percentage]);

  const getEncouragement = () => {
    if (percentage === 100) {
      return {
        title: 'عبقري الكسور الخارق! 🌟',
        subtitle: 'أحسنت يا بطل! لقد حصلت على الدرجة الكاملة بنجاح باهر. المعلمة فاليا فخورة جداً بإنجازك!',
        badgeColor: 'bg-emerald-500 text-white',
      };
    }
    if (percentage >= 80) {
      return {
        title: 'مستوى ممتاز ومتميز جداً! 👏',
        subtitle: 'إتقان رائع لمهارات مقارنة الكسور وترتيبها. عمل منظم يستحق كل التقدير!',
        badgeColor: 'bg-blue-500 text-white',
      };
    }
    if (percentage >= 60) {
      return {
        title: 'محاولة جيدة جداً! 👍',
        subtitle: 'لديك فهم طيب للكسور. راجع الأسئلة الموضحة بالأسفل لتصل إلى الدرجة الكاملة!',
        badgeColor: 'bg-amber-500 text-white',
      };
    }
    return {
      title: 'بداية مشجعة! تدرب أكثر لتتفوق 💪',
      subtitle: 'الكسور تحتاج تدريباً ممتعاً. راجع النماذج البصرية والتلميحات وحاول مرة أخرى!',
      badgeColor: 'bg-indigo-500 text-white',
    };
  };

  const info = getEncouragement();

  return (
    <div
      id="worksheet-summary-card"
      className="bg-white rounded-3xl p-6 md:p-8 border-3 border-amber-400 shadow-xl space-y-6 text-slate-800 animate-in fade-in"
    >
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 text-center md:text-right">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0">
            <Award className="w-9 h-9 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${info.badgeColor}`}>
                {info.title}
              </span>
              <span className="text-xs text-slate-400 font-bold">تم حفظ نتيجتك بنجاح</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              نتيجة ورقة العمل: {studentName || 'البطل/ة المجهول/ة'}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl">
              {info.subtitle}
            </p>
          </div>
        </div>

        {/* Score Display Card */}
        <div className="bg-linear-to-br from-amber-500 to-amber-600 text-white px-7 py-4 rounded-2xl text-center shadow-md min-w-[170px]">
          <span className="text-xs font-bold text-amber-100 block mb-0.5">الدرجة النهائية</span>
          <div className="flex items-baseline justify-center gap-1 font-math">
            <span className="text-4xl font-black">{score}</span>
            <span className="text-sm font-bold opacity-80">/ {totalScore}</span>
          </div>
          <span className="inline-block mt-1 bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full font-math">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold">إجابات صحيحة</span>
          </div>
          <span className="text-2xl font-black text-emerald-700 font-math">
            {correctCount}
          </span>
          <span className="text-xs text-slate-400 block font-medium">من {totalQuestions} أسئلة</span>
        </div>

        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
          <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-bold">تحتاج مراجعة</span>
          </div>
          <span className="text-2xl font-black text-rose-700 font-math">
            {incorrectCount}
          </span>
          <span className="text-xs text-slate-400 block font-medium">أسئلة</span>
        </div>

        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
          <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold">النسبة المئوية</span>
          </div>
          <span className="text-2xl font-black text-indigo-700 font-math">
            {percentage}%
          </span>
          <span className="text-xs text-slate-400 block font-medium">معدل الإنجاز</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-center gap-1.5 text-slate-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">الوقت المستغرق</span>
          </div>
          <span className="text-2xl font-black text-slate-800 font-math">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <span className="text-xs text-slate-400 block font-medium">دقيقة : ثانية</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة المحاولة لتحسين الدرجة</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('question-1');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>مراجعة الإجابات في الصفحة ⬆️</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenGoogleModal('sheets')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={onOpenTeacherDashboard}
            className="px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>لوحة المعلمة فاليا</span>
          </button>
        </div>
      </div>
    </div>
  );
};
