import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
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
import GraphicalAnalasis from './GraphicalAnalasisForCertification';


function dashboard() {
  const Navigate = useNavigate();
  const[NewRequest, setNewRequest] = useState(false)
  const[RequestWithoutCertification, setRequestWithoutCertification] = useState(false)
  const[RequestWithCertification,setRequestWithCertification]=useState(false)
  const[skill,setskill] = useState("")
  const[description,setdescription] = useState("")
  const [skillsets, setSkillsets] = useState([]);
  const[role,setRole]=useState("")
  const[Certification,setCertification] = useState("")
  const[Cskill,setCskill] = useState("");
  const[Image,setImage] = useState("");
  const[cdescription,setcdescription] = useState("");
  const[courseDepartment,setcourseDepartment] = useState("")
  const [certifications, setCertifications] = useState([]);
  const [data, setData] = useState([]);
  const notify = (message) => toast(message);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate total pages
  const totalPages = Math.ceil(skillsets.length / itemsPerPage);

  // Get the current items for the page
  const currentSkillsets = skillsets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  //pagination for Certificate Request

  const [currentCertificationPage, setCurrentCertificationPage] = useState(1);
  const certificationsPerPage = 6;

  // Calculate total pages
  const certificationTotalPages = Math.ceil(certifications.length / certificationsPerPage);

  // Get the current items for the page
  const certificationsForCurrentPage = certifications.slice(
    (currentCertificationPage - 1) * certificationsPerPage,
    currentCertificationPage * certificationsPerPage
  );

  // Handle page change
  const handleCertificationPageChange = (pageNumber) => {
    setCurrentCertificationPage(pageNumber);
  };


   
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
          {data.length > 0 ? (
        data.map((skillDetail) => (
          <div key={skillDetail.id} className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
            
            {/* Skills Section */}
            <div className="font-semibold text-lg text-gray-800 border-b pb-2">Skills:</div>
            <div className="flex flex-wrap mt-2">
              {skillDetail.skillSet && skillDetail.skillSet.length > 0 ? (
                skillDetail.skillSet.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-lg flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-sm">No data available</span>
              )}
            </div>

            {/* Specialized Section */}
            <div className="font-semibold text-lg text-gray-800 mt-4 border-b pb-2">Specialized:</div>
            <div className="flex flex-wrap mt-2">
              {skillDetail.specialized && skillDetail.specialized.length > 0 ? (
                skillDetail.specialized.map((spec, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-lg flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-1" />
                    {spec}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-sm">No data available</span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">No data available</div>
      )}

<div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
  <div className="font-semibold text-lg text-gray-800 border-b pb-2 flex items-center">
    <FontAwesomeIcon icon={faBook} className="mr-2 text-gray-600" />
    Certifications and Departments:
  </div>
  <div className="flex flex-col mt-2">
    {groupedCertificationsArray && groupedCertificationsArray.length > 0 ? (
      <>
        {/* Display certifications in a single line */}
        <span className="text-gray-800">
          Certifications: {groupedCertificationsArray.flatMap(group => group.courseNames).join(', ')}
        </span>
        {/* Display departments in a single line */}
        <span className="text-gray-700 mt-2">
          Departments: {groupedCertificationsArray.map(group => group.department).join(', ')}
        </span>
      </>
    ) : (
      <span className="text-gray-600">No data available</span>
    )}
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
      <h2 className="text-center text-xl font-semibold bg-gray-200 rounded-lg p-2">
        Skill Request Without Certification
      </h2>
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
              {currentSkillsets.map((skillset) => {
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


          <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-primary-100 text-white rounded disabled:opacity-50 flex items-center"
          >
            <FaArrowLeft className="mr-1" />   
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === index + 1 ? 'bg-white text-black' : 'bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-primary-100 text-white rounded disabled:opacity-50 flex items-center"
          >
            <FaArrowRight className="ml-1" />
          </button>
        </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-500">No skillsets found for this employee.</p>
      )}
    </div> 
</div>



     {/* displaying Request Status */}
     <div className="h-1/2">
      <h2 className="text-center text-xl font-semibold bg-gray-200 rounded-lg p-2">
        Skill Request with Certifications
      </h2>
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
              {certificationsForCurrentPage.map((certification) => {
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

          {/* Pagination Controls */}
          
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handleCertificationPageChange(currentCertificationPage - 1)}
            disabled={currentCertificationPage === 1}
            className="px-4 py-2 mx-1 bg-primary-100 rounded text-white disabled:opacity-50 flex items-center"
          >
            <FaArrowLeft className="mr-1" /> {/* Left Arrow Icon */}
          </button>
          {Array.from({ length: certificationTotalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handleCertificationPageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                currentCertificationPage === index + 1
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handleCertificationPageChange(currentCertificationPage + 1)}
            disabled={currentCertificationPage === certificationTotalPages}
            className="px-4 py-2 mx-1 bg-primary-100  text-white rounded  disabled:opacity-50 flex items-center"
          >
            <FaArrowRight className="ml-1" /> {/* Right Arrow Icon */}
          </button>
        </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-500">
          No Certification Requests found for this employee.
        </p>
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
                <input
                  type="text"
                  name="certification"
                  id="certification"
                  className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={Certification}
                  onChange={(e) => setCertification(e.target.value)}
                />
              </div>

              <div>
                <span className='mb-2 text-md'>Skill</span>
                <select
                  name="skill"
                  id="skill"
                  className="block w-full mt-1.5 bg-textbg rounded-md box-border border-0 px-0 text-gray-900 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={Cskill}
                  onChange={(e) => setCskill(e.target.value)}
                >
                  <option value="" disabled>Select a skill</option> {/* Optional: Placeholder option */}
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Java">Java</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="MySQL">MySQL</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="Express">Express</option>
                  <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
                </select>
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
    <GraphicalAnalasis/>
  );
}
}


export default dashboard;