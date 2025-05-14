import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes,Route} from 'react-router'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import User from './components/User.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<App/>}></Route>
    <Route element={<Login/>} path='/login'/>
    <Route element={<Register/>} path='/register'/>
    <Route element={<User/>} path='/me'/>
   </Routes>
  </BrowserRouter>,
)
