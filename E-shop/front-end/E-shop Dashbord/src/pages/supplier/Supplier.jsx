import React, { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '../../hook/useQuery'
import { useCollection } from '../../hook/useCollection'
import { IoPencilSharp } from "react-icons/io5"
import { IoMdTrash } from "react-icons/io"

function Supplier() {
const [search, setSearch] = useState("")
const [refetch, setRefetch] = useState(true)
const [page, setPage] = useState(1)
const [limit, setLimit] = useState(10)
const { data: suppliers, isLoading} = useQuery('supplies', search, page, limit, refetch);
const [, , , remove] = useCollection('supplies')

const handleDelete = async (id) => {
  const res = await remove(id)
  if (!confirm("Are you sure you want to delete this user?")) return
  if(res?.success) {
    setRefetch(prev => !prev)
  }
  }

return (
<>
<div className="flex flex-wrap items-center justify-between gap-2">
  <h1 className="text-xl font-semibold">Supplier</h1>
  <Link to="/supplier/create" className="btn btn-sm btn-neutral">+ New</Link>
</div>

<div className="bg-white mt-4 p-4 rounded-md border border-gray-200">
  <div className="flex flex-wrap items-center justify-between gap-2">
    <select onChange={(e) => setLimit(e.target.value)} className="select select-sm w-fit select-bordered">
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>

    <label className="input input-sm w-full sm:w-fit">
      <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input type="search" onChange={(e) => setSearch(e.target.value)} required placeholder="Search" />
    </label>
  </div>

  <div className="table-scroll py-4">
    <table className="table min-w-[48rem]">
      {/* head */}
      <thead>
        <tr className='bg-gray-300'>
          <th>NO.</th>
          <th>Business Name</th>
          <th>Name</th>
          <th>Phone</th>
          <th>email</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>

      {
        isLoading ? (
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="flex justify-center">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : suppliers?.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="flex justify-center">
                  <p>No Data!</p>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {
              suppliers?.map((item, idx) => {
                return (
                  <tr key={idx} className="hover:bg-gray-300 transition-all duration-400">
                    <th>{idx + 1}</th>
                    <td>{item.businessName}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td className="whitespace-nowrap">

                      <Link to={`/supplier/edit/${item._id || item.id}`} className="text-lg text-gray-800 cursor-pointer me-2">
                        <IoPencilSharp />
                      </Link>

                      <button onClick={() => handleDelete(item._id || item.id)} className="text-lg text-error cursor-pointer">
                        <IoMdTrash />
                      </button>

                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        )
      }

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


export default Supplier