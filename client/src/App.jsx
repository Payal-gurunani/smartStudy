import { useState } from 'react'
import "./App.css"
import { Routes, Route,useLocation } from 'react-router-dom'
import Login from './authentication/Login.jsx'
import Register from './authentication/Register.jsx'
import { AnimatePresence } from 'framer-motion'

function App() {
  const location = useLocation();
  return (
    <>
     <AnimatePresence mode='wait'> 
      <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      </Routes>
     </AnimatePresence>
    </>
  )
}

export default App
