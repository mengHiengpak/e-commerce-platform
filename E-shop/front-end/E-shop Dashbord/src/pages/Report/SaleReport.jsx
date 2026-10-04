import { useState, useEffect } from 'react'
import { useSaleReport } from '../../hook/useSaleReport';
import toast from 'react-hot-toast';
import { formatDate } from '../../../utils/formatDate';

function SaleReport() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [reportData, setReportData] = useState([]);
    const [summaryData, setSummaryData] = useState(null)

    

    useEffect(() => {
        if (startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                setDateError("Start date cannot be after end date");
            } else {
                setDateError("");
            }
        } else {
            setDateError("");
        }
    }, [startDate, endDate])
    const {saleReport} = useSaleReport()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (dateError) return;
        const res = await saleReport(startDate, endDate)
        console.log("Sale Report API Response:", res)
        if (res?.success) {
            setReportData(res.showReport?.sales || [])
            setSummaryData(res.result || null)
            toast.success("Fetch sale report successfully!")
        }
    }

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        setDateError("");
        setReportData([]);
        setSummaryData(null);
    }

    return (
        <div className='p-5'>
            <h1 className='mb-5 font-bold'>Sale Report</h1>

            <div className='bg-base-100 w-full flex flex-wrap items-center justify-center gap-3 rounded-lg shadow-sm shadow-gray p-4'>
                <div className="mt-5">
                    <span>Start Date</span>
                    <div>
                        <input type="date" onChange={(e) => setStartDate(e.target.value)} className="input validator w-35" required placeholder="Pick a date in 2026"
                            min="2026-01-01" max="2026-12-31"
                            title="Please select a valid date"
                            value={startDate}
                            />
                        <p className="validator-hint">Must be 2026</p>
                    </div>
                </div>
                <div className="mt-5">
                    <span>End Date</span>
                    <div>
                        <input type="date" onChange={(e) => setEndDate(e.target.value)} className="input validator w-35" required placeholder="Pick a date in 2026"
                            min="2026-01-01" max="2026-12-31"
                            title="Please select a valid date"
                            value={endDate}
                            />
                        <p className="validator-hint">Must be 2026</p>
                    </div>
                </div>
                <div className='gap-2 mt-4 flex justify-center items-center'>
                    <div>
                        <button
                            className='btn btn-neutral text-white'
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Filter
                        </button>
                    </div>
                    <div>
                        <button  className='btn btn-neutral border-none bg-red-400 text-white' onClick={handleClear}>Clear</button>
                    </div>
                </div>
            </div>
            {dateError && <p className="text-red-500 text-sm mt-2 text-center">{dateError}</p>}

            <div className='bg-base-100 w-full gap-3 rounded-lg shadow-sm shadow-gray mt-5 p-5'>
                <div className="table-scroll py-4">
                    <table className="table text-sm min-w-[64rem]">
                        <thead className="bg-gray-300">
                            <tr className="text-xs">
                                <th className="text-center">N.O</th>
                                <th className="text-center">Invoice</th>
                                <th className="text-center">Sale By</th>
                                <th className="text-center">Customer</th>
                                <th className="text-center">Total Cost</th>
                                <th className="text-center">Paid Amount</th>
                                <th className="text-center">Due Amount</th>
                                <th className="text-center">Change Amount</th>
                                <th className="text-center">Payment Status</th>
                                <th className="text-center">Create Date</th>
                            </tr>
                        </thead>
                        <tbody className='border-b-4 border-b-black border-l-2 border-r-2 border-black'>
                            {reportData && reportData.length > 0 ? (
                                reportData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-300 transition-all duration-400 text-center ">
                                        <td>{index + 1}</td>
                                        <td>{item.invoiceNumber || "N/A"}</td>
                                        <td>{item.user?.username || "N/A"}</td>
                                        <td>{item.customer?.name || "N/A"}</td>
                                        <td>{item.totalCost || 0}៛</td>
                                        <td>{item.painAmount || 0}៛</td>
                                        <td>{item.dueAmount || 0}៛</td>
                                        <td>{item.changeAmount || 0}៛</td>
                                        <td>{item.paymentStatus || "N/A"}</td>
                                        <td>{formatDate(item.createdAt)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="p-2 text-center ">
                                    <td colSpan="10" className="py-10">no data?</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='text-end pb-3 mt-4'>
                    <span className='font-semibold'>Total Amount: </span>
                    <span className='text-red-600 font-bold'>
                        {summaryData?.totalRevenue
                            ? `${Number(summaryData.totalRevenue).toFixed(2)}៛`
                            : "0.00៛"}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SaleReport
