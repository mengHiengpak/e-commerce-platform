import { useState } from "react"
import { api } from "../config/app"
import toast from "react-hot-toast"

export const useSalePayment = (saleId) => {
    const [isLoading, setIsLoading] = useState(false)
    const payments = async (data) => {
        try {
            setIsLoading(true)
            const res = await api.post(`/sales/addpayment/${saleId}`, data)
            if (res.data?.success) {
                toast.success(res.data.message || "Payment added successfully!")
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Update failed!")
        } finally {
            setIsLoading(false)
        }
    }
    return { isLoading, payments }
}