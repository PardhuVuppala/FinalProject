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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5l3 3 5-5M9 12l2 2 4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m16-8h-4a2 2 0 00-2 2v2m0 4v2a2 2 0 002 2h4" />
            </svg>
           Assessment Creation
        </Link> )}

        {role === 'admin' && (<Link to="/TestAcceptreject" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3m0 0h3m-6 0v3m0-3v-3m6 6v3m0-3v-3m-9-5V6a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
            Test Results
        </Link> )}

        {role === 'user' && (<Link to="/SkillTest" className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            View Tests
        </Link> )}
            <Link onClick={HandleLogout} className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700" style={{ textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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