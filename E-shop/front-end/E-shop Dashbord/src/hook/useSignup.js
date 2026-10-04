import toast from "react-hot-toast"
import { api } from "../config/app"
import { useState } from "react"

export const useSignup = () => {
    const [isLoading, setIsLoading] = useState(false)
    const signup = async (data) => {
        try {
            setIsLoading(true)
            const res = await api.post('/auth/signup', data)
            if (res.data?.success) {
                toast.success(res.data?.message || "Created successfully!")
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message || "Create failed!")
            console.error(error?.response?.data?.error || error?.message)
            return null
        } finally {
            setIsLoading(false)
        }
    }
    return { isLoading, signup }
}