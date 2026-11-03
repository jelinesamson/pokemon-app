import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'
import Pokeball from './Pokeball'
import { initials } from '../utils/format'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar__menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Icon name="menu" size={22} />
      </button>

      <Link to="/dashboard" className="topbar__brand" aria-label="PokéDex Manager dashboard">
        <Pokeball size={28} />
        <span>PokéDex</span>
      </Link>

      <NavLink to="/profile" className="avatar avatar--xs" aria-label="Open profile">
        {initials(user?.displayName, user?.email)}
      </NavLink>
    </header>
  )
}
