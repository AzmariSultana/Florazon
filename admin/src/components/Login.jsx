import axios from 'axios'
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';

const Login = ({setToken}) => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post(backendUrl + '/api/user/admin', {email,password})
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }
            
            
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
        <div className='card px-8 py-8 sm:px-10 w-full max-w-md mx-4'>
            <p className='eyebrow'>Florazon</p>
            <h1 className='text-2xl font-semibold text-ink mt-1 mb-6'>Admin Panel</h1>
            <form onSubmit={onSubmitHandler}>
                <div className='mb-4'>
                    <label htmlFor='admin-email' className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                    <input id='admin-email' autoComplete='username' onChange={(e)=>setEmail(e.target.value)} value={email} className='w-full px-3.5 py-2.5' type="email" placeholder='your@email.com' required />
                </div>
                <div className='mb-4'>
                    <label htmlFor='admin-password' className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                    <input id='admin-password' autoComplete='current-password' onChange={(e)=>setPassword(e.target.value)} value={password}
                    className='w-full px-3.5 py-2.5' type="password" placeholder='Enter your password' required />
                </div>
                <button disabled={loading} className='btn-primary w-full mt-2' type="submit">{loading ? 'Logging in...' : 'Login'}</button>
            </form>
        </div>

    </div>
  )
}

export default Login