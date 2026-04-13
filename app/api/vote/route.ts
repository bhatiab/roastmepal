import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../src/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: { roastId?: string; type?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { roastId, type } = body

  if (!roastId || (type !== 'up' && type !== 'down')) {
    return NextResponse.json({ error: 'Missing roastId or type.' }, { status: 400 })
  }

  const column = type === 'up' ? 'upvotes' : 'downvotes'

  // Read current value, then increment
  const { data: current, error: fetchErr } = await supabaseAdmin()
    .from('rmp_roasts')
    .select('upvotes, downvotes')
    .eq('id', roastId)
    .single()

  if (fetchErr || !current) {
    return NextResponse.json({ error: 'Roast not found.' }, { status: 404 })
  }

  const newVal = (current[column as keyof typeof current] as number ?? 0) + 1

  const { error: updateErr } = await supabaseAdmin()
    .from('rmp_roasts')
    .update({ [column]: newVal })
    .eq('id', roastId)

  if (updateErr) {
    return NextResponse.json({ error: 'Could not record vote.' }, { status: 500 })
  }

  return NextResponse.json({
    upvotes: type === 'up' ? newVal : (current.upvotes ?? 0),
    downvotes: type === 'down' ? newVal : (current.downvotes ?? 0),
  })
}
