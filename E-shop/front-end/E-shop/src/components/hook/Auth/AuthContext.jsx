import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../../config/app.js'

const defaultAuthValue = {
  user: null,
  isLoading: true,
  refetch: async () => null,
  clearUser: () => {},
}

export const AuthContext = createContext(defaultAuthValue)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const res = await api.get('/customer/me')
      const currentUser = res.data?.success ? res.data.result : null
      setUser(currentUser)
      return currentUser
    } catch (error) {
      console.log(error?.response?.data?.error || 'server is down')
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearUser = useCallback(() => {
    setUser(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const onUnauthorized = () => clearUser()
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [clearUser])

  useEffect(() => {
    refetch()
  }, [refetch])

  const value = useMemo(
    () => ({ user, isLoading, refetch, setUser, clearUser }),
    [user, isLoading, refetch, clearUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
