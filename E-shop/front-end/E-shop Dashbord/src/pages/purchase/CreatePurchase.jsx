import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from "../../hook/useQuery";
import toast from 'react-hot-toast';
import { useFindOneByCode as useFindProductByCode } from '../../hook/test/useFindOneByCode';
import { apiUrlBase } from '../../config/env';
import { IoMdTrash } from 'react-icons/io';
import { useCollection } from '../../hook/useCollection'

function CreatePurchase() {

    const { findByCode } = useFindProductByCode();

    const [productCode, setProductCode] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [unitPrice, setUnitPrice] = useState("")
    const [total, setTotal] = useState(0)

    const [supplier, setSupplier] = useState("")
    const [invoiceNumber, setInvoiceNumber] = useState("")
    const [purchaseDate, setPurchaseDate] = useState("")
    const [purchaseStatus, setPurchaseStatus] = useState("")
    const [note, setNote] = useState("")

    const { data: suppliers } = useQuery('supplies', "", 1, 100);

    const [, creates] = useCollection('purchase')


    const handleSearchProductByCode = async () => {
        if (!productCode) {
            toast.error("Product code is required!")
            return
        }
        const data = await findByCode('/product/code', productCode)
        if (data) {
            setUnitPrice(data?.doc?.costPrice)
        }

    }

    useEffect(() => {
        setTotal(quantity * unitPrice)
    }, [quantity, unitPrice])



    const [result, setResult] = useState([]);

    const handlesAddProduct = async () => {
        const data = await findByCode('/product/code', productCode);

        const newItem = {
            image: data?.doc?.imageUrl,
            product: data?.doc?.name,
            unitPrice: data?.doc?.costPrice,
            quantity: quantity,
            total: total,
            productId: data?.doc?._id
        };
        if (newItem) {
            toast.success('successfully!')
            setProductCode('');
            setQuantity(0);
            setUnitPrice(0);
        }

        console.log(newItem)

        setResult((prev) => [...prev, newItem]);
        
    };

    const finalsum = result.reduce((sum, item) => sum + item?.total, 0)



    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!result || result.length === 0) {
            toast.error("Please add at least one product!")
            return
        }

        const data = {
            
                items: result.map(item => ({
                product: item.productId,
                name: item.product,
                uniPrice: item.unitPrice,
                totalPrice: item.total,
                quantity: item.quantity,
            })),
            supplier,
            invoiceNumber,
            purchaseDate,
            purchaseStatus,
            note,
            totalCost: finalsum,
        }
        console.log(data)
        const res = await creates(data)
        if (res) {
            toast.success("Purchase created successfully!")
            setProductCode("")
            setQuantity("")
            setUnitPrice("")
            setSupplier("")
            setInvoiceNumber("")
            setPurchaseDate("")
            setPurchaseStatus("")
            setNote("")
            setResult([])
        }
    }



    return (
        <div className='pt-4'>

            <h1 className='font-bold text-xl'>Create Purchase</h1>
            <form onSubmit={handleSubmit}  className='bg-white rounded-lg mt-4 p-4 intro-y shadow shadow-black'>
                <h3 className='border-b border-slate-400 border-dashed w-fit'>
                    Import Product
                </h3>
                <div className='pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center'>
                    <div>
                        <label htmlFor="" className='block mb-2'>Supplier</label>
                        <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="select">
                            <option value="" disabled>Select Supplier</option>
                            {(Array.isArray(suppliers) ? suppliers : []).map((item) => (
                                <option key={item._id || Math.random()} value={item._id}>
                                    {item.businessName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <fieldset className="fieldset">
                            <label className="label mb-1 text-sm font-bold" htmlFor="">Invoice Number</label>
                            <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} type="text" id="invoiceNumber" className="input" placeholder="Enter Invoice Number" />
                        </fieldset>
                    </div>
                    <div className=''>
                        <label htmlFor="" className='block mb-2'>Input Date</label>
                        <input value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} type="date" className="input" />
                    </div>

                    <div>
                        <label htmlFor="" className='block mb-2'>Status</label>
                        <select value={purchaseStatus} onChange={(e) => setPurchaseStatus(e.target.value)} className="select">
                            <option value="" disabled>Select Status</option>
                            <option value="received">Received</option>
                            <option value="ordered">Ordered</option>
                            <option value="pending">Pending</option>
                            <option value="cancel">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="" className='block mb-2'>Note</label>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="textarea" placeholder="Enter Note"></textarea>
                    </div>
                </div>

                <h3 className='pt-10 border-b border-slate-400 border-dashed w-fit'>
                    Product Details
                </h3>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 pb-5 pt-5'>

                    <div>
                        <div className="relative w-full mb-3">
                            <input
                                type="text"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                className="input w-full pr-10"
                                placeholder="Enter Product Code"
                            />
                            <button
                                type="button"
                                onClick={handleSearchProductByCode}
                                className="btn btn-xs btn-neutral absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                +
                            </button>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            <div>
                                <fieldset className="fieldset">
                                    <label className="label mb-1 text-sm font-bold">Quantity</label>
                                    <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" className="input w-full" placeholder="Enter Quantity" />
                                </fieldset>
                            </div>
                            <div>
                                <fieldset className="fieldset">
                                    <label className="label mb-1 text-sm font-bold">Unit Price</label>
                                    <input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} type="text" inputMode="numeric" className="input w-full" placeholder="0" />
                                </fieldset>
                            </div>
                        </div>
                        <div className='text-start pt-5 pb-5 flex gap-3'>
                            <h1 className='font-semibold'>Total :</h1>
                            <h1 className='text-red-500 font-bold'>{total}.00៛</h1>
                        </div>

                        <div className='flex justify-end items-end gap-4'>
                            <button onClick={handlesAddProduct} type="button" className="btn btn-neutral">Add</button>
                        </div>
                    </div>

                    <div>
                        <div className="table-scroll border border-base-content/5 bg-gray-300">
                            <table className="table bg-gray-300 min-w-[36rem]">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(result) ? result : []).map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img className="w-10 h-10" src={`${apiUrlBase}/uploads/${item.image}`} alt="" />
                                            </td>
                                            <td>{item.product}</td>
                                            <td>{item.unitPrice}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.total}</td>
                                            <td>
                                                <button
                                                    onClick={() => setResult(prev => prev.filter((_, i) => i !== index))}
                                                    className="text-lg text-error cursor-pointer"
                                                >
                                                    <IoMdTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={5} className="text-right">Total:</th>
                                        <th className='text-red-500'>{finalsum}.00៛</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </div>

                <div className='flex justify-end items-end gap-4'>
                    <Link to='/purchase' type="button" className="btn btn-neutral">Back</Link>
                    <button type="submit" className="btn btn-neutral">Save</button>
                </div>
            </form>
        </div>
    )
}

export default CreatePurchase
