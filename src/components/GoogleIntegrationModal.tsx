import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Share2, FileSpreadsheet, Sparkles, BookOpen } from 'lucide-react';
import { exportSubmissionsToCSV, getStoredSubmissions } from '../utils/storage';

interface GoogleIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'classroom' | 'sheets';
}

export const GoogleIntegrationModal: React.FC<GoogleIntegrationModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'classroom',
}) => {
  const [activeTab, setActiveTab] = useState<'classroom' | 'sheets'>(defaultTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : '';
  const classroomShareUrl = `https://classroom.google.com/share?url=${encodeURIComponent(
    currentAppUrl
  )}&title=${encodeURIComponent('ورقة عمل تفاعلية: مقارنة الكسور - الصف الرابع (إعداد المعلمة فاليا)')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportSheets = () => {
    const subs = getStoredSubmissions();
    exportSubmissionsToCSV(subs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-amber-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">الربط مع خدمات Google التعليمية</h3>
              <p className="text-xs text-amber-100">Google Classroom و Google Sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('classroom')}
            className={`flex-1 py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'classroom'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Google Classroom</span>
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'sheets'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Sheets</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm">
          {activeTab === 'classroom' ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-lg mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">إنشاء مهمة أو تكليف مباشر في كلاس روم</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    يمكنك مشاركة ورقة العمل كواجب أو مادة تفاعلية لطلاب الصف الرابع بنقرة واحدة مباشرة إلى حسابك التعليمي.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">رابط ورقة العمل للمشاركة:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentAppUrl}
                    className="flex-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={classroomShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح Google Classroom لإنشاء المهمة فوراً</span>
                </a>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  سيتم توجيهك إلى صفحة المشاركة الرسمية التابعة لـ Google Classroom.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-lg mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">تصدير وحفظ نتائج الطلاب في Google Sheets</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    يتم تخزين جميع محاولات ودرجات الطلاب في قاعدة البيانات الداخلية. يمكنك تنزيل ملف CSV المنسق باللغة العربية والمجهز للاستيراد في جداول بيانات Google.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">تنزيل ملف البيانات المتوافق (CSV):</span>
                  <button
                    onClick={handleExportSheets}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>تنزيل النتائج (CSV)</span>
                  </button>
                </div>
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">إنشاء جدول بيانات جديد في حسابك:</span>
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح Google Sheets (جديد)</span>
                  </a>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800">
                💡 <strong>خطوة سريعة للمعلمة فاليا:</strong> بعد النقر على "تنزيل النتائج"، افتحي Google Sheets واختاري:
                <br />
                <span className="font-mono text-[11px] text-amber-900">ملف &gt; استيراد &gt; تحميل الملف (File &gt; Import &gt; Upload)</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
