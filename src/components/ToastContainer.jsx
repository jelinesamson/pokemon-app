import { useToast } from '../context/ToastContext'
import Icon from './Icon'

const TYPE_ICONS = {
  success: 'check',
  error: 'alert',
  info: 'info',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
          <span className="toast__icon">
            <Icon name={TYPE_ICONS[toast.type] ?? 'info'} size={18} />
          </span>
          <p className="toast__message">{toast.message}</p>
          <button
            type="button"
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
