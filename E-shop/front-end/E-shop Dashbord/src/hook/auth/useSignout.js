import React, { useState } from 'react'
import { api, setToken } from '../../config/app'
import toast from 'react-hot-toast'

function useSignout() {

    const [isLoading, setIsLoading] = useState(false)

    const signOut = async () => {
        try {
            setIsLoading(true)
            const res = await api.post('/auth/signout')
            setToken(null)
            return res.data
        } catch (error) {
            console.error(error?.response?.data?.error || 'server is error!')
            toast.error(error?.response?.data?.error || 'server is error!')
        } finally {
            setIsLoading(false)
        }
    }

  return { isLoading, signOut }
}

export default useSignout