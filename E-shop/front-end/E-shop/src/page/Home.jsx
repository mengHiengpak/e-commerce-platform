import React from 'react'
import Hero from '../components/theme/Hero'
import Banner from '../components/theme/Banner'
import Product from './Product'

function Home() {
    return (
        <div className="flex flex-col gap-2 sm:gap-3">
            <Hero />
            <Product/>
            <Banner />
        </div>
    )
}

export default Home