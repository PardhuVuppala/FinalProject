import React, { useEffect,useState } from 'react'
import Sidebar from './UI Components/sidebar'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SKillTest() {
    const [examDetails, setExamDetails] = useState([]);
    const Navigate = useNavigate();


 useEffect(()=>
  {
    const token = Cookies.get("token");
    const Employee_id = Cookies.get('Employee_id')
  
     
    //token verifucation
    const verifyToken = async() => {
      try {
        const response = await axios.get("http://localhost:1200/Employee/is-verify", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
     
      } catch (error) {
        console.error(error);
        Navigate("/");
      }
    };
    
    const GetExamDetails = async(Employee_id)=>
    {           
        try { 
            const response = await axios.get(`http://localhost:1200/newskill/skill-scores/employee/${Employee_id}`); // Update the URL as needed
            setExamDetails(response.data);
            console.log(response.data)
          } catch (error) {
            console.error('Error fetching exam details:', error);
          } 
    }
    verifyToken();
    GetExamDetails(Employee_id)
 },[])


    // Logic to navigate to the test page or handle test-taking action
    const handleTakeTest = (examId,id) => {
        Cookies.set("SkillScoreid",id);
        // Navigate to the TestWindow page with examId in the URL
        Navigate(`/TestWindow/${examId}`);
      };  

  return (
    <div className='flex'>
    <Sidebar className="w-1/3" />
    <div className="flex-1 p-4 grid grid-cols-3 gap-4">
      <div className="bg-gray-200 p-4 rounded shadow">01</div>
      <div className="bg-gray-200 p-4 rounded shadow">05</div>
      <div className="bg-gray-200 p-4 rounded shadow">05</div>

      <div className=" bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
      <div className=" h-full">
      <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Test Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Attempts</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Take Test</th>
          </tr>
        </thead>
        <tbody>
  {examDetails.length > 0 ? (
    examDetails.map((exam) => (
      <tr key={exam.id} className="hover:bg-gray-50">
        <td className="border border-gray-300 px-4 py-2">{exam.testName}</td>
        <td className="border border-gray-300 px-4 py-2">{exam.testScore}</td>
        <td className="border border-gray-300 px-4 py-2">{exam.status}</td>
        <td className="border border-gray-300 px-4 py-2">{exam.noOfAttempts}</td>
        <td className="border border-gray-300 px-4 py-2">
          {exam.noOfAttempts === 0 ? (
            <span className="text-gray-500">Test Attempted</span>
          ) : (
            <button
              onClick={() => handleTakeTest(exam.assessmentId, exam.id)}
              className="bg-primary-100 text-white px-1 py-1 rounded hover:bg-gray-200 transition duration-200"
            >
              Take Test
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">No exam details found.</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
      </div>

    </div>
    </div>
    </div>
  )
}
