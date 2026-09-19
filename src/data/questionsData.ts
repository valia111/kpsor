export interface BaseQuestion {
  id: string;
  number: number;
  title: string;
  hint: string;
  points: number;
  explanation: string;
}

export interface CompareSignQuestion extends BaseQuestion {
  type: 'compare_sign';
  leftFraction: { num: number; den: number };
  rightFraction: { num: number; den: number };
  correctSign: '>' | '<' | '=';
  visualType?: 'bar' | 'pie';
}

export interface VisualMCQQuestion extends BaseQuestion {
  type: 'visual_mcq';
  instruction: string;
  options: Array<{
    id: string;
    num: number;
    den: number;
    explanation?: string;
  }>;
  correctOptionId: string;
}

export interface ClassificationQuestion extends BaseQuestion {
  type: 'classification';
  categories: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  items: Array<{
    id: string;
    num: number;
    den: number;
    correctCategoryId: string;
  }>;
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  instruction: string;
  direction: 'ascending' | 'descending'; // تصاعدياً أو تنازلياً
  items: Array<{
    id: string;
    num: number;
    den: number;
    val: number;
  }>;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: Array<{
    id: string;
    fraction: { num: number; den: number };
    targetText: string;
    targetId: string;
  }>;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  statement: string;
  statementDetails?: {
    fractionA: { num: number; den: number };
    fractionB: { num: number; den: number };
  };
  correctAnswer: boolean;
}

export interface MultiCompareQuestion extends BaseQuestion {
  type: 'multi_compare';
  items: Array<{
    id: string;
    left: { num: number; den: number };
    right: { num: number; den: number } | number; // e.g. 1
    correctSign: '>' | '<' | '=';
  }>;
}

export type WorksheetQuestion =
  | CompareSignQuestion
  | VisualMCQQuestion
  | ClassificationQuestion
  | OrderingQuestion
  | MatchingQuestion
  | TrueFalseQuestion
  | MultiCompareQuestion;

export const WORKSHEET_QUESTIONS: WorksheetQuestion[] = [
  {
    id: 'q1',
    number: 1,
    type: 'compare_sign',
    title: 'مقارنة كسرين لهما نفس المقام (الأجزاء متساوية الحجم)',
    hint: 'لاحظ النماذج الشريطية: إذا كان للكسرين نفس المقام، فالكسر ذو البسط الأكبر هو الكسر الأكبر.',
    points: 12,
    leftFraction: { num: 3, den: 6 },
    rightFraction: { num: 5, den: 6 },
    correctSign: '<',
    visualType: 'bar',
    explanation: 'المقامان متساويان (6). نقارن بين البسطين: 3 أصغر من 5، لذلك 3 أسداس أصغر من 5 أسداس.',
  },
  {
    id: 'q2',
    number: 2,
    type: 'compare_sign',
    title: 'مقارنة كسرين لهما نفس البسط (عدد الأجزاء متساوٍ)',
    hint: 'لاحظ أن قطعة الربع أكبر من قطعة الثمن! إذا تساوى البسطان، فالكسر ذو المقام الأصغر هو الأكبر.',
    points: 12,
    leftFraction: { num: 3, den: 4 },
    rightFraction: { num: 3, den: 8 },
    correctSign: '>',
    visualType: 'bar',
    explanation: 'البسطان متساويان (3). كل جزء من الربع أكبر من جزء الثمن، لذلك 3 أرباع أكبر من 3 أثمان.',
  },
  {
    id: 'q3',
    number: 3,
    type: 'visual_mcq',
    title: 'المقارنة بالنسبة للكسر المرجعي: النصف',
    hint: 'تذكر: نصف المقام 8 هو 4. أي كسر بسطه أكبر من نصف مقامه؟',
    points: 12,
    instruction: 'أي من الكسور التالية هو كسر **أكبر من النصف**؟',
    options: [
      { id: 'opt_a', num: 2, den: 6, explanation: '2 أصغر من نصف 6 (3)، فهو أصغر من النصف' },
      { id: 'opt_b', num: 4, den: 8, explanation: '4 تساوي تماماً نصف 8، فهو يساوي النصف' },
      { id: 'opt_c', num: 5, den: 8, explanation: '5 أكبر من نصف 8 (4)، فهو أكبر من النصف!' },
      { id: 'opt_d', num: 1, den: 4, explanation: '1 أصغر من نصف 4 (2)، فهو أصغر من النصف' },
    ],
    correctOptionId: 'opt_c',
    explanation: 'في الكسر 5 على 8: نصف المقام (8) هو 4. وبما أن البسط 5 أكبر من 4، فالكسر أكبر من النصف.',
  },
  {
    id: 'q4',
    number: 4,
    type: 'classification',
    title: 'تصنيف الكسور في السلال بالنسبة للكسر المرجعي (النصف)',
    hint: 'انقر على كسر ثم انقر على السلة المناسبة لتصنيفه.',
    points: 18,
    categories: [
      { id: 'cat_less', title: 'أصغر من النصف', description: 'البسط أصغر من نصف المقام' },
      { id: 'cat_equal', title: 'يساوي النصف تماماً', description: 'البسط يساوي نصف المقام' },
      { id: 'cat_greater', title: 'أكبر من النصف', description: 'البسط أكبر من نصف المقام' },
    ],
    items: [
      { id: 'c1', num: 1, den: 6, correctCategoryId: 'cat_less' },     // 1 < 3
      { id: 'c2', num: 3, den: 6, correctCategoryId: 'cat_equal' },    // 3 = 3
      { id: 'c3', num: 5, den: 6, correctCategoryId: 'cat_greater' },  // 5 > 3
      { id: 'c4', num: 2, den: 10, correctCategoryId: 'cat_less' },    // 2 < 5
      { id: 'c5', num: 5, den: 10, correctCategoryId: 'cat_equal' },   // 5 = 5
      { id: 'c6', num: 7, den: 10, correctCategoryId: 'cat_greater' }, // 7 > 5
    ],
    explanation: 'نصف 6 هو 3 (لذلك 1/6 أصغر، 3/6 يساوي، 5/6 أكبر)، ونصف 10 هو 5 (لذلك 2/10 أصغر، 5/10 يساوي، 7/10 أكبر).',
  },
  {
    id: 'q5',
    number: 5,
    type: 'ordering',
    title: 'ترتيب كسور الوحدة تصاعدياً (من الأصغر إلى الأكبر)',
    hint: 'كسور الوحدة بسطها 1 دائماً. كلما قسّمنا الكعكة إلى أجزاء أكثر (مقام أكبر)، أصبح الجزء الواحد أصغر!',
    points: 12,
    instruction: 'رتّب الكسور التالية تصاعدياً من الأصغر إلى الأكبر بالنقر على الترتيب:',
    direction: 'ascending',
    items: [
      { id: 'ord_1', num: 1, den: 10, val: 0.1 },
      { id: 'ord_2', num: 1, den: 5, val: 0.2 },
      { id: 'ord_3', num: 1, den: 3, val: 0.333 },
      { id: 'ord_4', num: 1, den: 2, val: 0.5 },
    ],
    explanation: 'الترتيب التصاعدي الصحيح: 1/10 أصغرهم، ثم 1/5، ثم 1/3، ثم 1/2 هو الأكبر.',
  },
  {
    id: 'q6',
    number: 6,
    type: 'matching',
    title: 'مطابقة الكسر مع الوصف الصحيح',
    hint: 'انقر على الكسر في العمود الأول ثم انقر على الوصف المطابق له في العمود المقابل.',
    points: 16,
    pairs: [
      {
        id: 'p1',
        fraction: { num: 4, den: 4 },
        targetText: 'يساوي 1 صحيح (واحد كامل)',
        targetId: 't_one',
      },
      {
        id: 'p2',
        fraction: { num: 2, den: 4 },
        targetText: 'يساوي النصف تماماً',
        targetId: 't_half',
      },
      {
        id: 'p3',
        fraction: { num: 1, den: 4 },
        targetText: 'أصغر من النصف',
        targetId: 't_less',
      },
      {
        id: 'p4',
        fraction: { num: 3, den: 4 },
        targetText: 'أكبر من النصف',
        targetId: 't_more',
      },
    ],
    explanation: '4/4 هو واحد كامل، 2/4 يساوي النصف لأن 2 نصف 4، 1/4 أصغر من النصف، و 3/4 أكبر من النصف.',
  },
  {
    id: 'q7',
    number: 7,
    type: 'true_false',
    title: 'هل ادعاء المعلمة فاليا صحيح؟ (صح أم خطأ)',
    hint: 'تذكر قاعدة المقامات المختلفة عندما يتساوى البسط.',
    points: 8,
    statement: 'قالت المعلمة فاليا: "الكسر 4 على 5 أكبر من الكسر 4 على 7، لأن قطع الأخماس أكبر من قطع الأسباع عندما نقسم نفس الكعكة".',
    statementDetails: {
      fractionA: { num: 4, den: 5 },
      fractionB: { num: 4, den: 7 },
    },
    correctAnswer: true,
    explanation: 'صحيح! عندما نقسم شيئاً إلى 5 أجزاء تكون الأجزاء أكبر مما لو قسمناه إلى 7 أجزاء، وبما أننا أخذنا 4 أجزاء في الحالتين، فإن 4 أخماس أكبر من 4 أسباع.',
  },
  {
    id: 'q8',
    number: 8,
    type: 'multi_compare',
    title: 'مقارنة الكسور بالواحد الصحيح',
    hint: 'إذا كان البسط يساوي المقام، فالكسر يساوي 1. وإذا كان البسط أصغر من المقام، فالكسر أصغر من 1.',
    points: 10,
    items: [
      {
        id: 'mc1',
        left: { num: 7, den: 8 },
        right: 1,
        correctSign: '<',
      },
      {
        id: 'mc2',
        left: { num: 6, den: 6 },
        right: 1,
        correctSign: '=',
      },
    ],
    explanation: '7 أثمان أصغر من 1 (ينقصه ثمن ليكتمل)، بينما 6 أسداس تساوي 1 كامل لأن البسط يساوي المقام.',
  },
];
