import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Pokeball from '../components/Pokeball'
import StatCard from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { usePokemonCollection } from '../hooks/usePokemonCollection'
import { copyToClipboard } from '../utils/clipboard'
import {
  displayName,
  formatDateTime,
  formatNumber,
  initials,
} from '../utils/format'
import { collectionStats } from '../utils/pokemonCollection'

export default function Profile() {
  const { user, logout, updateName } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { pokemon } = usePokemonCollection(user?.uid)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const stats = useMemo(() => collectionStats(pokemon), [pokemon])

  const handleCopyUid = async () => {
    try {
      await copyToClipboard(user.uid)
      showToast('Your UID was copied to the clipboard.', 'info')
    } catch {
      showToast('Could not copy your UID. Please select and copy it manually.', 'error')
    }
  }

  const handleRename = async (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError('Display name is required.')
      return
    }
    if (trimmed.length < 2) {
      setNameError('Name must be at least 2 characters.')
      return
    }
    if (trimmed.length > 60) {
      setNameError('Name must be 60 characters or fewer.')
      return
    }

    setSaving(true)
    setNameError('')
    try {
      await updateName(trimmed)
      showToast('Your display name was updated.', 'success')
      setEditing(false)
    } catch (error) {
      setNameError(error.message || 'Could not update your name.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await logout()
      showToast('You have been signed out. See you soon, trainer!', 'info')
      navigate('/login', { replace: true })
    } catch (error) {
      showToast(error.message || 'Could not sign out. Please try again.', 'error')
      setSigningOut(false)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Trainer profile</p>
          <h1>Your account</h1>
          <p className="page-header__lead">
            Review the Firebase account that owns your Pokémon collection.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--secondary btn--lg"
          onClick={handleLogout}
          disabled={signingOut}
        >
          {signingOut ? (
            <>
              <span className="btn__spinner" aria-hidden="true" />
              Signing out…
            </>
          ) : (
            <>
              <Icon name="logout" size={18} />
              Log out
            </>
          )}
        </button>
      </header>

      <div className="profile-layout">
        <div className="profile-main">
          <section className="panel profile-card">
            <div className="profile-card__banner" aria-hidden="true">
              <span className="profile-card__banner-ball">
                <Pokeball size={150} />
              </span>
            </div>
            <div className="profile-card__body">
              <span className="avatar avatar--xl">
                {initials(user?.displayName, user?.email)}
              </span>
              <div className="profile-card__identity">
                <h2>{displayName(user)}</h2>
                <p>{user?.email}</p>
                <div className="profile-card__badges">
                  <span className="pill">
                    <Icon name="shield" size={14} />
                    Authenticated
                  </span>
                  <span className="pill">
                    <Icon name="database" size={14} />
                    Firebase account
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Firebase identity</p>
                <h2>Account details</h2>
              </div>
            </div>

            <dl className="profile-fields">
              <div>
                <dt>Full name</dt>
                <dd>{displayName(user)}</dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="profile-fields__wide">
                <dt>User ID (UID)</dt>
                <dd>
                  <span className="mono">{user?.uid}</span>
                  <button
                    type="button"
                    className="icon-btn icon-btn--sm"
                    onClick={handleCopyUid}
                    aria-label="Copy user ID"
                    title="Copy user ID"
                  >
                    <Icon name="copy" size={16} />
                  </button>
                </dd>
              </div>
              <div>
                <dt>Account created</dt>
                <dd>{formatDateTime(user?.metadata?.creationTime)}</dd>
              </div>
              <div>
                <dt>Last sign in</dt>
                <dd>{formatDateTime(user?.metadata?.lastSignInTime)}</dd>
              </div>
              <div>
                <dt>Sign-in provider</dt>
                <dd>Email / Password</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="profile-side">
          <section className="panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Collection</p>
                <h2>Trainer stats</h2>
              </div>
            </div>

            <div className="profile-stats">
              <StatCard icon="🎴" label="Pokémon" value={stats.total} tone="red" />
              <StatCard icon="🌈" label="Types" value={`${stats.typeCount}/18`} tone="blue" />
              <StatCard icon="📈" label="Avg. level" value={stats.avgLevel} tone="green" />
              <StatCard
                icon="⚔️"
                label="Total power"
                value={formatNumber(stats.totalPower)}
                tone="yellow"
              />
            </div>

            <Link to="/pokemon" className="btn btn--secondary btn--block">
              <Icon name="cards" size={17} />
              Open my collection
            </Link>
          </section>

          <section className="panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Account settings</p>
                <h2>Display name</h2>
              </div>
            </div>

            {editing ? (
              <form className="profile-name-form" onSubmit={handleRename} noValidate>
                <div className={`field ${nameError ? 'field--error' : ''}`.trim()}>
                  <label htmlFor="profile-name">Full name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      setNameError('')
                    }}
                    maxLength={60}
                    autoFocus
                    aria-invalid={Boolean(nameError)}
                  />
                  {nameError && <p className="field__error">{nameError}</p>}
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      setEditing(false)
                      setName(user?.displayName ?? '')
                      setNameError('')
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                    {saving ? 'Saving…' : 'Save name'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-name-row">
                <span>{displayName(user)}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setName(user?.displayName ?? '')
                    setEditing(true)
                  }}
                >
                  <Icon name="edit" size={16} />
                  Edit name
                </button>
              </div>
            )}
          </section>

          <section className="panel panel--danger">
            <h2>Sign out</h2>
            <p className="muted">
              End your session on this device. Your Pokémon stay safely stored in Firebase.
            </p>
            <button
              type="button"
              className="btn btn--danger btn--block"
              onClick={handleLogout}
              disabled={signingOut}
            >
              <Icon name="logout" size={17} />
              {signingOut ? 'Signing out…' : 'Log out of PokéDex'}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
