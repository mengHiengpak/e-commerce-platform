import toast from "react-hot-toast"
import { api } from "../../config/app"

export const useFindOneByCode = () => {
  const findByCode = async (path, code) => {
    const url = `${path}/${code}`
    try {
      const res = await api.get(url)
      if(res.data?.success){
        return res.data?.result
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "your code is not found!")
    }
  }

  return {
    findByCode
  }
}
