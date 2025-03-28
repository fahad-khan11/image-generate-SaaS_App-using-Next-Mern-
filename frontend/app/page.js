import React from 'react'
import Buy from './buy/page'
import Result from './result/page'
import Header from './components/Header'
import Step from './components/Step'
import Description from './components/Description'
import Testimonial from './components/Testimonial'
import GenerateBtn from './components/GenerateBtn'
import Footer from './components/Footer'

const page = () => {
  return (
    <div>
      <main>
        <Header/>
        <Step/>
        <Description/>
        <Testimonial/>
        <GenerateBtn/>
      </main>
    </div>
  )
}

export default page 