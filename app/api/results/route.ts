import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface CategoryStat {
  category: string
  _avg: {
    score: number | null
  }
  _count: {
    score: number
  }
}

interface UserResult {
  id: number
  userId: number
  score: number
  category: string
  createdAt: Date
  user: {
    name: string
    email: string
  }
}

interface ScoreDistribution {
  '90-100': number
  '70-89': number
  '50-69': number
  '0-49': number
}

interface StatisticsReport {
  totalParticipants: number
  averageScore: number
  topScorers: UserResult[]
  scoreDistribution: ScoreDistribution
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

    // 特定のユーザーの結果を取得
    if (userId) {
      const results = await prisma.result.findMany({
        where: {
          userId: parseInt(userId),
          ...(category ? { category } : {}),
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // ユーザーの詳細情報も取得
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      })

      return NextResponse.json({
        user,
        results,
      })
    }

    // カテゴリーごとの統計情報を取得
    const categoryStats = await prisma.result.groupBy({
      by: ['category'],
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
    })

    // 全体の統計情報
    const overallStats = await prisma.result.aggregate({
      _avg: {
        score: true,
      },
      _count: {
        score: true,
      },
    })

    return NextResponse.json({
      categoryStats: categoryStats.map((stat: CategoryStat) => ({
        category: stat.category,
        averageScore: Math.round(stat._avg.score || 0),
        totalResponses: stat._count.score,
      })),
      overallStats: {
        averageScore: Math.round(overallStats._avg.score || 0),
        totalResponses: overallStats._count.score,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/results:', error)
    return NextResponse.json(
      { error: '結果の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 統計レポートを生成するエンドポイント
export async function POST(request: Request) {
  try {
    const { category } = await request.json()

    // カテゴリー別の詳細な統計情報を取得
    const categoryResults = await prisma.result.findMany({
      where: category ? { category } : undefined,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    }) as UserResult[]

    // 統計情報を計算
    const stats: StatisticsReport = {
      totalParticipants: categoryResults.length,
      averageScore: Math.round(
        categoryResults.reduce((acc: number, curr: UserResult) => acc + curr.score, 0) / categoryResults.length || 0
      ),
      topScorers: categoryResults.slice(0, 5), // 上位5名
      scoreDistribution: {
        '90-100': categoryResults.filter((r: UserResult) => r.score >= 90).length,
        '70-89': categoryResults.filter((r: UserResult) => r.score >= 70 && r.score < 90).length,
        '50-69': categoryResults.filter((r: UserResult) => r.score >= 50 && r.score < 70).length,
        '0-49': categoryResults.filter((r: UserResult) => r.score < 50).length,
      },
    }

    return NextResponse.json({
      category: category || 'all',
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in POST /api/results:', error)
    return NextResponse.json(
      { error: '統計レポートの生成に失敗しました' },
      { status: 500 }
    )
  }
}
