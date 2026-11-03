import { missingFirebaseKeys } from '../firebase/firebaseConfig'
import Icon from './Icon'

export default function FirebaseSetupNotice() {
  return (
    <div className="setup-notice" role="note">
      <div className="setup-notice__head">
        <span className="setup-notice__icon">
          <Icon name="alert" size={20} />
        </span>
        <div>
          <h3>Firebase is not configured yet</h3>
          <p>The app is ready, but it needs a Firebase project before you can sign in.</p>
        </div>
      </div>

      <ol className="setup-notice__steps">
        <li>
          Copy <code>.env.example</code> to <code>.env.local</code> in the project root.
        </li>
        <li>
          Paste your web app credentials from Firebase Console → Project settings → Your apps.
        </li>
        <li>
          Enable <strong>Email/Password</strong> authentication and create a{' '}
          <strong>Realtime Database</strong>.
        </li>
        <li>Restart the dev server with <code>npm run dev</code>.</li>
      </ol>

      <p className="setup-notice__label">Missing environment variables:</p>
      <div className="setup-notice__code">
        {missingFirebaseKeys.length
          ? missingFirebaseKeys.map((key) => <span key={key}>{key}</span>)
          : 'Firebase failed to initialise. Check the browser console for details.'}
      </div>
      <p className="setup-notice__footer">
        Full instructions are in <strong>README.md → Firebase setup</strong>.
      </p>
    </div>
  )
}
