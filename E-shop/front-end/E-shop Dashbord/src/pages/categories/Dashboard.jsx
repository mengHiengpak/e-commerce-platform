import React, { useEffect, useState } from 'react'
import { HiCurrencyDollar } from 'react-icons/hi'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { HiDocumentCurrencyDollar } from 'react-icons/hi2'
import { FaCircleDollarToSlot } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa'
import { FaHandshake } from 'react-icons/fa'
import { FaFileInvoice } from 'react-icons/fa'
import { useGeneral } from '../../hook/useGeneral'
import ChartsRevenues from '../components/charts/ChartsRevenues'
import ChartTwoRevenues from '../components/charts/ChartTwoRevenues'
import ChartTreeRevenues from '../components/charts/ChartTreeRevenues'
import ChartFourRevenues from '../components/charts/ChartFourRevenues'
function Dashboard() {
  const {general} = useGeneral()
  const [data, setData] = useState([])
  useEffect(() => {
    general().then((data) => setData(data))
  }, [general])


  return (
    <div className='p-4'>
        <div className='flex justify-between items-center'>
              <h1 className='text-xl fonrt-semibold capitalize'>Generale Report</h1>
        </div>

        <div className='grid m-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
          <div className='bg-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='space-y-1'>
                <p className='text-sm text-slate-600'>Today Revenue</p>
                <h2 className='text-3xl font-semibold'>{data?.result?.totalSales ? `${Number(data.result.totalSales).toFixed(2)}៛` : "00.00៛"}</h2>
            </div>
            <div className='p-2 bg-slate-200/30 rounded-full'>
                <span className='text-3xl text-slate-700'>
                  <HiCurrencyDollar/>
                </span>
            </div>
          </div>

          <div className='bg-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='-space-y-1'>
              <p className='text-sm text-slate-600'>Due Invoice</p>
              <h2 className='text-3xl font-semibold'>{data?.result?.totalDueSale ? `${Number(data.result.totalDueSale).toFixed(2)}៛` : '00.00៛'}</h2>
            </div>
            <div className='p-2 bg-slate-200/30 rounded-full'>
            <span className="text-3xl text-slate-700">
              <FaFileInvoiceDollar/>
            </span>
            </div>
          </div>

          <div className='bg-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='space-y-1'>
                <p className='text-sm text-slate-600'>Due Purchase</p>
                <h2 className='text-3xl font-semibold'>{data?.result?.totalDuePurchase ? `${Number(data.result.totalDuePurchase).toFixed(2)}៛` : '00.00៛'}</h2>
            </div>
            <div className='p-2 bg-slate-200/30 rounded-full'>
                <span className='text-3xl bg-slate-700'>
                  <HiDocumentCurrencyDollar/>
                </span>
            </div>
          </div>

          <div className='bg-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='spaec-y-1'>
                <p className='text-sm text-slate-600'>Montly Revenue</p>
                <h2 className='text-3xl font-semibold '>{data?.result?.totalMonthlySales ? `${Number(data.result.totalMonthlySales).toFixed(2)}៛` : '00.00៛'}</h2>
            </div>
            <div className='p-2 bg-slate-200/30 rounded-full'>
                <span className='text-3xl text-slate-700'>
                  <FaCircleDollarToSlot/>
                </span>
            </div>
          </div>

          <div className='bg-orange-400 flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='space-y-1'>
                <h2 className='text-3xl font-semibold'>{data?.result?.totalCustomer ? `${Number(data.result.totalCustomer)}` : '0'}</h2>
                <p className='text-sm font-semibold'>Customer</p>
            </div>
            <div className='p-2'>
              <span className='text-3xl'>
                <FaUser/>
              </span>
            </div>
          </div>

          <div className='bg-blue-400 text-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='space-y-1'>
              <h2 className='text-3xl font-semibold'>{data?.result?.totalSupplier ? `${Number(data.result.totalSupplier)}` : '0'}</h2>
              <p className='text-sm font-semibold'>Suppliers</p>
            </div>
            <div className='p-2'>
              <span className='text-3xl'>
                <FaHandshake/>
              </span>
            </div>
          </div>

          <div className='bg-slate-700 text-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
              <div className='space-y-1'>
                <h2 className='text-3xl font-semibold'>{data?.result?.totalPurchaseDue ? `${Number(data.result.totalPurchaseDue)}` : '0'}</h2>
                <p className='text-sm font-semibold'>Purchase Due Invioce</p>
              </div>
              <div className='p-2'>
                <span className='text-3xl'>
                  <FaFileInvoice/>
                </span>
              </div>
          </div>

          <div className='bg-green-400 text-white flex justify-between items-start p-3 shadow-sm rounded-lg py-5 m-2'>
            <div className='spcae-y-1'>
                <h2 className='text-3xl font-semibold'>{data?.result?.totalSalesDue ? `${Number(data.result.totalSalesDue)}` : '0'}</h2>
                <p className='text-sm font-semibold'>Sale Due Invioce</p>
            </div>
            <div className='p-2'>
              <span className='text-3xl'>
                <FaFileInvoice/>
              </span>
            </div>
          </div>

        </div>

        <div className='bg-white border border-gray-100 px-4 py-8 rounded-lg shadow-sm mt-2'>
        <ChartsRevenues/>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
          <div className='bg-white border border-gray-100 px-4 py-8 rounded-lg shadow-sm mt-2'>
            <ChartTwoRevenues/>
          </div>
          <div className='bg-white border border-gray-100 px-4 py-8 rounded-lg shadow-sm mt-2'>
            <ChartTreeRevenues/>
          </div>
        </div>

        <div className='bg-white border border-gray-100 px-4 py-8 rounded-lg shadow-sm mt-2'>
          <ChartFourRevenues/>
        </div>
    </div>
  )
}

export default Dashboard
