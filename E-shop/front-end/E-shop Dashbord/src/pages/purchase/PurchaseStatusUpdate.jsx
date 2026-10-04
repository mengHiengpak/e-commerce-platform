import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { useFindById } from '../../hook/useFindById'
import { useCollection } from '../../hook/useCollection'


function PurchaseStatusUpdate({ open, onClose, editId }) {

    const [purchaseStatus, setPurchaseStatus] = useState("")
    const {data, isLoading} = useFindById("purchase", editId)
    const [isUpdating, , updates] = useCollection("purchase")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await updates(editId, {purchaseStatus})
        if(res){
            onClose()
            setPurchaseStatus("")
        }
    }

    useEffect(() => {
        if(data && isLoading === false){
            setPurchaseStatus(data?.purchaseStatus)
        }
    }, [data, isLoading])

    return (
        <>

            <Modal open={open} onClose={onClose} title="Upadate Purchase Status">
                <form onSubmit={handleSubmit} >
                    <div className='mt-2'>
                        <label htmlFor="" className='block mb-2'>Status</label>
                        <select value={purchaseStatus} onChange={(e) => setPurchaseStatus(e.target.value)} className="select select-bordered w-full">
                            <option value="" disabled>Select Status</option>
                            <option value="received">Received</option>
                            <option value="ordered">Ordered</option>
                            <option value="pending">Pending</option>
                            <option value="cancel">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <button type="submit" disabled={isUpdating} className='btn btn-neutral mt-2 w-full'>Save</button>
                    </div>
                </form>
            </Modal>

        </>
    )
}

export default PurchaseStatusUpdate