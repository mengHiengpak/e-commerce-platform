import { useState } from 'react'
import { useQuery } from '../../../hook/useQuery'
import { apiUrlBase } from '../../../config/env'
import { useCheckStock } from '../../../hook/useCheckStock';
import { IoMdTrash } from 'react-icons/io';
import SalePayment from '../SalePayment';

function POSforCashier() {
  const { data: categories} = useQuery('categories');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const {data: products} = useQuery('product', search);
  const [addToCart, setAddToCart] = useState([]);
  const { checkStock } = useCheckStock();
  const [isOpenStatus, setIsOpenStatus] = useState(false);


const handleAddToCart = async (product) => {
  const exists = addToCart.find(item => item.productId === product._id);

  if (exists) {
    // Update quantity if product already in cart
    const newQuantity = exists.Quantity + 1;

    // Re-validate stock against the new total before increasing quantity
    const res = await checkStock(product._id, newQuantity);
    if (!res?.success) return;

    setAddToCart(prevCart =>
      prevCart.map(item => {
        if (item.productId === product._id) {
          return {
            ...item,
            Quantity: newQuantity,
            Total: item.Price * newQuantity
          };
        }
        return item;
      })
    );
  } else {
    // Add new product to cart
    const data = {
      productId: product._id,
      Product: product.name,
      Quantity: 1,
      Price: product.salePrice,
      Total: product.salePrice
    };

    const res = await checkStock(data.productId, data.Quantity);
    if (res?.success) {
      setAddToCart(prevCart => [...prevCart, data]);
    }
  }
};

const handleIncreaseQuantity = async (item) => {
  const newQuantity = Number(item.Quantity) + 1;

  const res = await checkStock(item.productId, newQuantity);
  if (!res?.success) return;

  setAddToCart(prevCart =>
    prevCart.map(c =>
      c.productId === item.productId
        ? { ...c, Quantity: newQuantity, Total: c.Price * newQuantity }
        : c
    )
  );
};

  return (
    <>
      <SalePayment
        open={isOpenStatus}
        addToCart={addToCart}
        onClose={() => {
          setIsOpenStatus(false)
        }}
      />

      <div>
        <h1 className='text-xl sm:text-3xl font-bold mb-2 pt-3 sm:pt-5'>Point of Sale</h1>
      </div>

      <div className='flex flex-col xl:flex-row justify-between items-start gap-4'>
        <div className='w-full xl:w-auto min-w-0'>
          <div>
            <div className='flex flex-wrap justify-between items-center gap-2 w-full bg-white border border-gray-300 p-2 rounded-lg shadow-sm'>
              <h1 className='font-bold text-gray-700'>Categories</h1>
              <div className="relative">
                <label className="input input-sm border border-gray-300 w-full sm:w-64 bg-white">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </g>
                  </svg>
                  <input type="search" onChange={(e) => setSearch(e.target.value)}  required placeholder="Search" />
                </label>
              </div>
            </div>

            <div className='text-sm breadcrumbs flex mt-4 items-center bg-white border border-gray-300 p-2 w-full rounded-lg shadow-sm gap-2 overflow-x-auto'>
              <button onClick={() => setSelectedCategory('All')} className={`btn btn-neutral border-none text-sm ${selectedCategory === 'All' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>All</button>
              {categories?.map((category) => (
                <button key={category.id} onClick={() => setSelectedCategory(category.name)} className={`btn btn-neutral border-none text-sm ${selectedCategory === category.name ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
                  {category.name}
                </button>
              ))}
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mt-4'>
              {products?.filter(product => selectedCategory === 'All' || product.category?.name === selectedCategory).map((product) => (
                <div key={product.id} onClick={() => handleAddToCart(product)} className='bg-white p-2 rounded-md shadow-md border border-gray-200'>
                  <div className='p-2 text-center'>
                    <img src={`${apiUrlBase}/uploads/${product.imageUrl}`} alt={product.name} className='w-20 h-32 object-cover rounded-md mb-2 mx-auto' />
                    <h1 className='text-gray-800 font-semibold'>{product.name}</h1>
                    <p className='text-red-600 font-bold'>៛{Number(product.salePrice).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-300 rounded-lg shadow-md p-2 w-full xl:w-112 shrink-0'>
          <div className='flex justify-between items-center'>
            <h1 className='pl-4 text-lg font-bold'>Cart</h1>
            <button className='btn btn-neutral px-3'
            onClick={() => setAddToCart([])}
            >Clear</button>
          </div>

          <div className="table-scroll mt-3 border-b border-b-gray-300 ">
            <table className="table w-full min-w-[24rem]">
              <thead className="bg-gray-700 text-xs text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-center">Quantity</th>
                  <th className="py-2 px-4 text-right">Price</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 ">
                {addToCart?.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 font-medium text-sm">{item.Product}</td>
                    <td><div className="py-1 px-1 text-center join join-sm flex justify-end items-end">
                      <button className="join-item btn" onClick={() => setAddToCart(prevCart => prevCart.map((c, i) => i === index ? { ...c, Quantity: Math.max(1, c.Quantity - 1), Total: c.Price * Math.max(1, c.Quantity - 1) } : c))} disabled={item.Quantity <= 1} >{'<'}</button>
                      <button className="join-item btn">{item.Quantity}</button>
                      <button className="join-item btn" onClick={() => handleIncreaseQuantity(item)}>{'>'}</button>
                    </div></td>
                    <td className="py-2 px-4 text-right">៛{Number(item.Price).toFixed(2)}</td>
                    <td className="py-2 px-4 text-center">
                      <button className="btn btn-error btn-sm text-white"
                      onClick={() => setAddToCart(prevCart => prevCart.filter((_, i) => i !== index))}
                      >
                        <IoMdTrash /></button>
                    </td>
                  </tr>
                ))}
                {addToCart?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">Cart is empty</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            <div className='flex justify-between items-center p-2 font-bold text-xl'>
              <span>Total: </span><span>៛{addToCart?.reduce((sum, item) => sum + Number(item.Price) * Number(item.Quantity), 0).toFixed(2)}</span>
            </div>
            <div>
              <button className={`btn btn-neutral w-full text-lg ${addToCart && addToCart.length > 0 ? "block" : "hidden"}`} onClick={() => setIsOpenStatus(true)} >Add Payment</button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default POSforCashier