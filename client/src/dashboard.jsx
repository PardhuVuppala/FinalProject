import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './UI Components/sidebar';
// import TaskList from './UI components/TaskList';
// import ProjectDetailsList from './UI components/ProjectDetailsList';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';


function dashboard() {
  const Navigate = useNavigate();
  const[NewRequest, setNewRequest] = useState(false)
  const[skill,setskill] = useState("")
  const[description,setdescription] = useState("")
  const [skillsets, setSkillsets] = useState([]);
  const[role,setRole]=useState("")
  const [skillScores, setSkillScores] = useState([]);


   
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
    

    
     //user requests
    //getSkillsetsrequests for particular user
    const getSkillsetsrequests = async (employeeId) => {
      try {
        const response = await axios.get(`http://localhost:1200/newskill/skillsets/${employeeId}`);
        console.log('Skillsets:', response.data);
        setSkillsets(response.data)
      } catch (error) {
        console.error('Error fetching skillsets:', error);
      }
    };


    //Fetch skill to display for Admin
    const fetchSkillScores = async () => {
      try {
        const response = await axios.get('http://localhost:1200/skillScore/details');
        setSkillScores(response.data);
      } catch (error) {
        console.error('Error fetching SkillScores:', error);
      }
    };

    verifyToken();
    fetchSkillScores();
    getSkillsetsrequests(Employee_id);
  }, []);





  //Model Function for New Request for closing and Opening
  const NewSkillRequest =()=>
   {
    setNewRequest(!NewRequest)
   }
    
   


   //admin api requests


   const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:1200/skillScore/update/${id}`, {
        status: 'Accepted'
      });
      // Update the local state after acceptance
      setSkillScores((prevScores) =>
        prevScores.map((score) => (score.id === id ? { ...score, status: 'Accepted' } : score))
      );
    } catch (error) {
      console.error('Error accepting the user:', error);
    }
  };



  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:1200/skillScore/update/${id}`, {
        status: 'Rejected'
      });
      // Update the local state after rejection
      setSkillScores((prevScores) =>
        prevScores.map((score) => (score.id === id ? { ...score, status: 'Rejected' } : score))
      );
    } catch (error) {
      console.error('Error rejecting the user:', error);
    }
  };




  const RequestSubmit = async(e)=>
  {     
         

    e.preventDefault()
      const data ={
      employeeId: Cookies.get('Employee_id'),
      skill: skill,
      description: description,
      status: 'pending',
    }
    //  const data ={
    //     employeeId: Cookies.get('Employee_id'),
    //     skill: 'Node',
    //     description: 'Backend development',
    //     status: 'pending',
    //   }
      try {
        const response = await axios.post('http://localhost:1200/newskill/skillsets', data);
        console.log('Skillset created:', response.data);
      } 
      catch (error) {
        console.error('Error creating skillset:', error);
      }
 
        setskill("");
        setdescription("");
        setNewRequest(!NewRequest)

  }



if(role==="user"){
  return (
    <div className='flex'>
    <Sidebar className="w-1/3" />
    <div className="flex-1 p-4 grid grid-cols-3 gap-4">
      <div className="bg-gray-200 p-4 rounded shadow">01</div>
      <div className="bg-gray-200 p-4 rounded shadow">05</div>
      <div className="bg-gray-200 p-4 rounded shadow">05</div>
      
      <div className=" bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
      <div className=" h-full">
      {/* displaying request */}
      <div>
      {skillsets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Skill</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {skillsets.map((skillset) => (
                <tr key={skillset.id} className="border-b">
                  <td className="px-4 py-2">{skillset.skill}</td>
                  <td className="px-4 py-2">{skillset.description}</td>
                  <td className="px-4 py-2">{skillset.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No skillsets found for this employee.</p>
      )}
    </div>
      


      {/* floating Button Model */}
      {NewRequest && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto  bg-opacity-80 flex justify-center items-center"
        >
          <div className="relative p-0 w-1/4 max-w-3xl">
            <div className="relative flex flex-col md:flex-row space-y-2 md:space-y-0 shadow-2xl rounded-2xl">
              <div className="p-4 md:p-10 flex-grow bg-white shadow-2xl rounded-2xl">
                <button
                  onClick={NewSkillRequest}
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" style={{border:"0px"}}  >
                <div className="flex items-center">
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 1L3 7l6 6"
                        />
                    </svg>
                    <span className="ml-1.5">back</span>
                </div>

                </button>
                <div class="relative">
                <form class="space-y-4 mt-5" onSubmit={RequestSubmit}>

                  {/* Skill Selection */}

                    <div>
                    <span className='mb-2 text-md'>Skill</span>
                    <input type="text" name="skill" id="skill" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  value={skill} onChange={(e)=>setskill(e.target.value)} />
                    </div>
      
                  {/* Description */}
                    <div>
                    <span className='mb-2 text-md'>Description</span>
                    <textarea type="text" name="description" id="description" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={description} onChange={(e)=>setdescription(e.target.value)}    />
                    </div>
                    <button type="submit" className="w-full bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2" >Submit Request</button>
                  
                </form>
            </div>
             </div>
            
            </div>
          </div>
        </div>
      )}

  {/* floating Button */}
    <div className="fixed bottom-5 right-5 z-[1000]">
        <button
          className="bg-gray-200 hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-full flex items-center"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          onClick={NewSkillRequest} >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 3H5a2 2 0 00-2 2v4a2 2 0 002 2h5l5 5V6l-5 5z"
            />
          </svg>
            Add Request
        </button>
      </div>
        </div>
       </div>
      </div>
    </div>
  );
}




//admin dashboard
else if(role==="admin")
{
  return (
    <div className='flex'>
    <Sidebar className="w-1/3" />
    <div className="flex-1 p-4 grid grid-cols-3 gap-4">
      <div className="bg-gray-200 p-4 rounded shadow">01</div>
      <div className="bg-gray-200 p-4 rounded shadow">05</div>
      <div className="bg-gray-200 p-4 rounded shadow">05</div>
      
      <div className=" bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
      <div className=" h-full">
      {/* displaying request */}
     
      <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Skill Score Details</h1>
      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-indigo-50">
          <tr>
            <th className="py-4 px-6 border-b font-semibold text-gray-700">Course Name</th>
            <th className="py-4 px-6 border-b font-semibold text-gray-700">Skill</th>
            <th className="py-4 px-6 border-b font-semibold text-gray-700">Test Score</th>
            <th className="py-4 px-6 border-b font-semibold text-gray-700">No of Attempts</th>
            <th className="py-4 px-6 border-b font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {skillScores.map((score) => (
            <tr key={score.id} className="hover:bg-gray-50 transition duration-200 ease-in-out">
              <td className="py-4 px-6 border-b text-gray-800">{score.courseName}</td>
              <td className="py-4 px-6 border-b text-gray-800">{score.skill}</td>
              <td className="py-4 px-6 border-b text-gray-800">
                {score.testScore === 0 && score.noOfAttempts > 0 ? (
                  <span className="text-red-500 italic">Test is not attempted</span>
                ) : (
                  score.testScore
                )}
              </td>
              <td className="py-4 px-6 border-b text-gray-800">{score.noOfAttempts}</td>
              <td className="py-4 px-6 border-b text-gray-800">
              {score.status === "Accepted" || score.status === "Rejected" ? (
    <span className={`font-semibold ${score.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
      {score.status}
    </span>
  ) : (
    <>
      {score.noOfAttempts === 0 ? (
        <>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2 transition duration-200 ease-in-out"
            onClick={() => handleAccept(score.id)}
          >
            Accept
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
            onClick={() => handleReject(score.id)}
          >
            Reject
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-500 italic">User has to attempt the test</p>
          <button 
            className="bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
            disabled
          >
            Accept
          </button>
          <button 
            className="bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-md cursor-not-allowed ml-2"
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


export default dashboard;