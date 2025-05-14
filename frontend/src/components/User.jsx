import React,{useState,useEffect} from 'react'
import apiClient from '../../service/apiClient'


function User() {
    const [user, setUser] = useState("")
 

useEffect(()=>{
    async function getdata()
    {
    try {
        
    const data=await apiClient.getUser()
    console.log(data.user)
    setUser(data.user)
    } catch (error) {
        
    }
}
getdata()
},[])
  return (
    <div>
      <h1>hello</h1>
      <div>name:{user.name}</div>
      <div>email:{user.email}</div>
      <div>role:{user.role}</div>
      <div>isEmailVerified:{user.isVerified}</div>
    </div>
  )
}

export default User
