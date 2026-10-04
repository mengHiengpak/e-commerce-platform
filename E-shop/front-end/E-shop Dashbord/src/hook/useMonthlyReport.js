import toast from "react-hot-toast"
import { api } from "../config/app"
import { useCallback, useState } from "react"

export const useMonthlyReport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const monthly = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/reports/monthly")
            if(res.data?.success) {
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'monthly report is not available!')
        } finally {
            setIsLoading(false)
        }
    }, [])
    return {monthly, isLoading}
}