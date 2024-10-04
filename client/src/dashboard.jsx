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


function dashboard() {
  const Navigate = useNavigate();
  const[NewRequest, setNewRequest] = useState(false)
  const[RequestWithoutCertification, setRequestWithoutCertification] = useState(false)
  const[RequestWithCertification,setRequestWithCertification]=useState(false)
  const[skill,setskill] = useState("")
  const[description,setdescription] = useState("")
  const [skillsets, setSkillsets] = useState([]);
  const[role,setRole]=useState("")
  const [skillScores, setSkillScores] = useState([]);
  const[Certification,setCertification] = useState("")
  const[Cskill,setCskill] = useState("");
  const[Image,setImage] = useState("");
  const[cdescription,setcdescription] = useState("");
  const[courseDepartment,setcourseDepartment] = useState("")
  const [certifications, setCertifications] = useState([]);
  const [data, setData] = useState([]);
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

    // Skill Request status with Certificate 
    const getCertificationsByEmployeeId = async () => {
      const Employee_id = Cookies.get('Employee_id');
    
      try {
        const response = await axios.get(`http://localhost:1200/certificate/certifications/${Employee_id}`);
    
        if (response.status === 200) {
          console.log('Certifications fetched:', response.data.certifications);
          setCertifications(response.data.certifications)
          // You can update your state here to display the fetched certifications
        } else {
          console.error('Error fetching certifications:', response.data);
        }
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    };



    //Fetch skill to display for Admin
    const fetchSkillScores = async () => {
      try {
        const response = await axios.get('http://localhost:1200/skillScore/details');
        setSkillScores(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching SkillScores:', error);
      }
    };
    const fetchSkillSet = async (employeeId) => {
      try {
        const response = await axios.get(`http://localhost:1200/skill/skillset/${employeeId}`);
        setData(response.data);
      } catch (error) {
        notify('Error fetching skill set data.');
        console.error('Error fetching skill set data:', error);
      } 
    };

   
    verifyToken();
    fetchSkillScores();
    getSkillsetsrequests(Employee_id);
    getCertificationsByEmployeeId();
    fetchSkillSet(Employee_id);
    
  }, []);

  const groupedCertifications = certifications.reduce((acc, cert) => {
    if (cert.status === "accepted") {
      const { courseDepartment, courseName } = cert;
  
      // Initialize the department if it doesn't exist
      if (!acc[courseDepartment]) {
        acc[courseDepartment] = { courseNames: new Set(), department: courseDepartment }; // Use Set for unique values
      }
      acc[courseDepartment].courseNames.add(courseName); // Add course name to Set
    }
    return acc;
  }, {});
  
  // Convert Sets to Arrays for rendering
  const groupedCertificationsArray = Object.values(groupedCertifications).map(group => ({
    department: group.department,
    courseNames: Array.from(group.courseNames), // Convert Set to Array
  }));

  //Model Function for New Request for closing and Opening
  const NewSkillRequest =()=>
   {
    setNewRequest(!NewRequest)
   }
    

   const WithoutCertificationSkillRequest=()=>
   {
    setRequestWithoutCertification(!RequestWithoutCertification);
    if(NewRequest!=false)
    {
    setNewRequest(!NewRequest);
    }
   }

   const CertificationSkillRequest=()=>
   {
    setRequestWithCertification(!RequestWithCertification);
    if(NewRequest!=false)
      {
      setNewRequest(!NewRequest);
      }
   }


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
          notify("Skillset Request Added")
        } 
        catch (error) {
          if (error.response && error.response.status === 400) {
            notify("Skillset already exists for this employee")
          }
          console.error('Error creating skillset:', error);
          
        }
   
          setskill("");
          setdescription("");
          setRequestWithoutCertification(!RequestWithoutCertification);
    }
  
   
    

   //admin api requests


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


  const CertificateRequestSubmit = async (e) => {
    e.preventDefault();
    const Employee_id = Cookies.get('Employee_id');
  
    const certificationData = {
      employeeId: Employee_id,
      courseName: Certification,
      certificationLink: Image,
      skills: Cskill,
      courseDepartment: courseDepartment,
      status: 'pending',  // Example status
      certificationDate: new Date(),  // Example date
    };
  
    try {
      const response = await axios.post('http://localhost:1200/certificate/certifications', certificationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        console.log('Certification added:', response.data);
        notify("Certification added successfully!"); // Notify on success
      } else {
        console.error('Error adding certification:', response.data);
      }
    } catch (error) {
      if (error.response) {
        // Check if the error message indicates a pending or accepted request
        if (error.response.data.message.includes('pending or accepted')) {
          notify("Certification request is already pending or accepted for this course."); // Notify the user
        } else {
          notify(error.response.data.message); // Display the server error message
        }
      } else {
        console.error('Error:', error.message);
        notify("An unexpected error occurred. Please try again."); // General error notification
      }
    }
  
    // Reset form fields after submission
    setRequestWithCertification(!RequestWithCertification);
    setCertification('');
    setImage('');
    setcdescription('');
    setCskill('');
    setcourseDepartment('');
  };
  


if(role==="user"){
  return (
    <div className='flex'>
    <Sidebar className=" flex w-1/3 " />
    <ToastContainer/>
    <div className="flex-1 p-4 grid grid-cols-3 gap-4">
      {data.map((skillDetail) => (
        <div key={skillDetail.id} className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
          <div className="font-semibold text-lg text-gray-800 border-b pb-2">Skills:</div>
          <div className="flex flex-wrap mt-2">
            {skillDetail.skillSet.map((skill, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
                {skill}
              </span>
            ))}
          </div>
          <div className="font-semibold text-lg text-gray-800 mt-4 border-b pb-2">Specialized:</div>
          <div className="flex flex-wrap mt-2">
            {skillDetail.specialized.map((spec, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-1" />
                {spec}
              </span>
            ))}
          </div>
        </div>
      ))}

<div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="font-semibold text-lg text-gray-800 border-b pb-2 flex items-center">
        <FontAwesomeIcon icon={faBook} className="mr-2 text-gray-600" />
        Certifications and Departments:
      </div>
      <div className="flex flex-col mt-2">
        {/* Display certifications in a single line */}
        <span className="text-gray-800">
          Certifications: {groupedCertificationsArray.flatMap(group => group.courseNames).join(', ')}
        </span>
        {/* Display departments in a single line */}
        <span className="text-gray-700 mt-2">
          Departments: {groupedCertificationsArray.map(group => group.department).join(', ')}
        </span>
      </div>
    </div>

      
      <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <b>In today's rapidly evolving work environment, the ability to continuously update and enhance skillsets is crucial for both employees 
      and organizations. One of the primary mechanisms for managing skillsets within an organization is through a structured request process. 
      This document outlines the workflow for skillset updates, detailing the steps involved, the roles of administrators, and the criteria for verifying 
      these requests. </b>     
      </div>
      <div className=" bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
      <div className=" h-full">
      <div className='h-1/2'>
  {/* Displaying request */}
  <div>
    <h2 className='text-center text-xl font-semibold bg-gray-200 rounded-lg p-2 '>Skill Request Without Certification</h2>
    {skillsets.length > 0 ? (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-primary-100 text-white border-b">
              <th className="px-4 py-2 text-left">Skill</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {skillsets.map((skillset) => {
              let statusColorClass;
              let statusIcon;
              
              switch (skillset.status) {
                case 'accepted':
                  statusColorClass = 'bg-green-100 text-green-800';
                  statusIcon = '✅'; // Check mark icon
                  break;
                case 'pending':
                  statusColorClass = 'bg-yellow-100 text-yellow-800';
                  statusIcon = '⏳'; // Hourglass icon
                  break;
                case 'rejected':
                  statusColorClass = 'bg-red-100 text-red-800';
                  statusIcon = '❌'; // Cross mark icon
                  break;
                default:
                  statusColorClass = 'bg-gray-200 text-gray-700';
                  statusIcon = '❓'; // Question mark icon
              }

              return (
                <tr key={skillset.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2 font-medium">{skillset.skill}</td>
                  <td className="px-4 py-2 text-gray-700">{skillset.description}</td>
                  <td className={`px-4 py-2 rounded-lg flex items-center ${statusColorClass}`}>
                    <span className="mr-2">{statusIcon}</span>
                    {skillset.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="mt-4 text-center text-gray-500">No skillsets found for this employee.</p>
    )}
  </div>
</div>



     {/* displaying Request Status */}
     <div className='h-1/2'>
  <h2 className='text-center text-xl font-semibold bg-gray-200 rounded-lg p-2'>Skill Request with Certifications</h2>
  {certifications.length > 0 ? (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-primary-100 text-white border-b">
            <th className="px-4 py-2 text-left">Course Name</th>
            <th className="px-4 py-2 text-left">Skills</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Certification Date</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((certification) => {
            let statusColorClass;
            let statusIcon;

            switch (certification.status) {
              case 'accepted':
                statusColorClass = 'bg-green-100 text-green-800';
                statusIcon = '✅'; // Check mark icon
                break;
              case 'pending':
                statusColorClass = 'bg-yellow-100 text-yellow-800';
                statusIcon = '⏳'; // Hourglass icon
                break;
              case 'rejected':
                statusColorClass = 'bg-red-100 text-red-800';
                statusIcon = '❌'; // Cross mark icon
                break;
              default:
                statusColorClass = 'bg-gray-200 text-gray-700';
                statusIcon = '❓'; // Question mark icon
            }

            return (
              <tr key={certification.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-2 font-medium">{certification.courseName}</td>
                <td className="px-4 py-2 text-gray-700">{certification.skills}</td>
                <td className="px-4 py-2">{certification.courseDepartment}</td>
                <td className={`px-4 py-2 rounded-lg flex items-center ${statusColorClass}`}>
                  <span className="mr-2">{statusIcon}</span>
                  {certification.status}
                </td>
                <td className="px-4 py-2">
                  {new Date(certification.certificationDate).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="mt-4 text-center text-gray-500">No Certification Requests found for this employee.</p>
  )}
</div>


    {/* Request with certification model */}
    {RequestWithCertification && (
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
                  onClick={CertificationSkillRequest}
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
                <form class="space-y-4 mt-5" onSubmit={CertificateRequestSubmit}>

                    
                    <div>
                    <span className='mb-2 text-md'>Certification Name</span>
                    <input type="text" name="skill" id="skill" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  value={Certification} onChange={(e)=>setCertification(e.target.value)} />
                    </div>

                    <div>
                    <span className='mb-2 text-md'>Skill</span>
                    <input type="text" name="skill" id="skill" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  value={Cskill} onChange={(e)=>setCskill(e.target.value)} />
                    </div>

                    <div>
                    <span className='mb-2 text-md'>Image Link</span>
                    <input type="text" name="skill" id="skill" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  value={Image} onChange={(e)=>setImage(e.target.value)} />
                    </div>

                    <div>
                    <span className='mb-2 text-md'>courseDepartment</span>
                    <input type="text" name="skill" id="skill" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  value={courseDepartment} onChange={(e)=>setcourseDepartment(e.target.value)} />
                    </div>
              
              
                    <div>
                    <span className='mb-2 text-md'>Description</span>
                    <textarea type="text" name="description" id="description" className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={cdescription} onChange={(e)=>setcdescription(e.target.value)}    />
                    </div>
                    <button type="submit" className="w-full bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2" >Submit Request</button>
                  
                </form>
            </div>
             </div>
            
            </div>
          </div>
        </div>
      )}






   {/* Request without Certification */}
      
      {RequestWithoutCertification && (
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
                  onClick={WithoutCertificationSkillRequest}
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

                 

                <div>
                    <span className='mb-2 text-md'>Skill</span>
                    <select 
                      name="skill" 
                      id="skill" 
                      className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={skill} 
                      onChange={(e) => setskill(e.target.value)} // Ensure your setter function is named correctly
                    >
                      <option value="" disabled>Select a skill</option> {/* Optional: Placeholder option */}
                      <option value="React">React</option>
                      <option value="Node">Node</option>
                      <option value="Java">Java</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="MySQL">MySQL</option>
                      <option value="MongoDB">MongoDB</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="Azure">Express</option>
                      <option value="Node js">Node js</option>
                      <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>

                    </select>
                  </div>

      
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

{/* floating request */}
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
                <div class="flex justify-center mt-2 space-x-4">
    <button type="submit" onClick={CertificationSkillRequest} class="w-1/2 bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2">
        Skill Updation with Certification
    </button>
    <button type="submit" onClick={WithoutCertificationSkillRequest}class="w-1/2 bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2">
        Skill Updation without Certification
    </button>
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
            <h1 className="text-4xl font-bold mb-8 text-center bg-gray-200 ">Skill Score Details</h1>
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="py-4 px-6 border-b font-semibold text-gray-700">Course Name</th>
                  <th className="py-4 px-6 border-b font-semibold text-gray-700">Skill</th>
                  <th className="py-4 px-6 border-b font-semibold text-gray-700">Test Score</th>
                  <th className="py-4 px-6 border-b font-semibold text-gray-700">No of Attempts Lefts</th>
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
                      {score.status === "accepted" || score.status === "rejected" ? (
                        <span className={`font-semibold ${score.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                          {score.status}
                        </span>
                      ) : (
                        <>
                          {score.noOfAttempts === 0 && score.status === 'pending' ? (
                            <>
                              <button
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2 transition duration-200 ease-in-out"
                                onClick={() => handleAccept(score.id, score.skill, score.employeeId ,score.courseDepartment)}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                                onClick={() => handleReject(score.id, score.skill, score.employeeId ,score.courseDepartment)}
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