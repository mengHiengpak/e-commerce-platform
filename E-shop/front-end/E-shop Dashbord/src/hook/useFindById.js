import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { api } from "../config/app"

export const useFindById = (collection, id) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id || !collection) return
    const fetchData = async () => {
      try {
        const res = await api.get(`/${collection}/${id}`)
        console.log("useFindById response:", res.data)
        setData(res.data?.result || res.data?.data || res.data?.doc || res.data)
      } catch (error) {
        toast.error(error?.response?.data?.error || "server is error!")
        console.error(error?.response?.data?.error || "server is error!")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, collection])

  return { data, isLoading }
}
