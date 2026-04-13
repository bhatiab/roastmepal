'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { logoutAction } from './actions'

interface Lead {
  email: string
  roast_count: number
  is_pro: boolean
  created_at: string
}

interface Roast {
  id: string
  persona_id: string
  persona_emoji: string
  persona_name: string
  idea_title: string
  created_at: string
}

interface Stats {
  totalRoasts: number
  totalLeads: number
  totalPro: number
  totalIdeas: number
}

interface AdminClientProps {
  stats: Stats
  leads: Lead[]
  recentRoasts: Roast[]
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="card-surface">
      <p className="eyebrow mb-1">{label}</p>
      <p className="font-mono text-3xl text-white font-medium">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminClient({ stats, leads, recentRoasts }: AdminClientProps) {
  const [logoutPending, startLogout] = useTransition()

  const handleLogout = () => startLogout(() => logoutAction())

  const handleCopyEmails = async () => {
    const text = leads.map((l) => l.email).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Copied ${leads.length} emails`)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-brand-green">🔥</span>
            <span className="text-white font-medium">RoastMePal</span>
            <span className="text-muted-foreground text-sm">/ Admin</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutPending}
            className="btn-ghost text-sm disabled:opacity-50"
          >
            {logoutPending ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Stats */}
        <section>
          <h2 className="eyebrow mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Roasts" value={stats.totalRoasts} />
            <StatCard label="Leads" value={stats.totalLeads} sub="emails captured" />
            <StatCard label="Pro Users" value={stats.totalPro} sub="paid conversions" />
            <StatCard label="Ideas Submitted" value={stats.totalIdeas} />
          </div>
        </section>

        {/* Email list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="eyebrow">Email List ({leads.length})</h2>
            {leads.length > 0 && (
              <button onClick={handleCopyEmails} className="btn-ghost text-sm">
                Copy all emails
              </button>
            )}
          </div>

          {leads.length === 0 ? (
            <div className="card-surface text-muted-foreground text-sm">No emails captured yet.</div>
          ) : (
            <div className="card-surface p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Email</th>
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Roasts</th>
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Pro</th>
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={lead.email} className={i < leads.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-4 py-3 text-white font-mono text-xs">{lead.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.roast_count}</td>
                      <td className="px-4 py-3">
                        {lead.is_pro ? (
                          <span className="text-brand-green text-xs font-semibold">PRO</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(lead.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent roasts */}
        <section>
          <h2 className="eyebrow mb-4">Recent Roasts</h2>
          {recentRoasts.length === 0 ? (
            <div className="card-surface text-muted-foreground text-sm">No roasts yet.</div>
          ) : (
            <div className="card-surface p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Persona</th>
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Idea</th>
                    <th className="text-left text-muted-foreground font-normal px-4 py-3">Date</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentRoasts.map((roast, i) => (
                    <tr key={roast.id} className={i < recentRoasts.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="mr-1.5">{roast.persona_emoji}</span>
                        <span className="text-white">{roast.persona_name}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                        {roast.idea_title}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(roast.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/roast/${roast.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-green text-xs hover:underline"
                        >
                          View →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
