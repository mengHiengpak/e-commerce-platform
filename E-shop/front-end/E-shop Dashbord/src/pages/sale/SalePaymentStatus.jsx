import Modal from '../components/Modal'
import { useFindById } from '../../hook/useFindById'
import { useEffect, useState } from 'react'
import { useSalePayment } from '../../hook/useSalePayment'

function SalePaymentStatus({ open, onClose, editId }) {
    const { data } = useFindById('sales', editId)
    const [painAmount, setpainAmount] = useState("")
    const {isLoading, payments} = useSalePayment(editId)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await payments({painAmount})
        if(res){
            onClose()
            setpainAmount("")
            fetch(true)
        }
    }

    console.log("find is" , data)

    useEffect(() => {
        if(data && isLoading === false){
            setpainAmount(data?.painAmount)
        }
    }, [data, isLoading])


    return (
        <>
            <Modal open={open} onClose={onClose} title="Add Payment">
                <form className='space-y-2' onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <label htmlFor="" className='block mb-2'>Payment Update</label>
                            <input
                                type="number"
                                className="input w-full"
                                required
                                placeholder="add your payment"
                                min="1"
                                value={painAmount}
                                onChange={(e) => setpainAmount(e.target.value)}
                            />
                            <p className="validator-hint">Enter paid amount</p>
                        </div>
                        <div className='flex justify-between items-center gap-4 mb-4'>
                            <div>
                                <span>Due Amount: </span><span className='text-red-600 font-semibold'>{data?.doc?.dueAmount > 0 ? `${data?.doc?.dueAmount.toFixed(2)}៛` : "0.00៛"}</span>
                            </div>
                            <div>
                                <span>Change Amount: </span><span className='text-red-600 font-semibold'>{data?.doc?.changeAmount > 0 ? `${data?.doc?.changeAmount.toFixed(2)}៛` : '0.00៛'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className='btn btn-neutral w-full'>Pay now</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default SalePaymentStatus