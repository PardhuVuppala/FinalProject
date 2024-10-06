import React from 'react'
import { Link,  useNavigate } from 'react-router-dom'
import Cookies from "js-cookie"
import { useEffect,useState } from 'react'


export default function sidebar() {
    const [name,setName] = useState("")
    const [role,setRole] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
     setName(Cookies.get("name"))
     setRole(Cookies.get("role"))
    

    },[])
    const HandleLogout =(e)=>
    {   e.preventDefault();
        Cookies.remove("name");
        Cookies.remove("token");
        Cookies.remove("user_id")
        Cookies.remove("role")
        navigate("/");
       
    }
   
  return (
    <div>
    <div className="flex h-screen bg-gray-100">
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase">{name}</span>
        </div>
    <div className="flex flex-col flex-1 overflow-y-auto">
        <Link to="/DashBoard" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    Dashboard
        </Link>
        {role === 'admin' && (<Link to="/CertificationData" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v16H4z M8 8l8 8 M16 8l-8 8" />
            </svg>
                Certification Data
        </Link> )}

        {role === 'admin' && (<Link to="/QuizForm" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

           Assessment Creation
        </Link> )}

        {role === 'admin' && (<Link to="/TestAcceptreject" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"  stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
           </svg>
            Test Results
        </Link> )}

        {role === 'admin' && (<Link to="/ViewCourses" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6 mr-2" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            View Courses
        </Link> )}

        {role === 'user' && (<Link to="/SkillTest" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"  stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>

            View Tests
        </Link> )}

        {role === 'user' && (<Link to="/coursesAdd" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6 mr-2" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>

          Courses
        </Link> )}
            <Link onClick={HandleLogout} className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6 mr-2" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>

                Logout
            </Link>

        </div>
    </div>

    <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
         
        </div>
    </div>
    
</div>


</div>
  )
}