
import dayjs from "dayjs"

export const formatDate = (date, format="DD/MMM/YYYY") => {
    return dayjs(date).format(format)
}