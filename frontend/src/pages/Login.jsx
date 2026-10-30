import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState]= useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const [loading, setLoading] = useState(false)

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
      navigate('/')
    }
  },[token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>

      </div>
      {currentState=== 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" aria-label='Name' autoComplete='name' className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" aria-label='Email' autoComplete='email' className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" aria-label='Password' minLength={currentState === 'Sign Up' ? 8 : undefined} autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'} className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        {
          currentState=== 'Login'
          ? <button type='button' onClick={()=>setCurrentState('Sign Up')}>Create account</button>
          : <button type='button' onClick={()=>setCurrentState('Login')}>Login here</button>
        }

      </div>
      <button type='submit' disabled={loading} className='bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed'>{loading ? 'Please wait...' : currentState=== 'Login' ? 'Sign In' : 'Sign Up'}</button>

    </form>
  )
}

export default Login