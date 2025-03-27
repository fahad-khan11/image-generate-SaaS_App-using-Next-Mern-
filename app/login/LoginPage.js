'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const LoginPage = () => {
  const [state, setState] = useState('Login')
  const { showLogin, setShowLogin } = useContext(AppContext)

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [showLogin]) // Add showLogin as a dependency

  return (
    <>
      {
        showLogin && (
          <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form className='relative bg-white p-10 rounded-xl text-slate-500'>
              <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
              <p className='text-sm'>Welcome back! Please sign in to continue</p>

              {state !== "Login" && (
                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                  <Image src={assets.lock_icon} alt="" />
                  <input type="text"
                    className='outline-none text-sm'
                    placeholder='Full Name' required />
                </div>
              )}

              <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <Image src={assets.lock_icon} alt="" />
                <input type="email"
                  className='outline-none text-sm'
                  placeholder='Email id' required />
              </div>

              <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <Image src={assets.lock_icon} alt="" />
                <input type="password"
                  className='outline-none text-sm'
                  placeholder='Password' required />
              </div>
              <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

              <button className='bg-blue-600 w-full text-white py-2 rounded-full'>
                {state === 'Login' ? 'Login' : 'Create Account'}
              </button>

              {
                state === 'Login' ?
                  <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign up')}>Sign up</span></p>
                  :
                  <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span></p>
              }

              <Image
                onClick={() => setShowLogin(false)}
                src={assets.cross_icon} alt="cross-icon" className='absolute top-5 right-5 cursor-pointer' />
            </form>
          </div>
        )
      }
    </>
  )
}

export default LoginPage