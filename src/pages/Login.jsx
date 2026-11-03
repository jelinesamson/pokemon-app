import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FirebaseSetupNotice from '../components/FirebaseSetupNotice'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../utils/validation'

export default function Login() {
  const { login, isConfigured } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'

    if (!password) nextErrors.password = 'Password is required.'

    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await login({ email, password })
      showToast('Welcome back, trainer! Your Pokédex is ready.', 'success')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setFormError(error.message || 'Could not sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Trainer sign in"
      title="Welcome back"
      subtitle="Sign in to manage your Pokémon collection."
      footer={
        <p className="auth-switch">
          New trainer? <Link to="/register">Create an account</Link>
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

        <div className={`field ${errors.email ? 'field--error' : ''}`.trim()}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: '' }))
            }}
            placeholder="trainer@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email && <p className="field__error">{errors.email}</p>}
        </div>

        <div className={`field ${errors.password ? 'field--error' : ''}`.trim()}>
          <div className="field__label-row">
            <label htmlFor="login-password">Password</label>
          </div>
          <div className="password-field">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrors((current) => ({ ...current, password: '' }))
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
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
          {errors.password && <p className="field__error">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--block btn--lg"
          disabled={submitting || !isConfigured}
        >
          {submitting ? (
            <>
              <span className="btn__spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              <Icon name="logout" size={18} className="btn__flip" />
              Sign in to PokéDex
            </>
          )}
        </button>

        <p className="auth-form__note">
          <Icon name="shield" size={15} />
          Your collection is private to your Firebase account.
        </p>
      </form>
    </AuthLayout>
  )
}
