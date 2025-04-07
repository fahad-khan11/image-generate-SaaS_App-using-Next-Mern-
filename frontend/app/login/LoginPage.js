'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import axios from 'axios'

const LoginPage = () => {
  const [state, setState] = useState('Login');
  const { showLogin, setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || (state !== 'Login' && !name)) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      if (state === 'Login') {
        const response = await axios.post(`${backendUrl}/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);  
          setUser(response.data.user);
          localStorage.setItem('token', response.data.token);
          setShowLogin(false);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);  
          setUser(response.data.user);
          localStorage.setItem('token', response.data.token);
          setShowLogin(false);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error); 
      toast.error("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [showLogin]);

  return (
    <>
      {showLogin && (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
          <motion.form 
            onSubmit={onSubmitHandler}
            initial={{ opacity: 0.2, y: 140 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='relative bg-white p-10 rounded-xl text-slate-500'
          >
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>

            {state !== "Login" && (
              <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <Image src={assets.lock_icon} alt="" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                  className='outline-none text-sm'
                  placeholder='Full Name' 
                  required 
                />
              </div>
            )}

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
              <Image src={assets.lock_icon} alt="" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className='outline-none text-sm'
                placeholder='Email id' 
                required 
              />
            </div>

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
              <Image src={assets.lock_icon} alt="" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className='outline-none text-sm'
                placeholder='Password' 
                required 
              />
            </div>

            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>

            <button className='bg-blue-600 w-full text-white py-2 rounded-full'>
              {state === 'Login' ? 'Login' : 'Create Account'}
            </button>

            {state === 'Login' ?
              <p className='mt-5 text-center'>
                Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign up')}>Sign up</span>
              </p>
              :
              <p className='mt-5 text-center'>
                Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span>
              </p>
            }

            <Image 
              onClick={() => setShowLogin(false)}
              src={assets.cross_icon} alt="cross-icon" 
              className='absolute top-5 right-5 cursor-pointer' 
            />
          </motion.form>
        </div>
      )}
    </>
  );
}

export default LoginPage;
