import { useState } from "react"
import toast from "react-hot-toast"
import { useStockReport } from "../../hook/useStockReport"
import { apiUrlBase } from "../../config/env";

function StockReport() {
  const [stockQuantity, setStockQuantity] = useState("10")
  const [reportData, setReportData] = useState([]);

  const { dataStockReport, isLoading } = useStockReport()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dataStockReport(stockQuantity)
    console.log("Stock Report API Response:", res)
    if (res?.success) {
        setReportData(res.showReports?.products || [])
        toast.success("Fetch stock report successfully!")
    }
  }

  const handleClear = () => {
      setStockQuantity("10")
      setReportData([])
  }

  return (
    <div className='p-5'>
        <h1 className='mb-5 font-bold'>Stock Report</h1>

        <div className='bg-base-100 w-full flex flex-wrap items-center justify-center gap-3 rounded-lg shadow-sm shadow-gray p-4'>
            <div className="grid grid-cols-1 mb-1">
                <label className="mb-2">Stock Quantity</label>
                <select
                    className="select w-60 select-bordered"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                >
                    <option value="10">quantity less than 10</option>
                    <option value="20">quantity less than 20</option>
                    <option value="40">quantity less than 40</option>
                    <option value="60">quantity less than 60</option>
                    <option value="80">quantity less than 80</option>
                    <option value="100">quantity less than 100</option>
                    <option value="500">quantity less than 500</option>
                    <option value="1000">quantity less than 1000</option>
                </select>
            </div>
            <div className='gap-2 mt-7 flex justify-center items-center'>
                <div>
                    <button
                        className='btn btn-neutral text-white'
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Filter"}
                    </button>
                </div>
                <div>
                    <button className='btn btn-neutral border-none bg-red-400 text-white' onClick={handleClear}>Clear</button>
                </div>
            </div>
        </div>

        <div className='bg-base-100 w-full gap-3 rounded-lg shadow-sm shadow-gray mt-2 pl-5 pr-5'>
            <div className="table-scroll py-4">
                <table className="table text-sm min-w-[48rem]">
                    <thead>
                        <tr className="bg-gray-300 text-xs text-center ">
                            <th>Image</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Category</th>
                            <th>Cost Price</th>
                            <th>Sale Price</th>
                            <th>Current Stock</th>
                        </tr>
                    </thead>
                    <tbody className='border-b-4 border-b-black border-l-2 border-r-2 border-black'>
                        {reportData && reportData.length > 0 ? (
                            reportData.map((item, index) => (
                                <tr key={item._id || index} className="hover:bg-gray-300 transition-all duration-400 text-center ">
                                    <td>
                                        <img
                                            src={`${apiUrlBase}/uploads/${item.imageUrl}`}
                                            alt={item.name}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    </td>
                                    <td>{item.name || "N/A"}</td>
                                    <td>{item.code || "N/A"}</td>
                                    <td>{item.category?.name || "N/A"}</td>
                                    <td>{item.costPrice || 0}៛</td>
                                    <td>{item.salePrice || 0}៛</td>
                                    <td>{item.currentstock ?? 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="p-2 text-center ">
                                <td colSpan="8">no data?</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
  )
}

export default StockReport

