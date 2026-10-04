import toast from "react-hot-toast"
import { api } from "../config/app"
import { useState } from "react"

export const useStorage = () => {
    const [isLoading, setIsLoading] = useState(false)

    const uploadFile = async (file) => {
        if (!file) return null

        try {
            setIsLoading(true)
            const formData = new FormData()
            formData.append("imageUrl", file) // Used instance 'formData' and lowercased parameter 'file'

            const res = await api.post("/upload", formData)

            if (res.data?.success) {
                return res.data
            }
            return null
        } catch (error) {
            toast.error(error?.response?.data?.error || "Server error!")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const removeFile = async (imageUrl) => {
        if (!imageUrl) return null

        try {
            setIsLoading(true)
            const res = await api.delete(`/upload/${imageUrl}`)

            if (res.data?.success) {
                return res.data
            }
            return null
        } catch (error) {
            toast.error(error?.response?.data?.error || "Server error!")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    // Returning an object allows easy destructuring anywhere in your components
    return {
        isLoading,
        uploadFile,
        removeFile,
    }
}