import React,{useState} from 'react'
import { useNavigate } from 'react-router'
import apiClient from '../../service/apiClient'
function Login() {
 
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const navigate=useNavigate()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        setError('')
        //make api call with data
        //return resposne
        //take action based on response
        try {
           console.log("Trying to do a login")
           const data=await apiClient.login(email,password)
           console.log("signup response",data)
           if(data.success==true)
            navigate("/me")
        else
        setError(data.message||"Signup failed")
        } catch (error) {
            
        }
        setLoading(false)

    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className='form-group'>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required value={password}  onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button type='submit' disabled={loading}>{loading?"Login...":"Login"}</button>
      </form>
      <p>{error?error:""}</p>
    </div>
  )
}

export default Login
