import { useState } from "react"
import { api } from "../config/app"
import toast from "react-hot-toast"

export const useCheckStock = () => {
    const [isLoading, setIsLoading] = useState(false)
    const checkStock = async (productId, stock) => {
        try {
            setIsLoading(true)
            const res = await api.get(`/sales/checkstock?productId=${productId}&stock=${stock}`)
            if(res.data?.success){
                return res.data
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.response?.data?.message || 'stock is not enough!')
        } finally {
            setIsLoading(false)
        }
    }
    return { isLoading, checkStock}
}