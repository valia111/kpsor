export type ComparisonOperator = '>' | '<' | '=';

export interface FractionValue {
  num: number;
  den: number;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  timestamp: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: Record<string, any>;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
}

export type QuestionType =
  | 'compare_sign'         // ضع إشارة > أو < أو =
  | 'visual_mcq'            // اختيار الكسر الأكبر مع تمثيل بصري
  | 'ordering'              // ترتيب كسور تصاعدياً
  | 'classification'        // تصنيف حسب الكسر المرجعي (نصف / واحد)
  | 'matching'              // مطابقة الكسر مع المقارنة المناسبة
  | 'true_false';           // صح أو خطأ مع تعليل رياضي
