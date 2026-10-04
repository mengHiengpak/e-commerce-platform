import toast from "react-hot-toast"
import { api } from "../config/app"
import { useCallback, useState } from "react"

export const useGeneral = () => {
    const [isLoading, setIsLoading] = useState(false)
    const general = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/reports/general")
            if(res.data?.success) {
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'general is not available!')
        } finally {
            setIsLoading(false)
        }
    }, [])
    return {general, isLoading}
}