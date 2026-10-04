import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { api } from "../config/app"

export const useQuery = (collection, search = "", page = 1, limit = 100, refetch = false) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [totalPage, setTotalPage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/${collection}?search=${search}&page=${page}&limit=${limit}`
        )
        console.log("API response:", res.data)
        const rawResult = Array.isArray(res.data) ? res.data : res.data?.result || res.data?.collection || res.data?.data || []
        const result = Array.isArray(rawResult) ? rawResult : Array.isArray(rawResult?.doc) ? rawResult.doc : []
        setData(result)
        setTotalPage(res.data?.totalPage || 0)
      } catch (error) {
        toast.error(error?.response?.data?.error || error?.response?.data?.message || "server is down!")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [search, page, limit, refetch, collection])

  return {
    data,
    isLoading,
    page,
    totalPage,
    setTotalPage,
  }
}
