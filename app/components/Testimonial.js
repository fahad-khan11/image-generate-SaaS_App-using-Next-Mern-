'use client'
import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Testimonial = () => {
  return (
    <motion.div 
    initial={{ opacity: 0.2, y: 140 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className='flex flex-col justify-center items-center my-10 py-8 px-6 sm:px-10 md:px-28'>
         <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center'>Customer testimonials</h1>
         <p className='text-gray-500 mb-4 sm:mb-6 md:mb-8 text-center'>What Our Users Are Saying</p>

         <div className='flex flex-col md:flex-row gap-6'>
            {
                testimonialsData.map((testimonial, index) => (
                    <div key={index} className='bg-white/20 p-6 sm:p-8 md:p-12 rounded-lg shadow-md w-full sm:w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all'>
                        <div className='flex flex-col items-center'>
                            <Image src={testimonial.image} alt='testimonial-images' className='rounded-full w-12 sm:w-14' />
                            <h2 className='text-lg sm:text-xl font-semibold mt-3'>{testimonial.name}</h2>
                            <p className='text-gray-500 mb-2 sm:mb-4'>{testimonial.role}</p>
                            <div className='flex mb-2 sm:mb-4'>
                                {
                                    Array(testimonial.stars).fill().map((_, idx) => (
                                        <Image src={assets.rating_star} alt='rating-icons' key={idx} />
                                    ))
                                }
                            </div>
                            <p className='text-center text-sm text-gray-600'>{testimonial.text}</p>
                        </div>
                    </div>
                ))
            }
         </div>
    </motion.div>
  )
}

export default Testimonial