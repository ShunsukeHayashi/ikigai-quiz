import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 全問題の取得
export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: {
        id: 'asc',
      },
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('クイズの取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'クイズの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 新規問題の作成
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const quiz = await prisma.quiz.create({
      data: {
        question: data.question,
        options: data.options,
        category: data.category,
        correctOption: data.correctOption,
      },
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('クイズの作成に失敗しました:', error)
    return NextResponse.json(
      { error: 'クイズの作成に失敗しました' },
      { status: 500 }
    )
  }
}
