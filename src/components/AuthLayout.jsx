import { Link } from 'react-router-dom'
import Pokeball from './Pokeball'
import Icon from './Icon'
import { getTypeMeta } from '../utils/pokemonTypes'

const FEATURES = [
  {
    icon: 'database',
    title: 'Real-time collection',
    text: 'Every card is stored in Firebase Realtime Database and synced instantly.',
  },
  {
    icon: 'shield',
    title: 'Private by design',
    text: 'Firebase security rules keep every trainer’s collection separate.',
  },
  {
    icon: 'cards',
    title: 'Full CRUD control',
    text: 'Create, read, update and delete your own Pokémon cards.',
  },
]

const TYPE_CHIPS = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Dragon', 'Fairy']

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <Link to="/login" className="brand brand--auth" aria-label="PokéDex Manager home">
          <Pokeball size={42} />
          <span className="brand__text">
            <strong>PokéDex</strong>
            <small>Card Manager</small>
          </span>
        </Link>

        <div className="auth-brand__content">
          <p className="eyebrow">Pokémon card management system</p>
          <h1>
            Build the collection
            <br />
            <span className="gradient-text">of your dreams.</span>
          </h1>
          <p className="auth-brand__lead">
            Sign in, catch your favourite Pokémon and keep every stat, type and story
            organised in one beautiful Pokédex.
          </p>

          <ul className="auth-features">
            {FEATURES.map((feature) => (
              <li key={feature.title}>
                <span className="auth-features__icon">
                  <Icon name={feature.icon} size={18} />
                </span>
                <span>
                  <strong>{feature.title}</strong>
                  <small>{feature.text}</small>
                </span>
              </li>
            ))}
          </ul>

          <div className="auth-type-chips" aria-hidden="true">
            {TYPE_CHIPS.map((type) => {
              const meta = getTypeMeta(type)
              return (
                <span
                  key={type}
                  className="chip"
                  style={{ '--chip-color': meta.color, '--chip-accent': meta.accent }}
                >
                  <span>{meta.icon}</span>
                  {type}
                </span>
              )
            })}
          </div>
        </div>

        <div className="auth-brand__footer">
          <span className="auth-brand__art" aria-hidden="true">
            <Pokeball size={170} />
          </span>
          <p>Powered by Firebase Authentication &amp; Realtime Database</p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-panel__inner">
          <p className="eyebrow auth-panel__eyebrow">{eyebrow}</p>
          <h2 className="auth-panel__title">{title}</h2>
          <p className="auth-panel__subtitle">{subtitle}</p>
          {children}
          {footer && <div className="auth-panel__footer">{footer}</div>}
        </div>
        <p className="auth-panel__copyright">
          © {new Date().getFullYear()} PokéDex Manager · School project demo
        </p>
      </main>
    </div>
  )
}
