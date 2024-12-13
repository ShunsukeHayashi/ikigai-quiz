// データベースの問題型
export interface DBQuizQuestion {
  id: number;
  question: string;
  options: string;  // JSON文字列として保存
  category: string;
  correctOption: number;
  isVisible?: boolean;
  order?: number;
}

// フロントエンドの問題型（quizData.tsで使用）
export interface Question {
  id: number;
  text: string;
  category: 'ikigaism' | 'regulations';
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// 変換後の問題型（Quizコンポーネントで使用）
export interface QuizQuestion {
  id: number;
  text: string;
  category: 'ikigaism' | 'regulations';
  options: string[];
  correctAnswer: number;
  isVisible?: boolean;
  order?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  answers: Answer[];
  results: Result[];
}

export interface Answer {
  id: number;
  userId: number;
  quizId: number;
  selected: number;
  correct: boolean;
  createdAt: Date;
  quiz: Quiz;
}

export interface Quiz {
  id: number;
  question: string;
  options: string;
  category: string;
  correctOption: number;
  isVisible?: boolean;
  order?: number;
}

export interface Result {
  id: number;
  userId: number;
  score: number;
  category: string;
  createdAt: Date;
}

export interface CategoryScore {
  total: number;
  correct: number;
}

export interface CategoryResults {
  [category: string]: CategoryScore;
}

export interface FormattedAnswer {
  id: number;
  quizId: number;
  selected: number;
  correct: boolean;
  createdAt: Date;
  quiz: {
    id: number;
    question: string;
    options: string[];
    category: string;
    correctOption: number;
  };
}

export interface UserSummary {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
}

export interface UserResult {
  user: {
    id: number;
    name: string;
    email: string;
  };
  answers: FormattedAnswer[];
  results: {
    category: string;
    score: number;
  }[];
  summary: UserSummary;
}

export interface CategoryStat {
  category: string;
  _avg: {
    score: number | null;
  };
  _count: {
    score: number;
  };
}

export interface AdminResults {
  users: UserResult[];
  categoryStats: {
    category: string;
    averageScore: number;
    totalUsers: number;
  }[];
  totalUsers: number;
  overallStats: {
    totalAnswers: number;
    correctAnswers: number;
  };
}
