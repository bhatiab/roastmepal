import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../src/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ is_pro: false, roast_count: 0, has_email: false })
  }

  try {
    const { data: session } = await supabaseAdmin()
      .from('rmp_sessions')
      .select('is_pro, roast_count, email')
      .eq('session_token', token)
      .single()

    if (!session) {
      return NextResponse.json({ is_pro: false, roast_count: 0, has_email: false })
    }

    return NextResponse.json({
      is_pro: session.is_pro ?? false,
      roast_count: session.roast_count ?? 0,
      has_email: !!session.email,
    })
  } catch {
    return NextResponse.json({ is_pro: false, roast_count: 0, has_email: false })
  }
}
