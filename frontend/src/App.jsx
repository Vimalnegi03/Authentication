import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'

function App() {
  const [name, setName] = useState("Vimal")
  
  return (
    <>
      <h1>Welcome {name}</h1>
      <Login/>
      <button onClick={()=>{
        setName("Vicky")
      }}>ChangeName</button>
    </>
  )
}

export default App
