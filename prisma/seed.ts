import { PrismaClient } from '@prisma/client'
import { questions } from '../app/data/quizData'

const prisma = new PrismaClient()

async function main() {
  try {
    // 既存のデータをクリア
    console.log('既存のデータを削除中...')
    await prisma.answer.deleteMany()
    await prisma.result.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.user.deleteMany()
    console.log('既存のデータを削除しました')

    // クイズデータの追加
    console.log('クイズデータを追加中...')
    for (const [index, question] of questions.entries()) {
      await prisma.quiz.create({
        data: {
          id: question.id,
          question: question.text,
          options: JSON.stringify(question.options),
          category: question.category,
          correctOption: question.correctAnswer,
          isVisible: true,
          order: index + 1,
        },
      })
    }

    console.log(`${questions.length}件のクイズデータを追加しました`)
  } catch (error) {
    console.error('シードデータの投入中にエラーが発生しました:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('シードスクリプトの実行中にエラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('データベース接続を切断します')
    await prisma.$disconnect()
  })
