import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

/**
 * Firebase configuration comes from environment variables so that no private
 * project details are committed to source control. Copy `.env.example` to
 * `.env.local` and fill in the values from your Firebase project settings.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
}

export const REQUIRED_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
]

export const missingFirebaseKeys = REQUIRED_ENV_KEYS.filter((key) => {
  const value = import.meta.env[key]
  return !value || String(value).trim() === ''
})

let app = null
let auth = null
let db = null
let storage = null
let initError = null

if (missingFirebaseKeys.length === 0) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getDatabase(app)

    // Storage is optional: the rest of the app keeps working without it, but
    // artwork uploads need a valid bucket in VITE_FIREBASE_STORAGE_BUCKET.
    if (firebaseConfig.storageBucket) {
      try {
        storage = getStorage(app)

        const storageEmulatorHost = import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_HOST?.trim()
        if (storageEmulatorHost) {
          const [host, port] = storageEmulatorHost.split(':')
          connectStorageEmulator(storage, host, Number(port))
        }
      } catch (storageError) {
        console.warn('[firebase] Firebase Storage is not available:', storageError)
      }
    }

    // Optional local testing support. These variables are empty in normal
    // deployments, so the app keeps using the real Firebase services.
    const authEmulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL?.trim()
    if (authEmulatorUrl) {
      connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true })
    }

    const databaseEmulatorHost = import.meta.env.VITE_FIREBASE_DATABASE_EMULATOR_HOST?.trim()
    if (databaseEmulatorHost) {
      const [host, port] = databaseEmulatorHost.split(':')
      connectDatabaseEmulator(db, host, Number(port))
    }
  } catch (error) {
    initError = error
    console.error('[firebase] Failed to initialize Firebase:', error)
  }
}

export const isFirebaseConfigured = Boolean(auth && db)
export const isStorageConfigured = Boolean(storage)

export { app, auth, db, storage, initError }
export default firebaseConfig
