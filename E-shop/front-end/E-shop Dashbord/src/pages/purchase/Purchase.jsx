import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "../../hook/useQuery";
import { FaCreditCard } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import formatDate from "../../utils/formatDate";
import PurchaseStatusUpdate from "./PurchaseStatusUpdate";
import PurchasePaymentStatus from "./PurchasePaymentStatus";

function Purchase() {

  const [search, setSearch] = useState("")
  const [refetch, setFetch] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isOpenStatus, setIsOpenStatus] = useState(false)
  const { data: purchases, isLoading } = useQuery("purchase", search, page, limit, refetch);
  const [editId, setEditId] = useState("")
  const [isOpenPayment, setIsOpenPayment] = useState(false)

  return (
    <>
      <PurchaseStatusUpdate
        open={isOpenStatus}
        editId={editId}
        onClose={() => {
          setIsOpenStatus(false)
          setFetch(false)
        }}
      />

      <PurchasePaymentStatus
        open={isOpenPayment}
        editId={editId}
        onClose={() => {
          setIsOpenPayment(false)
          setFetch(false)
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Purchase</h1>
        <Link to="/purchase/create" className="btn btn-sm btn-neutral">+ New</Link>
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
            {/* head */}
            <thead>
              <tr className="bg-gray-300 text-xs">
                <th>NO.</th>
                <th>Supplier</th>
                <th>Purchase By</th>
                <th>Total Cost</th>
                <th>Paid Amount</th>
                <th>Due Amount</th>
                <th>Change Amount</th>
                <th>Payment Status</th>
                <th>Purchase Status</th>
                <th>Purchase Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={12}>
                    <div className="flex justify-center">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : purchases?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={12}>
                    <div className="flex justify-center">
                      <p>No Data!</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {purchases?.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-gray-300 transition-all duration-400 text-center">
                    <th>{idx + 1}</th>
                    <td className="capitalize">{item.supplier?.businessName || "none"}</td>
                    <td className="capitalize">{item.user?.username || "none"}</td>
                    <td className="text-red-600 font-bold">{`${item.totalCost?.toLocaleString()}.00៛`}</td>
                    <td className="capitalize text-red-600 font-bold">{item.paidAmount ? `${Number(item.paidAmount).toLocaleString()}.00៛` : "0.00៛"}</td>
                    <td className="text-red-600 font-bold">{item.dueAmount ? `${Number(item.dueAmount).toLocaleString()}.00៛` : "0.00៛"}</td>
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
                    <td>
                      <span className={`
                      
                        text-xs font-medium me-2 px-2.5 rounded uppercase
                          ${item.purchaseStatus === 'received' && "bg-green-300 text-green-800"}
                          ${item.purchaseStatus === 'pending' && "bg-yellow-300 text-yellow-800"}
                          ${item.purchaseStatus === 'ordered' && "bg-blue-300 text-blue-800"}
                          ${item.purchaseStatus === 'cancel' && "bg-red-300 text-red-800"}
                        `}>
                        {item.purchaseStatus}
                      </span>
                    </td>
                    <td className="capitalize">{formatDate(item.purchaseDate)}</td>

                    <td className="whitespace-nowrap pt-6">
                      <button
                        disabled={item?.paymentStatus === "paid"}
                        onClick={() => {
                          setIsOpenPayment(true)
                          setEditId(item?._id)
                        }}
                        className={`text-lg text-error cursor-pointer ${item?.paymentStatus === "paid" ? "text-gray-500 cursor-not-allowed" : "text-green-500 cursor-pointer"}`}>
                        <FaCreditCard />
                      </button>
                      <button
                        disabled={item?.purchaseStatus === "received"}
                        onClick={() => {
                          setIsOpenStatus(true)
                          setEditId(item?._id)
                        }}

                        className={`text-lg text-error cursor-pointer ${item?.purchaseStatus === "received" ? "text-gray-500 cursor-not-allowed" : "text-green-500 cursor-pointer"}`}
                      >
                        <TbTruckDelivery />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        <div className="join join-sm flex justify-end items-end">
          <button className="join-item btn" onClick={() => setPage(page - 1)} disabled={page == 1} >«</button>
          <button className="join-item btn">Page {page}</button>
          <button className="join-item btn" onClick={() => setPage(page + 1)}>»</button>
        </div>
      </div>
    </>
  );
}

export default Purchase;
