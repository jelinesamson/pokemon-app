export default function EmptyState({ icon = '🔎', title, message, action, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'empty-state--compact' : ''}`.trim()}>
      <div className="empty-state__art" aria-hidden="true">
        <span className="empty-state__ring" />
        <span className="empty-state__emoji">{icon}</span>
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
