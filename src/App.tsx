/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  WORKSHEET_QUESTIONS, 
  WorksheetQuestion 
} from './data/questionsData';
import { 
  getStoredSubmissions, 
  saveSubmission 
} from './utils/storage';
import { StudentSubmission } from './types';
import { WorksheetHeader } from './components/WorksheetHeader';
import { WorksheetQuestionItem } from './components/WorksheetQuestionItem';
import { WorksheetSummary } from './components/WorksheetSummary';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { GoogleIntegrationModal } from './components/GoogleIntegrationModal';
import { 
  Send, 
  Sparkles, 
  AlertCircle, 
  Award, 
  BookOpen, 
  FileSpreadsheet, 
  Users, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // State
  const [studentName, setStudentName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Modals
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [googleModalTab, setGoogleModalTab] = useState<'classroom' | 'sheets'>('classroom');

  // Submissions storage state
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // Load submissions once on mount
  useEffect(() => {
    const loaded = getStoredSubmissions();
    setSubmissions(loaded);
  }, []);

  // Timer: counts seconds while worksheet is active and not submitted
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Handle answers update
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Score calculation
  const totalMaxScore = useMemo(() => {
    return WORKSHEET_QUESTIONS.reduce((acc, q) => acc + q.points, 0);
  }, []);

  const { currentScore, correctCount, answeredCount } = useMemo(() => {
    let score = 0;
    let correct = 0;
    let answered = 0;

    for (const q of WORKSHEET_QUESTIONS) {
      const ans = answers[q.id];
      const hasAnswer = ans !== undefined && ans !== null && ans !== '';
      if (hasAnswer) answered++;

      let isCorrect = false;
      let points = 0;

      switch (q.type) {
        case 'compare_sign':
          isCorrect = ans === q.correctSign;
          points = isCorrect ? q.points : 0;
          break;

        case 'visual_mcq':
          isCorrect = ans === q.correctOptionId;
          points = isCorrect ? q.points : 0;
          break;

        case 'classification':
          if (ans && typeof ans === 'object') {
            const correctItems = q.items.filter(
              (item) => ans[item.id] === item.correctCategoryId
            ).length;
            isCorrect = correctItems === q.items.length;
            points = Math.round((correctItems / q.items.length) * q.points);
          }
          break;

        case 'ordering':
          if (Array.isArray(ans) && ans.length === q.items.length) {
            const target = [...q.items].sort((a, b) => a.val - b.val).map((i) => i.id);
            isCorrect = ans.every((id, idx) => id === target[idx]);
            points = isCorrect ? q.points : 0;
          }
          break;

        case 'matching':
          if (ans && typeof ans === 'object') {
            const matchedCount = q.pairs.filter((p) => ans[p.id] === p.targetId).length;
            isCorrect = matchedCount === q.pairs.length;
            points = Math.round((matchedCount / q.pairs.length) * q.points);
          }
          break;

        case 'true_false':
          isCorrect = ans === q.correctAnswer;
          points = isCorrect ? q.points : 0;
          break;

        case 'multi_compare':
          if (ans && typeof ans === 'object') {
            const cCount = q.items.filter((item) => ans[item.id] === item.correctSign).length;
            isCorrect = cCount === q.items.length;
            points = Math.round((cCount / q.items.length) * q.points);
          }
          break;
      }

      if (isCorrect) correct++;
      score += points;
    }

    return { currentScore: score, correctCount: correct, answeredCount: answered };
  }, [answers]);

  const percentage = Math.round((currentScore / totalMaxScore) * 100);

  // Submit Handler
  const handleSubmitWorksheet = () => {
    if (!studentName.trim()) {
      setNameError('يرجى كتابة اسمك في أعلى الصفحة قبل تسليم ورقة العمل');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setNameError('');

    // Save to internal database table
    const newSubmission: StudentSubmission = {
      id: `sub_${Date.now()}`,
      studentName: studentName.trim(),
      timestamp: new Date().toISOString(),
      score: currentScore,
      maxScore: totalMaxScore,
      percentage,
      answers,
      correctCount,
      totalQuestions: WORKSHEET_QUESTIONS.length,
      timeSpentSeconds,
    };

    const updated = saveSubmission(newSubmission);
    setSubmissions(updated);
    setIsSubmitted(true);

    // Smooth scroll to summary card
    setTimeout(() => {
      const summaryEl = document.getElementById('worksheet-summary-card');
      if (summaryEl) {
        summaryEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Retry / Reset Handler
  const handleRetry = () => {
    if (window.confirm('هل تريد مسح الإجابات والبدء بمحاولة جديدة؟')) {
      setAnswers({});
      setIsSubmitted(false);
      setTimeSpentSeconds(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenGoogleModal = (tab: 'classroom' | 'sheets') => {
    setGoogleModalTab(tab);
    setIsGoogleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/50 via-sky-50/20 to-white pb-16 text-slate-800">
      {/* Container - Single page flow */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Name Error Warning if any */}
        {nameError && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between text-xs md:text-sm text-rose-800 font-bold animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>{nameError}</span>
            </div>
            <button
              onClick={() => setNameError('')}
              className="text-rose-600 hover:text-rose-900 font-black px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Worksheet Header */}
        <WorksheetHeader
          studentName={studentName}
          onStudentNameChange={(name) => {
            setStudentName(name);
            if (nameError) setNameError('');
          }}
          answeredCount={answeredCount}
          totalQuestions={WORKSHEET_QUESTIONS.length}
          currentScore={currentScore}
          totalScore={totalMaxScore}
          onOpenGoogleModal={handleOpenGoogleModal}
          onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        />

        {/* 2. Questions Container (All questions displayed on the SAME page at once) */}
        <main className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-lg font-black text-slate-900">
                أسئلة ورقة العمل ({WORKSHEET_QUESTIONS.length} أسئلة)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              جميع الأسئلة معروضة في نفس الصفحة دفعة واحدة
            </span>
          </div>

          {WORKSHEET_QUESTIONS.map((question) => (
            <WorksheetQuestionItem
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswerChange={handleAnswerChange}
              isSubmitted={isSubmitted}
            />
          ))}
        </main>

        {/* 3. Submit Action Bar or Result Summary */}
        {!isSubmitted ? (
          <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-3xl border-2 border-amber-300 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    هل أتممت الإجابة على جميع الأسئلة؟
                  </span>
                  <span className="text-xs font-math font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {answeredCount} من {WORKSHEET_QUESTIONS.length}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  اضغط على زر التسليم لحساب نتيجتك وحفظ المحاولة في جدول بيانات المعلمة فاليا.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSubmitWorksheet}
                className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center gap-2 transition-all transform hover:scale-102 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>تسليم ورقة العمل والنتيجة</span>
              </button>
            </div>
          </div>
        ) : (
          <WorksheetSummary
            studentName={studentName}
            score={currentScore}
            totalScore={totalMaxScore}
            percentage={percentage}
            correctCount={correctCount}
            totalQuestions={WORKSHEET_QUESTIONS.length}
            timeSpentSeconds={timeSpentSeconds}
            onRetry={handleRetry}
            onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
            onOpenGoogleModal={handleOpenGoogleModal}
          />
        )}

        {/* 4. Footer */}
        <footer className="pt-6 border-t border-slate-200 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span>ورقة عمل رقمية تفاعلية لمقارنة الكسور</span>
            <span>&bull;</span>
            <span>إعداد المعلمة: فاليا</span>
            <span>&bull;</span>
            <span>الصف: الرابع الابتدائي</span>
            <span>&bull;</span>
            <span>وزارة التربية والتعليم</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => handleOpenGoogleModal('classroom')}
              className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>مشاركة في Google Classroom</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleOpenGoogleModal('sheets')}
              className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير لـ Google Sheets</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsTeacherDashboardOpen(true)}
              className="text-xs text-indigo-700 hover:underline font-bold flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>لوحة المعلمة وسجل الطلاب</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Teacher Dashboard Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        submissions={submissions}
        onUpdateSubmissions={setSubmissions}
        onOpenGoogleModal={handleOpenGoogleModal}
      />

      {/* Google Classroom & Sheets Modal */}
      <GoogleIntegrationModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        defaultTab={googleModalTab}
      />
    </div>
  );
}
