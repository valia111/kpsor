import React from 'react';
import { 
  User, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  FileSpreadsheet, 
  ExternalLink,
  Users
} from 'lucide-react';

interface WorksheetHeaderProps {
  studentName: string;
  onStudentNameChange: (name: string) => void;
  answeredCount: number;
  totalQuestions: number;
  currentScore: number;
  totalScore: number;
  onOpenGoogleModal: (tab: 'classroom' | 'sheets') => void;
  onOpenTeacherDashboard: () => void;
}

export const WorksheetHeader: React.FC<WorksheetHeaderProps> = ({
  studentName,
  onStudentNameChange,
  answeredCount,
  totalQuestions,
  currentScore,
  totalScore,
  onOpenGoogleModal,
  onOpenTeacherDashboard,
}) => {
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <header className="bg-white rounded-3xl p-5 md:p-7 border-2 border-amber-200/80 shadow-sm space-y-5">
      {/* Top Banner & Quick Teacher Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            وزارة التربية والتعليم &bull; منهاج الرياضيات
          </span>
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            الصف: الرابع الابتدائي
          </span>
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            المعلمة: فاليا
          </span>
        </div>

        {/* Integration Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenGoogleModal('classroom')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="إنشاء تكليف في Google Classroom"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>مهمة كلاس روم</span>
          </button>

          <button
            onClick={() => onOpenGoogleModal('sheets')}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="فتح Google Sheets وحفظ النتائج"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={onOpenTeacherDashboard}
            className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="فتح لوحة المعلمة فاليا وجدول البيانات"
          >
            <Users className="w-3.5 h-3.5" />
            <span>لوحة المعلم والنتائج</span>
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          ورقة عمل تفاعلية: مقارنة الكسور العادية
        </h1>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-3xl">
          أهلاً بك يا بطل الرياضيات! أمامك 8 أسئلة ممتعة لمقارنة الكسور باستخدام النماذج البصرية والكسور المرجعية. جميع الأسئلة معروضة أمامك في هذه الصفحة دفعة واحدة دون الحاجة للانتقال لصفحات أخرى.
        </p>
      </div>

      {/* Student Name Input & Progress Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-2">
        {/* Student Name */}
        <div className="lg:col-span-5 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
          <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1.5">
            <User className="w-4 h-4 text-amber-600" />
            <span>اكتب اسمك الثلاثي للبدء بالنشاط:</span>
            <span className="text-rose-500 font-black">*</span>
          </label>
          <input
            type="text"
            placeholder="مثال: يوسف أحمد سليم..."
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Real-time Progress & Points Bar */}
        <div className="lg:col-span-7 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">تقدم الحل:</span>
              <span className="font-math font-bold text-indigo-700 text-sm">
                {answeredCount} / {totalQuestions}
              </span>
              <span className="text-slate-400">أسئلة</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">النقاط الحالية:</span>
              <span className="font-math font-black text-emerald-600 text-base">
                {currentScore}
              </span>
              <span className="text-slate-400 text-xs">/ {totalScore}</span>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-amber-400 via-emerald-500 to-indigo-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
