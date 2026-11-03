import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Icon from './Icon'
import Pokeball from './Pokeball'
import { displayName, initials } from '../utils/format'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/pokemon', label: 'Collection', icon: 'cards', end: true },
  { to: '/pokemon/create', label: 'Add Pokémon', icon: 'plus' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]

export default function Sidebar({ open = false, onClose }) {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      showToast('You have been signed out. See you soon, trainer!', 'info')
      navigate('/login', { replace: true })
    } catch (error) {
      showToast(error.message || 'Could not sign out. Please try again.', 'error')
    }
  }

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'is-visible' : ''}`.trim()}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${open ? 'is-open' : ''}`.trim()} aria-label="Main navigation">
        <div className="sidebar__top">
          <NavLink to="/dashboard" className="brand" onClick={onClose} aria-label="PokéDex Manager dashboard">
            <Pokeball size={38} />
            <span className="brand__text">
              <strong>PokéDex</strong>
              <small>Card Manager</small>
            </span>
          </NavLink>
          <button
            type="button"
            className="icon-btn sidebar__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Menu</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`.trim()}
            >
              <span className="nav-link__icon">
                <Icon name={item.icon} size={19} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__cta">
          <span className="sidebar__cta-orb" aria-hidden="true" />
          <p>Ready to catch a new card?</p>
          <NavLink to="/pokemon/create" className="btn btn--primary btn--block" onClick={onClose}>
            <Icon name="plus" size={17} />
            New Pokémon
          </NavLink>
        </div>

        <div className="sidebar__user">
          <NavLink to="/profile" className="sidebar__user-card" onClick={onClose} title="View profile">
            <span className="avatar avatar--sm">{initials(user?.displayName, user?.email)}</span>
            <span className="sidebar__user-info">
              <strong>{displayName(user)}</strong>
              <small>{user?.email}</small>
            </span>
          </NavLink>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
    </>
  )
}
