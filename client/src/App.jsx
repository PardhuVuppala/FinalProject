import { useState } from 'react'
import Login from './login.jsx';
import Dashboard from './dashboard.jsx';
import SignUp from './SignUp.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SkillTest from './SKillTest.jsx';
import TestWindow from './TestWindow.jsx';
import CertificationData from './CertificationData.jsx';
function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path='/Dashboard' element={<Dashboard/>}/>
       <Route path='/SignUp' element={<SignUp/>}/>
       <Route path='/skilltest' element={<SkillTest/>}/>
       <Route path='/TestWindow/:examId' element={<TestWindow/>}/>
       <Route path='/CertificationData' element={<CertificationData/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App