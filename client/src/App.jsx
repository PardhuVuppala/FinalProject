import { useState } from 'react'
import Login from './login.jsx';
import Dashboard from './dashboard.jsx';
import SignUp from './SignUp.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SkillTest from './SkillTest.jsx';
import TestWindow from './TestWindow.jsx';
import CertificationData from './CertificationData.jsx';
import QuizForm from './QuizForm.jsx';
import GraphicalAnalasis from './GraphicalAnalasisForCertification.jsx';
import TestAcceptreject from './TestAcceptreject.jsx';
import Courses from './Courses.jsx';
import CoursesAdded from './CoursesAdded.jsx';
import AnalysisTime from './GraphicalAnalysis.jsx';
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
       <Route path='/QuizForm' element={<QuizForm/>}/>
       <Route path='/GraphicalAnalasis' element={<GraphicalAnalasis/>}/>
       <Route path='/TestAcceptreject' element={<TestAcceptreject/>}/>
       <Route path='/ViewCourses' element={<Courses/>}/>
       <Route path='/coursesAdd' element={<CoursesAdded/>}/>
       <Route path="/AnalysisTime" element={<AnalysisTime/>}/>

      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App