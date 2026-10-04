import toast from "react-hot-toast"
import { api } from "../config/app"
import { useCallback, useState } from "react"

export const useGrowthReport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const growth = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/reports/growth")
            if (res.data?.success) {
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'growth report is not available!')
        } finally {
            setIsLoading(false)
        }
    }, [])
    return { growth, isLoading }
}