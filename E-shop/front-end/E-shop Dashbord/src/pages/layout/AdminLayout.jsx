import React from 'react'
import Topmenu from '../components/Topmenu'
import { Outlet, useLocation } from 'react-router'
import Slidebar from '../components/Slidebar'
import { useEffect, useState } from 'react'

function AdminLayout() {
    const [isShowSlidebar, setIsShowSlidebar] = useState(true)
    const { pathname } = useLocation()

    // On phones the sidebar is an overlay drawer, so it must start closed.
    // Also re-syncs on navigation so tapping a link reveals the page, not the menu.
    useEffect(() => {
        setIsShowSlidebar(window.matchMedia('(min-width: 64rem)').matches)
    }, [pathname])

    return (
    <>
    <div className='flex h-screen overflow-hidden'>
        <Slidebar isShowSlidebar={isShowSlidebar} onClose={() => setIsShowSlidebar(false)} />
        <div className='grow min-w-0 flex flex-col overflow-y-auto'>
            <Topmenu
                isShowSidebarButton={true}
                onShowSidebar={ () => setIsShowSlidebar(!isShowSlidebar) }
            />
            <div className='app-shell bg-gray-200 flex-1 p-3 sm:p-5'>
            <Outlet/>
            </div>
        </div>
    </div>
    </>
  )
}

export default AdminLayout
