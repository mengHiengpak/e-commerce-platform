import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { useFindById } from '../../hook/useFindById'
import { useCollection } from '../../hook/useCollection'


function PurchasePaymentStatus({ open, onClose, editId }) {

    const [painAmount, setPainAmount] = useState("")
    const {data, isLoading} = useFindById("purchase", editId)
    const [isUpdating, , updates] = useCollection("purchase")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await updates(editId, {painAmount}, "put")
        if(res){
            onClose()
            setPainAmount("")
        }
    }

    useEffect(() => {
        if(data && isLoading === false){
            setPainAmount(data?.painAmount)
        }
    }, [data, isLoading])

    return (
        <>

            <Modal open={open} onClose={onClose} title="Upadate Payment Status">
                <form onSubmit={handleSubmit} >
                    <div className='mt-2'>
                        <div>
                            <label htmlFor="" className='block mt-2 mb-2'>Payments</label>
                            <input
                            type="number"
                            className="input w-full"
                            required
                            placeholder="add your payment"
                            min="1"
                            value={painAmount}
                            onChange={(e) => setPainAmount(e.target.value)}
                        />
                            <p className="validator-hint">Must be between be 1 to 10</p>
                        </div>

                        <div className='flex flex-wrap gap-2 mb-4'>
                            <button className='btn btn-neutral mt-3 cursor-text w-full sm:w-50'>
                                <span>Due Amount : </span> <span className='text-red-600 font-semibold'>{data?.dueAmount}</span>
                            </button>
                            <button className='btn btn-neutral mt-3 cursor-text w-full sm:w-50'>
                                <span>Change Amount : </span> <span className='text-red-600 font-semibold'>{data?.changeAmount}</span>
                            </button>
                        </div>
                    </div>


                    <div>
                        <button type="submit" disabled={isUpdating} className='btn btn-neutral mt-2 w-full'>Save</button>
                    </div>
                </form>
            </Modal>

        </>
    )
}

export default PurchasePaymentStatus