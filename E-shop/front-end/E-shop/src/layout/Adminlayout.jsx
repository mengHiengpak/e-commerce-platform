import Header from '../components/theme/Header'
import Footer from '../components/theme/Footer'
import { Outlet } from 'react-router-dom'

function Adminlayout() {
  return (
    <div className='relative min-h-screen bg-white'>
      <div className='sticky top-0 left-0 w-full z-50 bg-white text-black'>
        <Header/>
      </div>
      <main className='relative '>
        <Outlet/>
      </main>
      <div>
        <Footer/>
      </div>
    </div>
  )
}

export default Adminlayout