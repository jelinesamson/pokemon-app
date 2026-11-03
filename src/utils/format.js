export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}

export function timeAgo(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const divisions = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Number.POSITIVE_INFINITY, unit: 'year' },
  ]

  let duration = seconds
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
      return formatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }
  return '—'
}

export function initials(name, email = '') {
  const source = String(name ?? '').trim() || String(email ?? '').trim().split('@')[0]
  if (!source) return '?'
  const parts = source.split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function shortId(id = '') {
  return String(id).slice(-6).toUpperCase()
}

export function formatNumber(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return new Intl.NumberFormat('en-US').format(number)
}

export function truncate(value = '', length = 120) {
  const text = String(value)
  if (text.length <= length) return text
  return `${text.slice(0, length).trimEnd()}…`
}

export function displayName(user) {
  if (!user) return 'Trainer'
  return user.displayName?.trim() || user.email?.split('@')[0] || 'Trainer'
}
