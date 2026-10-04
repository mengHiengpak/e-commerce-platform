import { useState } from 'react'
import { Link } from "react-router";
import { useQuery } from '../../hook/useQuery'
import { FaEye, FaCreditCard } from 'react-icons/fa'
import SalePaymentStatus from './SalePaymentStatus';

function formatDate(date) {
    return new Date(date).toLocaleDateString()
}

function ListSale() {
    const [, setFetch] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const { data: sales, isLoading } = useQuery("sales", search, page, limit);
    const [isOpenStatus, setIsOpenStatus] = useState(false)
    const [editId, setEditId] = useState("")


    return (
        <>

            <SalePaymentStatus
                open={isOpenStatus}
                editId={editId}
                onClose={() => {
                    setIsOpenStatus(false)
                    setFetch(false)
                }}
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-xl font-semibold">Sale List</h1>
            </div>

            <div className="bg-white mt-4 p-4 rounded-md border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <select onChange={(e) => setLimit(Number(e.target.value))} className="select select-sm w-fit select-bordered">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>

                    <label className="input input-sm w-full sm:w-fit">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" onChange={(e) => setSearch(e.target.value)} required placeholder="Search" />
                    </label>
                </div>

                <div className="table-scroll py-4">
                    <table className="table text-sm min-w-[70rem]">
                        <thead>
                            <tr className="bg-gray-300 text-xs">
                                <th>NO.</th>
                                <th>Invoice Number</th>
                                <th>Sale By</th>
                                <th>Customer</th>
                                <th>Total Cost</th>
                                <th>Due Amount</th>
                                <th>Pay Amount</th>
                                <th>Change Amount</th>
                                <th>Payment Status</th>
                                <th>Sale Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={11}>
                                        <div className="flex justify-center">
                                            <span className="loading loading-spinner loading-md"></span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : sales?.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={11}>
                                        <div className="flex justify-center">
                                            <p>No Data!</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {sales?.map((item, idx) => (
                                    <tr key={item._id} className="hover:bg-gray-300 transition-all duration-400 text-center">
                                        <th>{idx + 1}</th>
                                        <td className="capitalize">{item.invoiceNumber || "none"}</td>
                                        <td className="capitalize">{item?.user?.username || item?.user?.name || item?.user || "none"}</td>
                                        <td className="capitalize">{item?.customer?.name || "none"}</td>
                                        <td className="text-red-600 font-bold">{`${item.totalCost?.toLocaleString()}.00៛`}</td>
                                        <td className="text-red-600 font-bold">{item.dueAmount ? `${Number(item.dueAmount).toLocaleString()}.00៛` : "0.00៛"}</td>
                                        <td className="text-red-600 font-bold">{item.painAmount ? `${Number(item.painAmount).toLocaleString()}.00៛` : "0.00៛"}</td>
                                        <td className="text-red-600 font-bold">{item.changeAmount ? `${Number(item.changeAmount).toLocaleString()}.00៛` : "0.00៛"}</td>
                                        <td>
                                            <span className={`
                                                text-xs font-medium me-2 px-2.5 rounded uppercase
                                                ${item.paymentStatus === 'paid' && "bg-green-300 text-green-800"}
                                                ${item.paymentStatus === 'due' && "bg-red-300 text-red-800"}
                                                ${item.paymentStatus === 'partial' && "bg-yellow-300 text-yellow-800"}
                                            `}>
                                                {item.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="capitalize">{formatDate(item.createdAt)}</td>
                                        <td className="whitespace-nowrap pt-6">
                                            <button
                                                onClick={() => {
                                                    setIsOpenStatus(true)
                                                    setEditId(item?._id)
                                                }}
                                                disabled={item?.paymentStatus === "paid"}
                                                className={`text-lg ${item?.paymentStatus === "paid" ? "text-gray-500 cursor-not-allowed" : "text-green-500 cursor-pointer"}`}
                                            >
                                                <FaCreditCard />
                                            </button>
                                            <Link
                                                to={`sale/pos/${item._id || item.id}`}
                                                className={`text-lg text-green-500 cursor-pointer`}
                                            >
                                                <FaEye />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>

                <div className="join join-sm flex justify-end items-end">
                    <button className="join-item btn" onClick={() => setPage(page - 1)} disabled={page === 1}>«</button>
                    <button className="join-item btn">Page {page}</button>
                    <button className="join-item btn" onClick={() => setPage(page + 1)}>»</button>
                </div>
            </div>
        </>
    )
}

export default ListSale
