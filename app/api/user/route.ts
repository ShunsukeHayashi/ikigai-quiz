import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { DBQuizQuestion } from '@/app/types'

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json()

    // 既存のユーザーを検索、なければ作成
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        name,
        email,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('ユーザー登録エラー:', error)
    return NextResponse.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    )
  }
}

interface QuizFromDB {
  id: number;
  question: string;
  options: string;
  category: string;
  correctOption: number;
  isVisible: boolean;
  order: number;
}

// 表示可能な問題のみを取得
export async function GET() {
  try {
    console.log('問題を取得中...');
    const quizzes = await prisma.quiz.findMany({
      where: {
        isVisible: true,
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          id: 'asc',
        },
      ],
      select: {
        id: true,
        question: true,
        options: true,
        category: true,
        correctOption: true,
        isVisible: true,
        order: true,
      },
    });

    if (!quizzes || quizzes.length === 0) {
      console.log('利用可能な問題が見つかりません');
      return NextResponse.json(
        { error: '問題の取得に失敗しました' },
        { status: 404 }
      );
    }

    console.log(`${quizzes.length}件の問題を取得しました`);
    const formattedQuizzes: DBQuizQuestion[] = quizzes.map((quiz: QuizFromDB) => ({
      ...quiz,
      options: quiz.options,
    }));

    return NextResponse.json(formattedQuizzes)
  } catch (error) {
    console.error('クイズ取得エラー:', error)
    return NextResponse.json(
      { error: 'クイズの取得に失敗しました' },
      { status: 500 }
    )
  }
}
