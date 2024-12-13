'use client';

import React, { useEffect, useState } from 'react';
import { CategoryResults } from '../types';

interface ResultsProps {
  results: Record<string, number>;
  onRestart: () => void;
  userId?: number;
}

const Results = ({ results, onRestart, userId }: ResultsProps): JSX.Element => {
  const [categoryStats, setCategoryStats] = useState<CategoryResults>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/results?userId=${userId}`);
        const data = await response.json();
        setCategoryStats(data.categoryStats || {});
      } catch (error) {
        console.error('統計情報の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const categoryTitles: Record<string, string> = {
    ikigaism: "Ikigaism理解度",
    regulations: "法規制理解度"
  };

  const getScorePercentage = (category: string) => {
    const maxScores: Record<string, number> = {
      ikigaism: 10, // 10問
      regulations: 8  // 8問
    };
    return ((results[category] / maxScores[category]) * 100).toFixed(1);
  };

  const getTotalScore = () => {
    const total = Object.values(results).reduce((sum, score) => sum + score, 0);
    const maxTotal = 18; // 全18問
    return ((total / maxTotal) * 100).toFixed(1);
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "優秀な理解度です！";
    if (percentage >= 70) return "良好な理解度です。";
    if (percentage >= 50) return "基本的な理解はできています。";
    return "より深い理解が必要かもしれません。";
  };

  const getGradientColor = (percentage: number) => {
    if (percentage >= 90) return 'from-emerald-400 to-teal-500';
    if (percentage >= 70) return 'from-blue-400 to-cyan-500';
    if (percentage >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">テスト結果</h2>
      
      <div className="mb-12 p-8 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <h3 className="text-2xl font-bold mb-4 text-center text-white">総合スコア</h3>
        <div className="text-6xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-[#00FF87] to-[#60EFFF] text-transparent bg-clip-text">
          {getTotalScore()}%
        </div>
        <p className="text-center text-lg text-white/90">{getScoreMessage(Number(getTotalScore()))}</p>
      </div>

      <div className="space-y-6">
        {Object.entries(results).map(([category, score]) => (
          <div key={category} className="p-6 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
            <h3 className="text-xl font-bold mb-4 text-white">{categoryTitles[category]}</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-white/90">正解数</span>
                <span className="font-bold text-white">{score} 問</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-white/90">正解率</span>
                <span className="font-bold text-white">{getScorePercentage(category)}%</span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getGradientColor(Number(getScorePercentage(category)))} transition-all duration-300`}
                  style={{
                    width: `${getScorePercentage(category)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full mt-8 p-4 rounded-xl bg-gradient-to-r from-[#00FF87] to-[#60EFFF] 
                   text-white text-lg font-bold hover:opacity-90 transition-opacity duration-200
                   shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
      >
        もう一度チャレンジする
      </button>
    </div>
  );
};

export default Results;
