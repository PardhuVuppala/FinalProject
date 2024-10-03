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
     console.log(name);

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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Certification Data
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