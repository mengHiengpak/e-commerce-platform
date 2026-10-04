import { useState } from "react"
import { api } from "../config/app"
import toast from "react-hot-toast"

export const useCollection = (collection) => {
  const [isLoading, setIsLoading] = useState(false)

  const create = async (data) => {
    try {
      setIsLoading(true)
      const res = await api.post(`/${collection}`, data)
      if (res.data?.success) {
        toast.success(res.data?.message || "Created successfully!")
        return res.data
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error?.message || "Create failed!")
      console.error(error?.response?.data?.error || error?.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updates = async (id, data, method = "patch") => {
    try {
      setIsLoading(true)
      const res = method === "put" ? await api.put(`/${collection}/${id}`, data) : await api.patch(`/${collection}/${id}`, data)
      if (res.data?.success) {
        toast.success(res.data?.message || "Updated successfully!")
        return res.data
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error?.message || "Update failed!")
      console.error(error?.response?.data?.error || error?.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const remove = async (id) => {
    try {
      setIsLoading(true)
      const res = await api.delete(`/${collection}/${id}`)
      if (res.data?.success) {
        toast.success(res.data?.message || "Deleted successfully!")
        return res.data
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error?.message || "Delete failed!")
      console.error(error?.response?.data?.error || error?.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return [isLoading, create, updates, remove]
}
