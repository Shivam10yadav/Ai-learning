import React from 'react'
import Hero from '../../components/Hero'
import Features from '../../components/Features'
import Testimonials from '../../components/Testimonials'
import FAQ from '../../components/FAQ'
import Footer from '../../components/Footer'

const HomePage = () => {
  return (
    <div>
        <Hero/>
        <Features/>
        <Testimonials/>
        <FAQ/>
        <Footer/>
    </div>
  )
}

export default HomePage