import toast from "react-hot-toast"
import { api } from "../config/app"
import { useCallback, useState } from "react"

export const use30DayAgo = () => {
    const [isLoading, setIsLoading] = useState(false)
    const Day30Ago = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/reports/30days")
            if(res.data?.success) {
            return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'general is not available!')
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {Day30Ago, isLoading}
}