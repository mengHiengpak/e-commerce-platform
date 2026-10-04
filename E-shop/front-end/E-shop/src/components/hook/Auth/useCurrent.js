import { useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'

function useCurrent() {
  const { user, isLoading, refetch } = useContext(AuthContext)

  return {
    isLoading,
    data: user,
    refetch,
  }
}

export default useCurrent
