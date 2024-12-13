'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (results: Record<string, number>) => void;
  userId?: number;
}

const Quiz = ({ questions, onComplete, userId }: QuizProps): JSX.Element => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    ikigaism: 0,
    regulations: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveAnswer = async (answer: {
    userId: number;
    quizId: number;
    selected: number;
  }) => {
    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answer),
      });

      if (!response.ok) {
        throw new Error('回答の保存に失敗しました');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  };

  const handleAnswer = async (optionIndex: number) => {
    if (!userId) {
      console.error('ユーザーIDが設定されていません');
      return;
    }

    setIsSubmitting(true);
    const question = questions[currentQuestion];
    const isCorrect = optionIndex + 1 === question.correctAnswer;
    
    try {
      // 回答をデータベースに保存
      const answer = {
        userId,
        quizId: question.id,
        selected: optionIndex + 1,
      };

      await saveAnswer(answer);

      setAnswers(prev => ({
        ...prev,
        [question.category]: prev[question.category] + (isCorrect ? 1 : 0)
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        onComplete(answers);
      }
    } catch (error) {
      console.error('回答の保存中にエラーが発生しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentQuestion >= questions.length) {
    return (
      <div className="max-w-2xl mx-auto text-center text-white">
        <p>すべての問題が完了しました</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-medium text-white/90">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-base font-medium text-white/90 px-4 py-1 rounded-full bg-white/20">
            {question.category === 'ikigaism' ? 'Ikigaism' : '法規制'}
          </span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed text-white">
          {question.text}
        </h2>
        
        <div className="space-y-4">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isSubmitting}
              className={`w-full text-lg font-medium p-6 text-left rounded-xl 
                       bg-white/25 hover:bg-white/35 
                       border border-white/30 hover:border-white/50
                       transition-all duration-300 transform hover:-translate-y-1
                       shadow-lg hover:shadow-xl
                       text-white
                       ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>進捗</span>
          <span>{Math.round((currentQuestion + 1) / questions.length * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00FF87] to-[#60EFFF] transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
