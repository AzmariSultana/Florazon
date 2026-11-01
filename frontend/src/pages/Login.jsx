import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDocumentTitle from '../utils/useDocumentTitle'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState]= useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  // Pages that send users here can pass { state: { from } } to come back after logging in
  const returnTo = location.state?.from || '/'
  useDocumentTitle(currentState === 'Login' ? 'Login' : 'Create account')

  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')

  const onSubmitHandler= async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
        } else {
          toast.error(response.data.message)
        }        

      } else {
        const response = await axios.post(backendUrl + '/api/user/login',{email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token',response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if (token) {
      navigate(returnTo, { replace: true })
    }
  },[token, navigate, returnTo])

  return (
    <form onSubmit={onSubmitHandler} className='card flex flex-col items-center w-full max-w-md m-auto mt-10 sm:mt-16 gap-4 p-6 sm:p-10 text-gray-800 animate-fade-up'>
      <div className='text-center'>
        <p className='eyebrow'>{currentState === 'Login' ? 'Welcome back' : 'Join Florazon'}</p>
        <h1 className='mt-2 font-display text-4xl text-ink'>
          {currentState === 'Login' ? <>Sign <span className='text-brand'>in</span></> : <>Create <span className='text-brand'>account</span></>}
        </h1>
      </div>
      <p className='text-sm text-gray-500 -mt-1 mb-2 text-center'>{currentState === 'Login' ? 'Sign in to see your cart and orders.' : 'Save your cart and follow every order.'}</p>
      {currentState=== 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" aria-label='Name' autoComplete='name' className='field' placeholder='Name' required/>}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" aria-label='Email' autoComplete='email' className='field' placeholder='Email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" aria-label='Password' minLength={currentState === 'Sign Up' ? 8 : undefined} autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'} className='field' placeholder='Password' required/>
      <div className='w-full flex justify-end text-sm -mt-1'>
        {
          currentState=== 'Login'
          ? <button type='button' onClick={()=>setCurrentState('Sign Up')} className='btn-link'>Create account</button>
          : <button type='button' onClick={()=>setCurrentState('Login')} className='btn-link'>I already have an account</button>
        }

      </div>
      <button type='submit' disabled={loading} className='btn-primary w-full mt-2'>{loading ? 'Please wait...' : currentState=== 'Login' ? 'Sign in' : 'Create account'}</button>

    </form>
  )
}

export default Login