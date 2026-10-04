import React from 'react'
import { useFindById } from '../../hook/useFindById';
import { useParams } from 'react-router';
import formatDate from '../../utils/formatDate';

function POSsale() {
    const { id } = useParams()
    const { data: result } = useFindById('sales', id);
    
    return (
        <div className='flex items-center justify-center p-4 mt-10'>
            {/* Receipt Card Container */}
            <div className='w-80 bg-white p-4 shadow-md shadow-gray-400 font-sans text-sm'>

                {/* Header Section */}
                <div className='text-center pb-3 border-b-2 border-dotted border-gray-400'>
                    <h1 className='text-xl font-bold uppercase tracking-wide'>PAK MENGHIENG POS</h1>
                    <p className='font-medium text-gray-700'>Receipt</p>
                </div>

                {/* Metadata Section */}
                <div className='py-3 border-b-2 border-dotted border-gray-400 space-y-1 font-semibold'>
                    <div className='flex justify-between'>
                    <span>Customer:</span>
                    <span>{result?.doc?.customer?.name || "none"}</span>
                </div>
                <div className='flex justify-between'>
                    <span>Sale by:</span>
                    <span>{result?.doc?.user?.username || "none"}</span>
                </div>
                <div className='flex justify-between'>
                    <span>Date:</span>
                    <span>{formatDate(result?.doc?.updatedAt || result?.doc?.createdAt)}</span>
                </div>
                <div className='flex justify-between'>
                    <span>Invoice:</span>
                    <span>{result?.doc?.invoiceNumber || result?.doc?._id || "none"}</span>
                </div>
                </div>

                {/* Items Table Section */}
                <div className='py-3 border-b-2 border-dotted border-gray-400'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-black text-white font-bold'>
                            <tr>
                                <th className='py-1 px-2 text-left'>Item</th>
                                <th className='py-1 px-2 text-center'>Qty</th>
                                <th className='py-1 px-2 text-right'>Price</th>
                            </tr>
                        </thead>
                        <tbody className='font-semibold'>
                            {result?.doc?.items?.length ? (
                                result.doc.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className='py-1 px-2'>{item?.name || item?.product?.name || "none"}</td>
                                        <td className='py-1 px-2 text-center'>{item?.quantity ?? item?.qty ?? "-"}</td>
                                        <td className='py-1 px-2 text-right'>{`${Number(item?.totalPrice ?? 0).toLocaleString()}.00៛`}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className='py-1 px-2 text-center'>No Items</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total Section */}
                <div className='py-3 border-b-2 border-dotted border-gray-400'>
                    <div className='bg-black text-white font-bold flex justify-between px-2 py-1'>
                        <span>Total</span>
                        <span>{`${Number(result?.doc?.totalCost ?? 0).toLocaleString()}.00៛`}</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className='text-center pt-3 font-bold text-base'>
                    <p>Thank you!</p>
                </div>

            </div>
        </div>

    )
}

export default POSsale