import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface CategoryScore {
  total: number
  correct: number
}

interface CategoryResults {
  [category: string]: CategoryScore
}

type UserAnswer = {
  quiz: {
    category: string
  }
  correct: boolean
}

export async function POST(request: Request) {
  try {
    const { userId, quizId, selected } = await request.json()

    // クイズの正解を取得
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'クイズが見つかりません' },
        { status: 404 }
      )
    }

    // 回答を保存
    const answer = await prisma.answer.create({
      data: {
        userId,
        quizId,
        selected,
        correct: selected === quiz.correctOption,
      },
    })

    // ユーザーの全回答を取得して結果を更新
    const userAnswers = await prisma.answer.findMany({
      where: { userId },
      include: { quiz: true },
    })

    // カテゴリーごとの正答数を集計
    const categoryResults: CategoryResults = userAnswers.reduce((acc: CategoryResults, curr: UserAnswer) => {
      const category = curr.quiz.category
      if (!acc[category]) {
        acc[category] = { total: 0, correct: 0 }
      }
      acc[category].total++
      if (curr.correct) {
        acc[category].correct++
      }
      return acc
    }, {})

    // 各カテゴリーの結果を保存/更新
    for (const [category, scores] of Object.entries(categoryResults)) {
      await prisma.result.upsert({
        where: {
          userId_category: {
            userId,
            category,
          },
        },
        update: {
          score: Math.round((scores.correct / scores.total) * 100),
        },
        create: {
          userId,
          category,
          score: Math.round((scores.correct / scores.total) * 100),
        },
      })
    }

    return NextResponse.json(answer)
  } catch (error) {
    console.error('Error in POST /api/answer:', error)
    return NextResponse.json(
      { error: '回答の保存に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      )
    }

    const answers = await prisma.answer.findMany({
      where: { userId: parseInt(userId) },
      include: { quiz: true },
    })

    return NextResponse.json(answers)
  } catch (error) {
    console.error('Error in GET /api/answer:', error)
    return NextResponse.json(
      { error: '回答の取得に失敗しました' },
      { status: 500 }
    )
  }
}
