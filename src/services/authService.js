import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'That email is already registered. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-not-found': 'No account was found with that email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please check your details and try again.',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact your administrator.',
  'auth/operation-not-allowed':
    'Email/password sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method.',
  'auth/invalid-api-key': 'Your Firebase API key is invalid. Check the values in .env.local.',
  'auth/api-key-not-valid': 'Your Firebase API key is invalid. Check the values in .env.local.',
  'auth/unauthorized-domain':
    'This domain is not authorised for Firebase Authentication. Add it under Authentication → Settings → Authorized domains.',
}

export function getAuthErrorMessage(error) {
  if (!error) return 'Something went wrong. Please try again.'
  const code = error.code ?? ''
  if (AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code]
  if (typeof error.message === 'string' && error.message.startsWith('Firebase is not configured')) {
    return error.message
  }
  return error.message || 'Something went wrong. Please try again.'
}

function ensureAuth() {
  if (!auth) {
    throw new Error(
      'Firebase is not configured. Add your Firebase credentials to .env.local and restart the dev server.',
    )
  }
}

function friendlyError(error) {
  const wrapped = new Error(getAuthErrorMessage(error))
  wrapped.code = error?.code
  return wrapped
}

export async function registerUser({ fullName, email, password }) {
  ensureAuth()
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
    await updateProfile(credential.user, { displayName: fullName.trim() })
    await credential.user.reload()
    return auth.currentUser ?? credential.user
  } catch (error) {
    throw friendlyError(error)
  }
}

export async function loginUser({ email, password }) {
  ensureAuth()
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
    return credential.user
  } catch (error) {
    throw friendlyError(error)
  }
}

export async function logoutUser() {
  ensureAuth()
  try {
    await signOut(auth)
  } catch (error) {
    throw friendlyError(error)
  }
}

export async function updateUserDisplayName(user, fullName) {
  ensureAuth()
  try {
    await updateProfile(user, { displayName: fullName.trim() })
    await user.reload()
    return auth.currentUser ?? user
  } catch (error) {
    throw friendlyError(error)
  }
}
