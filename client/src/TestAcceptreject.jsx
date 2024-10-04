import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './UI Components/sidebar';
// import TaskList from './UI components/TaskList';
// import ProjectDetailsList from './UI components/ProjectDetailsList';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faBook, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TestAcceptreject() {
  const Navigate = useNavigate();
  const[role,setRole]=useState("")
  const [skillScores, setSkillScores] = useState([]);
  const notify = (message) => toast(message);



   
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const Employee_id = Cookies.get('Employee_id');
    setRole(role);
    //token verifucation
    const verifyToken = async () => {
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

    const fetchSkillScores = async () => {
      try {
        const response = await axios.get('http://localhost:1200/skillScore/details');
        setSkillScores(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching SkillScores:', error);
      }
    };
   

   
    verifyToken();
    fetchSkillScores();
    
  }, []);

  

   const handleAccept = async (id,skill,employeeId,courseDepartment) => {
    try {
      await axios.put(`http://localhost:1200/skillScore/update/${id}`, {
        status: 'accepted',
        skill,
        employeeId,
        courseDepartment
      });
      // Update the local state after acceptance
      setSkillScores((prevScores) =>
        prevScores.map((score) => (score.id === id ? { ...score, status: 'accepted' } : score))
      );
    } catch (error) {
      console.error('Error accepting the user:', error);
    }
  };



  const handleReject = async (id,skill,employeeId,courseDepartment) => {
    try {
      await axios.put(`http://localhost:1200/skillScore/update/${id}`, {
        status: 'rejected',
        skill,
        employeeId,
        courseDepartment
      });
      
      // Update the local state after rejection
      setSkillScores((prevScores) =>
        prevScores.map((score) => (score.id === id ? { ...score, status: 'rejected' } : score))
      );
    } catch (error) {
      console.error('Error rejecting the user:', error);
    }
  };

  


//admin TestAcceptreject
if(role==="admin")
{
  return (
<div className='flex'>
  <Sidebar className="w-1/3" />
  <div className="flex-1 p-4 grid grid-cols-3 gap-4">
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg col-span-3 row-span-5">
      <div className="h-full">
        {/* Displaying Request */}
        <div className="container mx-auto p-6">
          <table className="min-w-full bg-gray-200 border border-gray-300 shadow-lg rounded-lg overflow-hidden table-auto">
            <thead className="bg-primary-100">
              <tr>
                <th className="py-4 px-8 border-b font-semibold text-white">Course Name</th>
                <th className="py-4 px-8 border-b font-semibold text-white">Skill</th>
                <th className="py-4 px-8 border-b font-semibold text-white">Test Score</th>
                <th className="py-4 px-8 border-b font-semibold text-white">Attempts Left</th>
                <th className="py-4 px-8 border-b font-semibold text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {skillScores.map((score) => (
                <tr key={score.id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                  <td className="py-4 px-8 border-b text-gray-800">{score.courseName}</td>
                  <td className="py-4 px-8 border-b text-gray-800">{score.skill}</td>
                  <td className="py-4 px-8 border-b text-gray-800">
                    {score.testScore === 0 && score.noOfAttempts > 0 ? (
                      <span className="text-red-500 italic">Test not attempted</span>
                    ) : (
                      score.testScore
                    )}
                  </td>
                  <td className="py-4 px-8 border-b text-gray-800">{score.noOfAttempts}</td>
                  <td className="py-4 px-8 border-b text-gray-800 flex items-center space-x-2">
                    {score.status === "accepted" || score.status === "rejected" ? (
                      <span className={`font-semibold ${score.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                        {score.status}
                      </span>
                    ) : (
                      <>
                        {score.noOfAttempts === 0 && score.status === 'pending' ? (
                          <>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                              onClick={() => handleAccept(score.id, score.skill, score.employeeId, score.courseDepartment)}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                              onClick={() => handleReject(score.id, score.skill, score.employeeId, score.courseDepartment)}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-500 italic">User must attempt the test</p>
                            <button
                              className="bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
                              disabled
                            >
                              Accept
                            </button>
                            <button
                              className="bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
                              disabled
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
}


export default TestAcceptreject;