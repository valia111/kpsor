import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  FileSpreadsheet, 
  Trash2, 
  RotateCcw, 
  Search, 
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { exportSubmissionsToCSV, resetToSampleSubmissions } from '../utils/storage';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmission[];
  onUpdateSubmissions: (subs: StudentSubmission[]) => void;
  onOpenGoogleModal: (tab: 'classroom' | 'sheets') => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  submissions,
  onUpdateSubmissions,
  onOpenGoogleModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSub, setSelectedSub] = useState<StudentSubmission | null>(null);

  if (!isOpen) return null;

  const filteredSubs = submissions.filter((s) =>
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = submissions.length;
  const avgScore =
    totalStudents > 0
      ? Math.round(submissions.reduce((acc, curr) => acc + curr.score, 0) / totalStudents)
      : 0;
  const maxScoreFound = totalStudents > 0 ? Math.max(...submissions.map((s) => s.score)) : 0;
  const masteryRate =
    totalStudents > 0
      ? Math.round(
          (submissions.filter((s) => s.percentage >= 80).length / totalStudents) * 100
        )
      : 0;

  const handleResetSampleData = () => {
    if (window.confirm('هل تريد إعادة تعيين جدول البيانات إلى العينات النموذجية الأولية؟')) {
      const reset = resetToSampleSubmissions();
      onUpdateSubmissions(reset);
    }
  };

  const handleDeleteSubmission = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = submissions.filter((s) => s.id !== id);
    onUpdateSubmissions(updated);
    try {
      localStorage.setItem('valia_grade4_fractions_submissions_v1', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 px-6 py-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl backdrop-blur-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">لوحة المعلمة فاليا</h2>
                <span className="bg-amber-400 text-amber-950 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                  الصف الرابع - مقارنة الكسور
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                جدول البيانات الداخلي وتحليل إتقان مهارات الكسور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenGoogleModal('sheets')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="تصدير إلى Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheets</span>
            </button>
            <button
              onClick={() => onOpenGoogleModal('classroom')}
              className="px-3.5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Google Classroom"
            >
              <ExternalLink className="w-4 h-4" />
              <span>مهمة كلاس روم</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white font-bold transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">إجمالي الطلاب المسجلين</span>
                <span className="text-2xl font-black text-slate-900 font-math">{totalStudents}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">متوسط درجات الصف</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 font-math">{avgScore}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">نسبة الإتقان (80% فأعلى)</span>
                <span className="text-2xl font-black text-emerald-600 font-math">{masteryRate}%</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">أعلى درجة محققة</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-purple-700 font-math">{maxScoreFound}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Database Table Header & Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>جدول بيانات نتائج الطلاب</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    مخزن داخلياً (Internal Storage)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تُحفظ جميع محاولات الطلاب تلقائياً بمجرد تسليم ورقة العمل
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث باسم الطالب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-9 pl-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                  />
                </div>
                <button
                  onClick={() => exportSubmissionsToCSV(submissions)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>تصدير CSV</span>
                </button>
                <button
                  onClick={handleResetSampleData}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  title="استعادة نماذج الطلاب التجريبية"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">اسم الطالب</th>
                    <th className="py-3 px-4">الدرجة</th>
                    <th className="py-3 px-4">النسبة</th>
                    <th className="py-3 px-4">الإجابات الصحيحة</th>
                    <th className="py-3 px-4">الوقت المستغرق</th>
                    <th className="py-3 px-4">وقت التسليم</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        لا توجد نتائج مطابقة للبحث
                      </td>
                    </tr>
                  ) : (
                    filteredSubs.map((sub, idx) => {
                      const minutes = Math.floor(sub.timeSpentSeconds / 60);
                      const seconds = sub.timeSpentSeconds % 60;
                      const isPassing = sub.percentage >= 70;
                      return (
                        <tr
                          key={sub.id}
                          className="hover:bg-indigo-50/40 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-400 font-math font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {sub.studentName}
                          </td>
                          <td className="py-3 px-4 font-math font-bold">
                            <span
                              className={
                                sub.percentage >= 90
                                  ? 'text-emerald-600'
                                  : sub.percentage >= 75
                                  ? 'text-blue-600'
                                  : 'text-amber-600'
                              }
                            >
                              {sub.score}
                            </span>{' '}
                            <span className="text-slate-400 text-[11px]">/ 100</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full font-math font-bold text-[11px] ${
                                sub.percentage >= 90
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sub.percentage >= 75
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {sub.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <span className="font-math font-semibold">{sub.correctCount}</span> من{' '}
                            <span className="font-math font-semibold">{sub.totalQuestions}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-math">
                            {minutes > 0 ? `${minutes}د ${seconds}ث` : `${seconds}ثانية`}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(sub.timestamp).toLocaleTimeString('ar-IL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={(e) => handleDeleteSubmission(sub.id, e)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="حذف هذا السجل"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Curriculum Standards Note */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <div className="p-2 bg-amber-200 text-amber-800 rounded-xl mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 mb-1">
                تطابق المنهاج - وزارة التربية والتعليم (الصف الرابع)
              </h4>
              <p className="leading-relaxed text-amber-800">
                تركز ورقة العمل هذه على المهارات الأساسية لمقارنة الكسور العادية: مقارنة كسور متساوية المقامات، مقارنة كسور متساوية البسوط، والمقارنة بالاستناد إلى الكسور المرجعية (النصف والواحد الكامل)، مدعمة بنماذج أشرطة الكسور والدوائر التمثيلية.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ورقة عمل تفاعلية &copy; إعداد المعلمة فاليا - رياضيات الصف الرابع
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors"
          >
            إغلاق اللوحة
          </button>
        </div>
      </div>
    </div>
  );
};
