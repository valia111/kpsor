import { StudentSubmission } from '../types';

const STORAGE_KEY = 'valia_grade4_fractions_submissions_v1';

export const INITIAL_SAMPLE_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub_1',
    studentName: 'سارة أحمد',
    timestamp: '2026-09-19T08:15:00.000Z',
    score: 100,
    maxScore: 100,
    percentage: 100,
    correctCount: 8,
    totalQuestions: 8,
    timeSpentSeconds: 240,
    answers: {},
  },
  {
    id: 'sub_2',
    studentName: 'يوسف كريم',
    timestamp: '2026-09-19T08:30:00.000Z',
    score: 92,
    maxScore: 100,
    percentage: 92,
    correctCount: 7,
    totalQuestions: 8,
    timeSpentSeconds: 310,
    answers: {},
  },
  {
    id: 'sub_3',
    studentName: 'مريم خليل',
    timestamp: '2026-09-19T08:45:00.000Z',
    score: 84,
    maxScore: 100,
    percentage: 84,
    correctCount: 6,
    totalQuestions: 8,
    timeSpentSeconds: 280,
    answers: {},
  },
  {
    id: 'sub_4',
    studentName: 'آدم عمر',
    timestamp: '2026-09-19T09:00:00.000Z',
    score: 76,
    maxScore: 100,
    percentage: 76,
    correctCount: 5,
    totalQuestions: 8,
    timeSpentSeconds: 420,
    answers: {},
  },
  {
    id: 'sub_5',
    studentName: 'تالا زياد',
    timestamp: '2026-09-19T09:12:00.000Z',
    score: 96,
    maxScore: 100,
    percentage: 96,
    correctCount: 8,
    totalQuestions: 8,
    timeSpentSeconds: 195,
    answers: {},
  },
];

export function getStoredSubmissions(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial sample submissions
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SUBMISSIONS));
      return INITIAL_SAMPLE_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SAMPLE_SUBMISSIONS;
  } catch (err) {
    console.error('Failed to read submissions from storage', err);
    return INITIAL_SAMPLE_SUBMISSIONS;
  }
}

export function saveSubmission(submission: StudentSubmission): StudentSubmission[] {
  try {
    const current = getStoredSubmissions();
    const updated = [submission, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save submission', err);
    return getStoredSubmissions();
  }
}

export function clearSubmissions(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear submissions', err);
  }
}

export function resetToSampleSubmissions(): StudentSubmission[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SUBMISSIONS));
    return INITIAL_SAMPLE_SUBMISSIONS;
  } catch (err) {
    return INITIAL_SAMPLE_SUBMISSIONS;
  }
}

/**
 * Exports submissions to CSV format with UTF-8 BOM so Arabic names display cleanly
 * in Google Sheets and Microsoft Excel.
 */
export function exportSubmissionsToCSV(submissions: StudentSubmission[]): void {
  const headers = [
    'اسم الطالب',
    'الدرجة',
    'الدرجة القصوى',
    'النسبة المئوية',
    'الإجابات الصحيحة',
    'إجمالي الأسئلة',
    'الوقت المستغرق (دقيقة)',
    'تاريخ ووقت المحاولة',
  ];

  const rows = submissions.map((sub) => {
    const dateStr = new Date(sub.timestamp).toLocaleString('ar-IL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const minutes = Math.round(sub.timeSpentSeconds / 60);
    return [
      `"${sub.studentName.replace(/"/g, '""')}"`,
      sub.score,
      sub.maxScore,
      `"${sub.percentage}%"`,
      sub.correctCount,
      sub.totalQuestions,
      minutes,
      `"${dateStr}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `نتائج_الطلاب_مقارنة_الكسور_الصف_الرابع_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
