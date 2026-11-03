import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FirebaseSetupNotice from '../components/FirebaseSetupNotice'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail, passwordStrength } from '../utils/validation'

export default function Register() {
  const { register, isConfigured } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const strength = passwordStrength(password)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!fullName.trim()) nextErrors.fullName = 'Full name is required.'
    else if (fullName.trim().length < 2) nextErrors.fullName = 'Name must be at least 2 characters.'
    else if (fullName.trim().length > 60) nextErrors.fullName = 'Name must be 60 characters or fewer.'

    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'

    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'

    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.'
    else if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.'

    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await register({ fullName, email, password })
      const firstName = fullName.trim().split(' ')[0]
      showToast(`Welcome to the Pokédex, ${firstName}! Your account is ready.`, 'success')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error.message || 'Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const clearError = (field) => {
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  return (
    <AuthLayout
      eyebrow="New trainer"
      title="Create your account"
      subtitle="Start catching and cataloguing Pokémon in minutes."
      footer={
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      }
    >
      {!isConfigured && <FirebaseSetupNotice />}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="alert alert--error" role="alert">
            <Icon name="alert" size={18} />
            <span>{formError}</span>
          </p>
        )}

        <div className={`field ${errors.fullName ? 'field--error' : ''}`.trim()}>
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value)
              clearError('fullName')
            }}
            placeholder="Ash Ketchum"
            autoComplete="name"
            maxLength={60}
            aria-invalid={Boolean(errors.fullName)}
            required
          />
          {errors.fullName && <p className="field__error">{errors.fullName}</p>}
        </div>

        <div className={`field ${errors.email ? 'field--error' : ''}`.trim()}>
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              clearError('email')
            }}
            placeholder="trainer@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email && <p className="field__error">{errors.email}</p>}
        </div>

        <div className={`field ${errors.password ? 'field--error' : ''}`.trim()}>
          <label htmlFor="register-password">Password</label>
          <div className="password-field">
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearError('password')
              }}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {password && (
            <div className={`password-meter password-meter--${strength.level}`}>
              <span className="password-meter__bars" aria-hidden="true">
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`password-meter__bar ${
                      strength.score >= bar ? 'is-filled' : ''
                    }`.trim()}
                  />
                ))}
              </span>
              <span className="password-meter__label">{strength.label}</span>
            </div>
          )}
          {errors.password && <p className="field__error">{errors.password}</p>}
        </div>

        <div className={`field ${errors.confirmPassword ? 'field--error' : ''}`.trim()}>
          <label htmlFor="register-confirm">Confirm password</label>
          <input
            id="register-confirm"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              clearError('confirmPassword')
            }}
            placeholder="Repeat your password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            required
          />
          {errors.confirmPassword && <p className="field__error">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--block btn--lg"
          disabled={submitting || !isConfigured}
        >
          {submitting ? (
            <>
              <span className="btn__spinner" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            <>
              <Icon name="plus" size={18} />
              Create trainer account
            </>
          )}
        </button>

        <p className="auth-form__note">
          <Icon name="shield" size={15} />
          By registering you agree to keep your collection legendary.
        </p>
      </form>
    </AuthLayout>
  )
}
