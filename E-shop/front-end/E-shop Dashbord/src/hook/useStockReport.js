import { useState } from "react"
import { api } from "../config/app"
import toast from "react-hot-toast"

export const useStockReport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const dataStockReport = async (quantity) => {
        try {
            setIsLoading(true)
            const res = await api.get(`/stockreports/stockreport?quantity=${quantity}`)
            if(res.data?.success){
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'stock is not available!')
        }finally {
            setIsLoading(false)
        }
    }
    return {dataStockReport, isLoading}
}