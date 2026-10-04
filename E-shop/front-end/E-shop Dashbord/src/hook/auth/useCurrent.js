import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api, setToken } from '../../config/app'

function useCurrent() {

    const [isLoading, setIsLoading] = useState(true)
    // MUST be null, not []: an empty array is truthy, so consumers that gate on
    // `if (data)` would treat "not signed in" as "signed in with no role".
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/auth/me')
                if(res.data?.success){
                    setData(res.data?.result) 
                } else {
                    setData(null)
                }
            } catch (error) {
                if (error?.response?.status === 401) {
                    // Expired or rejected token: drop it so the next sign-in is clean.
                    setToken(null)
                    setData(null)
                } else {
                    toast.error(error?.response?.data?.error || 'server is down')
                }
            }finally{
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])
  return {
    isLoading,
    data
  }
}

export default useCurrent