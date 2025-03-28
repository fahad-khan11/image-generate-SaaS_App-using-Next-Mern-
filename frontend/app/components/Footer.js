import Image from 'next/image'
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20 mb-3'>
        <Image src={assets.logo} alt="" width={150}/>
        <p className='flex-1  border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @GreatStack.dv || All right reservied.</p>

        <div className='flex gap-2.5'>
            <Image src={assets.facebook_icon} alt="facebook-icon" width={35} />

            <Image src={assets.twitter_icon} alt="twitter-icon" width={35} />

            <Image src={assets.instagram_icon} alt="intagram-icon" width={35} />
        </div>
    </div>
  )
}

export default Footer