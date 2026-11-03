import { Link } from 'react-router-dom'
import Pokeball from '../components/Pokeball'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { user } = useAuth()

  return (
    <div className="not-found">
      <div className="not-found__art" aria-hidden="true">
        <Pokeball size={150} />
      </div>
      <p className="eyebrow">Error 404</p>
      <h1>Wild page not found!</h1>
      <p className="not-found__text">
        The page you are looking for fled into the tall grass. Let&apos;s head back to a safe
        route.
      </p>
      <Link to={user ? '/dashboard' : '/login'} className="btn btn--primary btn--lg">
        {user ? 'Return to dashboard' : 'Return to sign in'}
      </Link>
    </div>
  )
}
