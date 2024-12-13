import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 管理者ページへのアクセスをチェック
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_API_KEY

    // Basic認証のチェック
    if (!authHeader || !adminKey) {
      return new NextResponse('認証が必要です', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }

    try {
      const encoded = authHeader.split(' ')[1]
      const decoded = Buffer.from(encoded, 'base64').toString()
      const [username, password] = decoded.split(':')

      if (username !== 'admin' || password !== adminKey) {
        return new NextResponse('認証に失敗しました', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
          },
        })
      }
    } catch (error) {
      return new NextResponse('認証エラー', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
