/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase/firebaseConfig'
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUserDisplayName,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(auth))

  useEffect(() => {
    // Without Firebase config there is no auth instance and `loading` already
    // starts as false, so there is nothing to subscribe to.
    if (!auth) return undefined

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const register = useCallback(async (data) => {
    const newUser = await registerUser(data)
    setUser(newUser)
    return newUser
  }, [])

  const login = useCallback(async (data) => {
    const loggedInUser = await loginUser(data)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setUser(null)
  }, [])

  const updateName = useCallback(
    async (fullName) => {
      if (!user) throw new Error('You must be logged in to update your name.')
      const updatedUser = await updateUserDisplayName(user, fullName)
      setUser(updatedUser)
      return updatedUser
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: isFirebaseConfigured,
      register,
      login,
      logout,
      updateName,
    }),
    [user, loading, register, login, logout, updateName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }
  return context
}
