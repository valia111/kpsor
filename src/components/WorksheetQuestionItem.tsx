import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw,
  Tag
} from 'lucide-react';
import { 
  WorksheetQuestion, 
  CompareSignQuestion, 
  VisualMCQQuestion, 
  ClassificationQuestion, 
  OrderingQuestion, 
  MatchingQuestion, 
  TrueFalseQuestion, 
  MultiCompareQuestion 
} from '../data/questionsData';
import { Fraction } from './Fraction';
import { FractionBar, FractionPie } from './FractionVisual';

interface WorksheetQuestionItemProps {
  question: WorksheetQuestion;
  answer: any;
  onAnswerChange: (questionId: string, value: any) => void;
  isSubmitted: boolean;
}

export const WorksheetQuestionItem: React.FC<WorksheetQuestionItemProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted,
}) => {
  const [showHint, setShowHint] = useState(false);

  // Compute correctness
  const isAnswered = answer !== undefined && answer !== null && answer !== '';
  let isCorrect = false;
  let pointsEarned = 0;

  switch (question.type) {
    case 'compare_sign':
      isCorrect = answer === question.correctSign;
      pointsEarned = isCorrect ? question.points : 0;
      break;

    case 'visual_mcq':
      isCorrect = answer === question.correctOptionId;
      pointsEarned = isCorrect ? question.points : 0;
      break;

    case 'classification': {
      // answer is Record<string, string> mapping itemId -> categoryId
      if (answer && typeof answer === 'object') {
        const correctItems = question.items.filter(
          (item) => answer[item.id] === item.correctCategoryId
        ).length;
        isCorrect = correctItems === question.items.length;
        pointsEarned = Math.round((correctItems / question.items.length) * question.points);
      }
      break;
    }

    case 'ordering': {
      // answer is array of item IDs in chosen order
      if (Array.isArray(answer) && answer.length === question.items.length) {
        const targetOrder = [...question.items]
          .sort((a, b) => a.val - b.val)
          .map((i) => i.id);
        isCorrect = answer.every((id, idx) => id === targetOrder[idx]);
        pointsEarned = isCorrect ? question.points : 0;
      }
      break;
    }

    case 'matching': {
      // answer is Record<string, string> mapping pairId -> targetId
      if (answer && typeof answer === 'object') {
        const correctCount = question.pairs.filter(
          (p) => answer[p.id] === p.targetId
        ).length;
        isCorrect = correctCount === question.pairs.length;
        pointsEarned = Math.round((correctCount / question.pairs.length) * question.points);
      }
      break;
    }

    case 'true_false':
      isCorrect = answer === question.correctAnswer;
      pointsEarned = isCorrect ? question.points : 0;
      break;

    case 'multi_compare': {
      if (answer && typeof answer === 'object') {
        const correctCount = question.items.filter(
          (item) => answer[item.id] === item.correctSign
        ).length;
        isCorrect = correctCount === question.items.length;
        pointsEarned = Math.round((correctCount / question.items.length) * question.points);
      }
      break;
    }
  }

  return (
    <div
      id={`question-${question.number}`}
      className={`bg-white rounded-3xl p-5 md:p-7 border-2 transition-all duration-300 shadow-sm ${
        isAnswered
          ? isCorrect
            ? 'border-emerald-300 ring-4 ring-emerald-50'
            : isSubmitted
            ? 'border-rose-300 ring-4 ring-rose-50'
            : 'border-blue-300 ring-4 ring-blue-50'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs font-math">
            {question.number}
          </span>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 leading-snug">
              {question.title}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              رياضيات الصف الرابع &bull; مقارنة الكسور
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'إخفاء التلميح' : 'تلميح ذكي'}</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1">
            <span className="text-slate-400">النقاط:</span>
            <span className="text-indigo-600 font-math text-sm">{question.points}</span>
          </div>
        </div>
      </div>

      {/* Optional Hint Box */}
      {showHint && (
        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{question.hint}</p>
        </div>
      )}

      {/* Question Body by Type */}
      <div className="my-3">
        {question.type === 'compare_sign' && (
          <CompareSignView
            q={question}
            value={answer}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}

        {question.type === 'visual_mcq' && (
          <VisualMCQView
            q={question}
            value={answer}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}

        {question.type === 'classification' && (
          <ClassificationView
            q={question}
            value={answer || {}}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}

        {question.type === 'ordering' && (
          <OrderingView
            q={question}
            value={answer}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}

        {question.type === 'matching' && (
          <MatchingView
            q={question}
            value={answer || {}}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}

        {question.type === 'true_false' && (
          <TrueFalseView
            q={question}
            value={answer}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}

        {question.type === 'multi_compare' && (
          <MultiCompareView
            q={question}
            value={answer || {}}
            onChange={(val) => onAnswerChange(question.id, val)}
          />
        )}
      </div>

      {/* Immediate Feedback Bar */}
      {isAnswered && (
        <div
          className={`mt-5 p-4 rounded-2xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all animate-in fade-in ${
            isCorrect
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <strong className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {isCorrect ? 'إجابة صحيحة ورائعة!' : 'توضيح تربوي للمراجعة:'}
                </strong>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-math font-bold bg-white/80">
                  {pointsEarned} / {question.points} نقطة
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-normal">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 1. Compare Sign View (> , < , =)
 * ------------------------------------------------------------- */
const CompareSignView: React.FC<{
  q: CompareSignQuestion;
  value: string;
  onChange: (val: string) => void;
}> = ({ q, value, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Visual Models Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">الكسر الأول:</span>
            <Fraction num={q.leftFraction.num} den={q.leftFraction.den} size="xl" className="text-blue-600" />
          </div>
          <FractionBar
            num={q.leftFraction.num}
            den={q.leftFraction.den}
            color="blue"
            label={`${q.leftFraction.num} أجزاء ملونة من أصل ${q.leftFraction.den}`}
          />
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">الكسر الثاني:</span>
            <Fraction num={q.rightFraction.num} den={q.rightFraction.den} size="xl" className="text-emerald-600" />
          </div>
          <FractionBar
            num={q.rightFraction.num}
            den={q.rightFraction.den}
            color="emerald"
            label={`${q.rightFraction.num} أجزاء ملونة من أصل ${q.rightFraction.den}`}
          />
        </div>
      </div>

      {/* Comparison Slot & Interactive Buttons */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-2">
        <div className="text-xs font-bold text-slate-600">
          اختر الإشارة المناسبة لوضعها في المربع بين الكسرين:
        </div>

        {/* The Equation row */}
        <div className="flex items-center justify-center gap-4 bg-amber-100/50 px-6 py-4 rounded-2xl border border-amber-200 shadow-xs">
          <Fraction num={q.leftFraction.num} den={q.leftFraction.den} size="xl" className="text-blue-700" />

          {/* Slot */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-math text-3xl font-extrabold shadow-inner transition-all ${
              value
                ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 scale-105'
                : 'bg-white border-2 border-dashed border-amber-300 text-slate-400'
            }`}
          >
            {value || '؟'}
          </div>

          <Fraction num={q.rightFraction.num} den={q.rightFraction.den} size="xl" className="text-emerald-700" />
        </div>

        {/* 3 Buttons */}
        <div className="flex items-center gap-3">
          {(['>', '=', '<'] as const).map((sign) => {
            const isSelected = value === sign;
            return (
              <button
                key={sign}
                onClick={() => onChange(sign)}
                className={`w-16 h-14 rounded-2xl font-math text-2xl font-black transition-all duration-150 flex items-center justify-center shadow-sm cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white scale-105 ring-4 ring-blue-200'
                    : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {sign}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. Visual MCQ View
 * ------------------------------------------------------------- */
const VisualMCQView: React.FC<{
  q: VisualMCQQuestion;
  value: string;
  onChange: (val: string) => void;
}> = ({ q, value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between">
        <p className="font-bold text-slate-800 text-sm">{q.instruction}</p>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-amber-200">
          <span className="text-xs font-medium text-slate-500">الكسر المرجعي:</span>
          <Fraction num={1} den={2} size="md" className="text-amber-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
        {q.options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 ring-4 ring-indigo-100 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <FractionPie num={opt.num} den={opt.den} size={64} color={isSelected ? '#4f46e5' : '#0ea5e9'} />
              <Fraction num={opt.num} den={opt.den} size="lg" className="text-slate-900" />
              <span
                className={`w-full py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isSelected ? 'تم الاختيار ✓' : 'اختيار هذا الكسر'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. Classification View (Baskets)
 * ------------------------------------------------------------- */
const ClassificationView: React.FC<{
  q: ClassificationQuestion;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}> = ({ q, value, onChange }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleClassify = (itemId: string, catId: string) => {
    const updated = { ...value, [itemId]: catId };
    onChange(updated);
    setSelectedItemId(null);
  };

  const handleResetItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...value };
    delete updated[itemId];
    onChange(updated);
  };

  // Group items by assigned category
  const unassigned = q.items.filter((item) => !value[item.id]);

  return (
    <div className="space-y-6">
      {/* Instruction */}
      <div className="text-xs text-slate-600 flex items-center justify-between">
        <span>انقر على الكسر لاختياره، ثم انقر على السلة المناسبة لتصنيفه:</span>
        <button
          onClick={() => onChange({})}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ضبط السلال</span>
        </button>
      </div>

      {/* Unassigned Chips Pool */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="text-xs font-bold text-slate-500 mb-2">
          الكسور بانتظار التصنيف ({unassigned.length} متبقية):
        </div>
        {unassigned.length === 0 ? (
          <div className="text-center py-2 text-emerald-600 font-bold text-xs flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>رائع! قمت بتصنيف جميع الكسور الستة في السلال.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {unassigned.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                  className={`px-4 py-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 border-amber-500 scale-105 shadow-md'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <Fraction num={item.num} den={item.den} size="md" />
                  <span className="text-[11px] font-bold text-slate-500">
                    {isSelected ? 'اضغط السلة ➔' : 'اخترني'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3 Baskets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {q.categories.map((cat) => {
          const itemsInCat = q.items.filter((item) => value[item.id] === cat.id);
          const isTargetForSelection = selectedItemId !== null;

          return (
            <div
              key={cat.id}
              onClick={() => {
                if (selectedItemId) {
                  handleClassify(selectedItemId, cat.id);
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all min-h-40 flex flex-col justify-between ${
                isTargetForSelection
                  ? 'border-dashed border-amber-400 bg-amber-50/40 cursor-pointer hover:bg-amber-100/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900">{cat.title}</h4>
                  <span className="text-[10px] font-math font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {itemsInCat.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">{cat.description}</p>

                {/* Items in this basket */}
                <div className="flex flex-wrap gap-2">
                  {itemsInCat.map((item) => (
                    <div
                      key={item.id}
                      className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-1.5 text-xs text-indigo-900"
                    >
                      <Fraction num={item.num} den={item.den} size="sm" />
                      <button
                        onClick={(e) => handleResetItem(item.id, e)}
                        className="text-slate-400 hover:text-rose-600 text-xs px-1"
                        title="إرجاع"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {itemsInCat.length === 0 && (
                    <span className="text-[11px] text-slate-300 italic">السلة فارغة حالياً</span>
                  )}
                </div>
              </div>

              {isTargetForSelection && (
                <div className="mt-3 pt-2 border-t border-amber-200 text-center">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                    + ضع الكسر المحدد هنا
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. Ordering View (Ascending / Descending)
 * ------------------------------------------------------------- */
const OrderingView: React.FC<{
  q: OrderingQuestion;
  value: string[];
  onChange: (val: string[]) => void;
}> = ({ q, value, onChange }) => {
  // Initialize order if empty
  const currentOrder =
    Array.isArray(value) && value.length === q.items.length
      ? value
      : q.items.map((i) => i.id);

  const moveItem = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;

    const copy = [...currentOrder];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-sky-900">{q.instruction}</span>
        <span className="text-sky-700 bg-white px-2.5 py-1 rounded-xl border border-sky-200 font-bold">
          اتجاه الترتيب: من اليمين (الأصغر) ➔ إلى اليسار (الأكبر)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2" dir="ltr">
        {currentOrder.map((id, index) => {
          const item = q.items.find((i) => i.id === id)!;
          return (
            <div
              key={id}
              className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-col items-center text-center shadow-xs transition-transform"
            >
              <span className="text-xs font-bold text-slate-400 mb-2 font-math">
                #{index + 1}
              </span>
              <FractionPie num={item.num} den={item.den} size={56} color="#0284c7" />
              <div className="my-3">
                <Fraction num={item.num} den={item.den} size="xl" className="text-slate-900" />
              </div>

              {/* Move arrows */}
              <div className="flex items-center gap-1 mt-auto w-full justify-center">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, 'left')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="تحريك لليسار"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === currentOrder.length - 1}
                  onClick={() => moveItem(index, 'right')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="تحريك لليمين"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. Matching View (Pairs)
 * ------------------------------------------------------------- */
const MatchingView: React.FC<{
  q: MatchingQuestion;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}> = ({ q, value, onChange }) => {
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);

  const colors = ['bg-blue-100 border-blue-400 text-blue-900', 'bg-emerald-100 border-emerald-400 text-emerald-900', 'bg-purple-100 border-purple-400 text-purple-900', 'bg-amber-100 border-amber-400 text-amber-900'];

  const handleMatch = (pairId: string, targetId: string) => {
    onChange({ ...value, [pairId]: targetId });
    setSelectedPairId(null);
  };

  const handleUnmatch = (pairId: string) => {
    const copy = { ...value };
    delete copy[pairId];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-600">
        انقر أولاً على الكسر في العمود الأيمن، ثم انقر على الوصف المطابق له في العمود الأيسر:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Column: Fractions */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-500 block mb-1">العمود (أ) - الكسور:</span>
          {q.pairs.map((p, idx) => {
            const isSelected = selectedPairId === p.id;
            const isMatched = !!value[p.id];
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPairId(isSelected ? null : p.id)}
                className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100'
                    : isMatched
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-math text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <Fraction num={p.fraction.num} den={p.fraction.den} size="lg" />
                </div>
                {isMatched ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    تم التوصيل ✓
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {isSelected ? 'اختر الوصف ➔' : 'انقر للتوصيل'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Left Column: Target Descriptions */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-500 block mb-1">العمود (ب) - الأوصاف:</span>
          {q.pairs.map((p) => {
            const matchedPairId = Object.keys(value).find((k) => value[k] === p.targetId);
            const matchedPair = matchedPairId ? q.pairs.find((item) => item.id === matchedPairId) : null;

            return (
              <div
                key={p.targetId}
                onClick={() => {
                  if (selectedPairId) {
                    handleMatch(selectedPairId, p.targetId);
                  }
                }}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  selectedPairId
                    ? 'border-dashed border-indigo-400 bg-indigo-50/30 cursor-pointer hover:bg-indigo-100/50'
                    : matchedPair
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-xs md:text-sm font-bold text-slate-800">
                  {p.targetText}
                </span>

                {matchedPair ? (
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-1">
                      <span>متصل بـ:</span>
                      <Fraction num={matchedPair.fraction.num} den={matchedPair.fraction.den} size="sm" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnmatch(matchedPair.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                      title="فك الارتباط"
                    >
                      ✕
                    </button>
                  </div>
                ) : selectedPairId ? (
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    + توصيل هنا
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 6. True / False View
 * ------------------------------------------------------------- */
const TrueFalseView: React.FC<{
  q: TrueFalseQuestion;
  value: boolean;
  onChange: (val: boolean) => void;
}> = ({ q, value, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Statement Card */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 p-4 md:p-5 rounded-2xl border border-amber-200 space-y-3">
        <p className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">
          {q.statement}
        </p>

        {q.statementDetails && (
          <div className="flex items-center justify-center gap-6 pt-2 bg-white/70 py-3 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2">
              <Fraction num={q.statementDetails.fractionA.num} den={q.statementDetails.fractionA.den} size="lg" className="text-amber-700" />
              <span className="text-xs text-slate-500 font-medium">(أخماس)</span>
            </div>
            <span className="text-slate-400 font-bold">مقابل</span>
            <div className="flex items-center gap-2">
              <Fraction num={q.statementDetails.fractionB.num} den={q.statementDetails.fractionB.den} size="lg" className="text-blue-700" />
              <span className="text-xs text-slate-500 font-medium">(أسباع)</span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <button
          onClick={() => onChange(true)}
          className={`py-4 px-6 rounded-2xl border-2 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            value === true
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-4 ring-emerald-100 scale-102'
              : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>صح (الادعاء صحيح)</span>
        </button>

        <button
          onClick={() => onChange(false)}
          className={`py-4 px-6 rounded-2xl border-2 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            value === false
              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-4 ring-rose-100 scale-102'
              : 'bg-white text-slate-700 border-slate-300 hover:border-rose-400 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-5 h-5" />
          <span>خطأ (الادعاء غير صحيح)</span>
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 7. Multi Compare View (Against 1)
 * ------------------------------------------------------------- */
const MultiCompareView: React.FC<{
  q: MultiCompareQuestion;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}> = ({ q, value, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {q.items.map((item, idx) => {
        const sign = value[item.id];
        return (
          <div
            key={item.id}
            className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3"
          >
            <span className="text-xs font-bold text-slate-500">
              الفقرة ({idx === 0 ? 'أ' : 'ب'}):
            </span>

            <div className="flex items-center gap-3">
              <Fraction num={item.left.num} den={item.left.den} size="xl" className="text-indigo-700" />
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-math text-2xl font-black ${
                  sign
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border-2 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {sign || '؟'}
              </div>
              <span className="text-2xl font-math font-black text-slate-900 px-3">
                {typeof item.right === 'number' ? item.right : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {(['>', '=', '<'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onChange({ ...value, [item.id]: s })}
                  className={`w-12 h-10 rounded-xl font-math text-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                    sign === s
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-indigo-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
