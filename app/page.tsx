'use client';

import { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { DBQuizQuestion, QuizQuestion, User } from './types';

export default function Home(): JSX.Element {
  const [showQuiz, setShowQuiz] = useState(false);
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    // 問題の取得
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('問題の取得に失敗しました');
        }
        const data: DBQuizQuestion[] = await response.json();
        
        // データベースの形式からフロントエンド用の形式に変換
        const formattedQuestions: QuizQuestion[] = data.map((q) => ({
          id: q.id,
          text: q.question,
          category: q.category as 'ikigaism' | 'regulations',
          options: JSON.parse(q.options) as string[],
          correctAnswer: q.correctOption,
          isVisible: q.isVisible,
          order: q.order,
        }));

        // 順序でソート
        formattedQuestions.sort((a, b) => (a.order || 0) - (b.order || 0));
        setQuestions(formattedQuestions);
      } catch (err) {
        console.error('問題の取得エラー:', err);
        setError('問題の読み込みに失敗しました');
      }
    };

    fetchQuestions();
  }, []);

  const handleStartQuiz = async (name: string, email: string) => {
    setLoading(true);
    setError(null);

    try {
      // ユーザー登録/ログイン
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('ユーザー登録に失敗しました');
      }

      const userData = await response.json();
      setUser(userData);
      setShowQuiz(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (quizResults: Record<string, number>) => {
    setResults(quizResults);
  };

  const handleRestart = () => {
    setShowQuiz(false);
    setResults(null);
    setUser(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p>読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            再試行
          </button>
        </div>
      </main>
    );
  }

  if (results && user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <Results results={results} onRestart={handleRestart} userId={user.id} />
      </main>
    );
  }

  if (showQuiz && user && questions.length > 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <Quiz questions={questions} onComplete={handleQuizComplete} userId={user.id} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Ikigai Quiz
        </h1>

        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl border border-white/30">
          <h2 className="text-2xl font-bold mb-6 text-white">クイズを始める</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleStartQuiz(
                formData.get('name') as string,
                formData.get('email') as string
              );
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50
                         focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="あなたの名前"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50
                         focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="example@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-xl bg-gradient-to-r from-[#00FF87] to-[#60EFFF]
                       text-white text-lg font-bold hover:opacity-90 transition-opacity duration-200
                       shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all
                       ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '処理中...' : 'スタート'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
