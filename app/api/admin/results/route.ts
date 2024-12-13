import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UserResult } from '@/app/types'

export async function GET() {
  try {
    // すべてのユーザーとその回答、結果を取得
    const users = await prisma.user.findMany({
      include: {
        answers: {
          include: {
            quiz: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        results: {
          orderBy: {
            category: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // レスポンスデータの整形
    const formattedResults: UserResult[] = users.map(user => ({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      answers: user.answers.map(answer => ({
        id: answer.id,
        quizId: answer.quizId,
        selected: answer.selected,
        correct: answer.correct,
        createdAt: answer.createdAt,
        quiz: {
          id: answer.quiz.id,
          question: answer.quiz.question,
          options: JSON.parse(answer.quiz.options),
          category: answer.quiz.category,
          correctOption: answer.quiz.correctOption,
        },
      })),
      results: user.results.map(result => ({
        category: result.category,
        score: result.score,
      })),
      summary: {
        totalQuestions: user.answers.length,
        correctAnswers: user.answers.filter(a => a.correct).length,
        averageScore: Math.round(
          (user.answers.filter(a => a.correct).length / user.answers.length) * 100 || 0
        ),
      },
    }))

    // カテゴリー別の統計情報を計算
    const categoryStats = await prisma.result.groupBy({
      by: ['category'],
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
    })

    return NextResponse.json({
      users: formattedResults,
      categoryStats: categoryStats.map(stat => ({
        category: stat.category,
        averageScore: Math.round(stat._avg.score || 0),
        totalUsers: stat._count.score,
      })),
      totalUsers: users.length,
      overallStats: {
        totalAnswers: users.reduce((acc, user) => acc + user.answers.length, 0),
        correctAnswers: users.reduce(
          (acc, user) => acc + user.answers.filter(answer => answer.correct).length,
          0
        ),
      },
    })
  } catch (error) {
    console.error('結果の取得に失敗しました:', error)
    return NextResponse.json(
      { error: '結果の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 特定のユーザーの結果を取得
export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        answers: {
          include: {
            quiz: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        results: {
          orderBy: {
            category: 'asc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    const formattedResult: UserResult = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      answers: user.answers.map(answer => ({
        id: answer.id,
        quizId: answer.quizId,
        selected: answer.selected,
        correct: answer.correct,
        createdAt: answer.createdAt,
        quiz: {
          id: answer.quiz.id,
          question: answer.quiz.question,
          options: JSON.parse(answer.quiz.options),
          category: answer.quiz.category,
          correctOption: answer.quiz.correctOption,
        },
      })),
      results: user.results.map(result => ({
        category: result.category,
        score: result.score,
      })),
      summary: {
        totalQuestions: user.answers.length,
        correctAnswers: user.answers.filter(a => a.correct).length,
        averageScore: Math.round(
          (user.answers.filter(a => a.correct).length / user.answers.length) * 100 || 0
        ),
      },
    }

    return NextResponse.json(formattedResult)
  } catch (error) {
    console.error('ユーザー結果の取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'ユーザー結果の取得に失敗しました' },
      { status: 500 }
    )
  }
}
