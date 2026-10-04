import toast from "react-hot-toast"
import { api } from "../config/app"
import { useState } from "react"

export const useSaleReport = () => {
    const [isLoading, setIsLoading] = useState(true)
    const saleReport = async (startDate, endDate) => {
        try {
            setIsLoading(true)
            const res = await api.get(`/salereports/saleReport?startDate=${startDate}&endDate=${endDate}`)
            if(res.data?.success) {
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || 'sale is not have!')
        }finally {
            setIsLoading(false)
        }
    }
    return { isLoading, saleReport}
}