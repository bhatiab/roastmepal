const SESSION_KEY = 'rmp_session'

function generateUUID(): string {
  return crypto.randomUUID()
}

export function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem(SESSION_KEY)
  if (!token) {
    token = generateUUID()
    localStorage.setItem(SESSION_KEY, token)
  }
  return token
}

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}
