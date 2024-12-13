'use client';

import React, { useState, useEffect } from 'react';
import { AdminResults, UserResult, DBQuizQuestion } from '../types';

interface QuizForm {
  id?: number;
  question: string;
  options: string[];
  category: 'ikigaism' | 'regulations';
  correctOption: number;
  isVisible: boolean;
  order: number;
}

const emptyForm: QuizForm = {
  question: '',
  options: ['', '', '', ''],
  category: 'ikigaism',
  correctOption: 1,
  isVisible: true,
  order: 0,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'results'>('questions');
  const [results, setResults] = useState<AdminResults | null>(null);
  const [questions, setQuestions] = useState<DBQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizForm | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 結果の取得
      const resultsResponse = await fetch('/api/admin/results');
      if (!resultsResponse.ok) {
        throw new Error('結果の取得に失敗しました');
      }
      const resultsData = await resultsResponse.json();
      setResults(resultsData);

      // 問題の取得
      const questionsResponse = await fetch('/api/admin/quizzes');
      if (!questionsResponse.ok) {
        throw new Error('問題の取得に失敗しました');
      }
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (questionId: number, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible }),
      });

      if (!response.ok) {
        throw new Error('問題の更新に失敗しました');
      }

      await fetchData(); // データを再取得
    } catch (err) {
      console.error('問題の更新エラー:', err);
    }
  };

  const handleOrderChange = async (questionId: number, newOrder: number) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        throw new Error('問題の順序の更新に失敗しました');
      }

      await fetchData(); // データを再取得
    } catch (err) {
      console.error('問題の順序更新エラー:', err);
    }
  };

  const handleEditQuestion = (question: DBQuizQuestion) => {
    setEditingQuestion({
      id: question.id,
      question: question.question,
      options: JSON.parse(question.options),
      category: question.category as 'ikigaism' | 'regulations',
      correctOption: question.correctOption,
      isVisible: question.isVisible || false,
      order: question.order || 0,
    });
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setEditingQuestion(emptyForm);
    setIsCreating(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating 
        ? '/api/admin/quizzes'
        : `/api/admin/quizzes/${editingQuestion.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingQuestion,
          options: JSON.stringify(editingQuestion.options),
        }),
      });

      if (!response.ok) {
        throw new Error(isCreating ? '問題の作成に失敗しました' : '問題の更新に失敗しました');
      }

      await fetchData(); // データを再取得
      setEditingQuestion(null);
      setIsCreating(false);
    } catch (err) {
      console.error('問題の保存エラー:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-6xl mx-auto text-center text-white">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-6xl mx-auto text-center text-white">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">管理者ページ</h1>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'questions'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/20 text-white'
              }`}
            >
              問題管理
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'results'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/20 text-white'
              }`}
            >
              受講生結果
            </button>
          </div>
        </div>

        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* 問題作成/編集フォーム */}
            {editingQuestion && (
              <div className="bg-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  {isCreating ? '新規問題作成' : '問題の編集'}
                </h2>
                <form onSubmit={handleSaveQuestion} className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">問題文</label>
                    <textarea
                      value={editingQuestion.question}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value
                      })}
                      className="w-full p-2 rounded bg-white/20 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">選択肢</label>
                    {editingQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options];
                          newOptions[index] = e.target.value;
                          setEditingQuestion({
                            ...editingQuestion,
                            options: newOptions
                          });
                        }}
                        className="w-full p-2 rounded bg-white/20 text-white mb-2"
                        placeholder={`選択肢 ${index + 1}`}
                        required
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">カテゴリー</label>
                      <select
                        value={editingQuestion.category}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          category: e.target.value as 'ikigaism' | 'regulations'
                        })}
                        className="w-full p-2 rounded bg-white/20 text-white"
                      >
                        <option value="ikigaism">Ikigaism</option>
                        <option value="regulations">法規制</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">正解の選択肢</label>
                      <select
                        value={editingQuestion.correctOption}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          correctOption: parseInt(e.target.value)
                        })}
                        className="w-full p-2 rounded bg-white/20 text-white"
                      >
                        {editingQuestion.options.map((_, index) => (
                          <option key={index} value={index + 1}>
                            選択肢 {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditingQuestion(null)}
                      className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 新規作成ボタン */}
            {!editingQuestion && (
              <button
                onClick={handleCreateNew}
                className="w-full p-4 rounded-xl bg-green-500 text-white hover:bg-green-600"
              >
                新しい問題を作成
              </button>
            )}

            {/* 問題一覧 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">問題一覧</h2>
              <div className="space-y-4">
                {questions
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((question) => (
                    <div key={question.id} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-2">{question.question}</h3>
                          <div className="text-white/70 text-sm">
                            選択肢: {question.options}
                          </div>
                          <div className="text-white/70 text-sm mt-1">
                            カテゴリー: {question.category === 'ikigaism' ? 'Ikigaism' : '法規制'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleVisibilityToggle(question.id, !question.isVisible)}
                            className={`px-3 py-1 rounded ${
                              question.isVisible
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-red-500 hover:bg-red-600'
                            } text-white`}
                          >
                            {question.isVisible ? '表示' : '非表示'}
                          </button>
                          <input
                            type="number"
                            value={question.order || 0}
                            onChange={(e) => handleOrderChange(question.id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 rounded bg-white/20 text-white"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="space-y-8">
            {/* 全体の統計情報 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">全体の統計</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">総受講者数</p>
                  <p className="text-2xl font-bold text-white">{results.totalUsers}人</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">総回答数</p>
                  <p className="text-2xl font-bold text-white">{results.overallStats.totalAnswers}回</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">正解数</p>
                  <p className="text-2xl font-bold text-white">{results.overallStats.correctAnswers}回</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 text-sm">正答率</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round((results.overallStats.correctAnswers / results.overallStats.totalAnswers) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* カテゴリー別の統計情報 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">カテゴリー別の統計</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.categoryStats.map((stat) => (
                  <div key={stat.category} className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {stat.category === 'ikigaism' ? 'Ikigaism' : '法規制'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 text-sm">平均スコア</p>
                        <p className="text-xl font-bold text-white">{stat.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">受験者数</p>
                        <p className="text-xl font-bold text-white">{stat.totalUsers}人</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 受講生一覧 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">受講生一覧</h2>
              <div className="space-y-4">
                {results.users.map((user: UserResult) => (
                  <div key={user.user.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{user.user.name}</h3>
                        <p className="text-white/70 text-sm">{user.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-sm">平均スコア</p>
                        <p className="text-xl font-bold text-white">{user.summary.averageScore}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* カテゴリー別スコア */}
                      <div>
                        <h4 className="text-white font-medium mb-2">カテゴリー別スコア</h4>
                        <div className="space-y-2">
                          {user.results.map((result) => (
                            <div
                              key={result.category}
                              className="flex justify-between items-center bg-white/10 p-2 rounded"
                            >
                              <span className="text-white">
                                {result.category === 'ikigaism' ? 'Ikigaism' : '法規制'}
                              </span>
                              <span className="text-white font-medium">{result.score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 回答履歴 */}
                      <div>
                        <h4 className="text-white font-medium mb-2">最近の回答</h4>
                        <div className="space-y-2">
                          {user.answers.slice(0, 5).map((answer) => (
                            <div
                              key={answer.id}
                              className={`p-2 rounded ${
                                answer.correct ? 'bg-green-500/20' : 'bg-red-500/20'
                              }`}
                            >
                              <p className="text-white text-sm truncate">{answer.quiz.question}</p>
                              <p className="text-white/70 text-xs">
                                選択: {answer.selected} ({answer.correct ? '正解' : '不正解'})
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
