
import React from 'react'
import Topmenu from '../components/Topmenu'
import { Outlet } from 'react-router'

function CashierLayout() {
  return (
    <>
        <div className='flex h-screen flex-col overflow-hidden'>
            <Topmenu isShowSidebarButton={false} />
            <div className='app-shell bg-gray-100 flex-1 overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    </>
  )
}

export default CashierLayout
