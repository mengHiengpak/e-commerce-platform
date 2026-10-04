import React, { useState } from 'react'
import Modal from '../components/Modal'
import { useQuery } from '../../hook/useQuery'
import { useCollection } from '../../hook/useCollection'

function SalePayment({open, onClose, addToCart}) {

    const [paymentAmount, setPaymentAmount] = useState("")
    const { data: customers } = useQuery("customers");

    const total = addToCart ? addToCart.reduce((sum, item) => sum + Number(item.Price) * Number(item.Quantity), 0) : 0;
    const changeAmount = Number(paymentAmount) - total;
    const dueAmount = total - Number(paymentAmount);
    const [customer, setCustomer] = useState("");
    const [isLoading, create] = useCollection("sales")


    const handleSubmit = async (e) => {
        e.preventDefault();
        const paymentData = {
            customer: customer,
            totalCost: total,
            painAmount: Number(paymentAmount),
            items: addToCart.map(item => ({
                product: item.productId,
                quantity: item.Quantity,
                uniPrice: item.Price,
                totalPrice: item.Total
            }))
        };
        console.log(paymentData, "paymentData")

        const res = await create(paymentData);
        if(res) {
            onClose();
            setPaymentAmount("");
            setCustomer("");
            const saleId = res?.result?._id || res?.result?.newSale?._id;
            if (saleId) {
                window.open(`/sale/list/sale/pos/${saleId}`, '_blank');
            }
        }
    }


  return (
    <>
            <Modal open={open} onClose={onClose} title="Add Payment">
                <form className='space-y-2' onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor=""  className='block mb-2'>Customer</label>
                        <select className="select w-full" value={customer} onChange={(e) => setCustomer(e.target.value)}>
                            <option value="" disabled>Select Customer</option>
                            {customers?.map((item) => (
                                <option key={item._id} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="" className='block mb-2'>Paid Amount</label>
                            <input
                            type="number"
                            className="input w-full"
                            required
                            placeholder="add your payment"
                            min="1"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                            <p className="validator-hint">Enter paid amount</p>
                        </div>

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 -mt-2'>
                            <button className='btn btn-neutral bg-gray-400 border-none p-2 text-white' onClick={() => setPaymentAmount(total)}><span>៛{total.toFixed(2)}</span></button>
                            <button className='btn btn-neutral bg-gray-400 border-none p-2 text-white' onClick={() => setPaymentAmount((prev) => Number(prev) + 5000)}><span>5000.00៛</span></button>
                            <button className='btn btn-neutral bg-gray-400 border-none p-2 text-white' onClick={() => setPaymentAmount((prev) => Number(prev) + 10000)}><span>10000.00៛</span></button>
                            <button className='btn btn-neutral bg-gray-400 border-none p-2 text-white' onClick={() => setPaymentAmount((prev) => Number(prev) + 20000)}><span>20000.00៛</span></button>
                        </div>

                        <div className='mt-4 border-b-2 border-black mb-4'></div>

                        <div className='flex justify-between items-center gap-4 mb-4'>
                            <div>
                                <span>Change Amount: </span><span className='text-red-600 font-semibold'>{changeAmount > 0 ? `${changeAmount.toFixed(2)}៛` : '0.00៛'}</span>
                            </div>
                            <div>
                                <span>Due Amount: </span><span className='text-red-600 font-semibold'>{dueAmount > 0 ? `${dueAmount.toFixed(2)}៛` : '0.00៛'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={handleSubmit} disabled={isLoading} type="button" className='btn btn-neutral w-full'>{isLoading ? 'Processing...' : 'Pay now'}</button>
                    </div>
                </form>
            </Modal>

    </>
    )
}

export default SalePayment
