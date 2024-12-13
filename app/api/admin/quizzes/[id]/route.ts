import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 問題の更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        question: data.question,
        options: data.options,
        category: data.category,
        correctOption: data.correctOption,
        isVisible: data.isVisible,
        order: data.order,
      },
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('クイズの更新に失敗しました:', error)
    return NextResponse.json(
      { error: 'クイズの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 問題の削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.quiz.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('クイズの削除に失敗しました:', error)
    return NextResponse.json(
      { error: 'クイズの削除に失敗しました' },
      { status: 500 }
    )
  }
}
