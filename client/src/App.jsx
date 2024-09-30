import { useState } from 'react'
import './App.css'
import Login from './login.jsx';
import Dashboard from './dashboard.jsx';
import SignUp from './SignUp.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path='/Dashboard' element={<Dashboard/>}/>
       <Route path='/SignUp' element={<SignUp/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App