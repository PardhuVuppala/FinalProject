import React, { useEffect, useState } from 'react';
import Sidebar from './UI Components/sidebar';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraphicalAnalysis() {
  const Navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [timeSpentData, setTimeSpentData] = useState([]); // State for time spent data
  const [employees, setEmployees] = useState([]); // State for employees
  const [selectedEmployee, setSelectedEmployee] = useState(''); // State for selected employee
  const [employeeSkills, setEmployeeSkills] = useState([]); // State for selected employee's skills
  const [employeeSpecialization, setEmployeeSpecialization] = useState([]); // State for selected employee's specialization

  useEffect(() => {
    const token = Cookies.get("token");

    const verifyToken = async () => {
      try {
        await axios.get("http://localhost:1200/Employee/is-verify", {
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

    const fetchCourseData = async () => {
      try {
        const response = await axios.get("http://localhost:1200/graphs/course-count", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    const fetchSkillData = async () => {
      try {
        const response = await axios.get("http://localhost:1200/graphs", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setSkillData(response.data);
      } catch (error) {
        console.error('Error fetching skill data:', error);
      }
    };

    const fetchTimeSpentData = async () => {
      try {
        const response = await axios.get("http://localhost:1200/graphs/time-spent", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setTimeSpentData(response.data);
      } catch (error) {
        console.error('Error fetching time spent data:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:1200/graphs/employees", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setEmployees(response.data); // Set employees data
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    verifyToken();
    fetchCourseData();
    fetchTimeSpentData();
    fetchEmployees(); // Fetch employee data
  }, [Navigate]);

  const fetchEmployeeSkills = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:1200/graphs/skills/${employeeId}`, {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      });
      setEmployeeSkills(response.data.skillSet); // Assuming the response has a skillSet field
      setEmployeeSpecialization(response.data.specialized); // Assuming the response has a specialized field
    } catch (error) {
      console.error('Error fetching employee skills:', error);
    }
  };

  const courseChartData = {
    labels: courseData.map(item => item.courseName),
    datasets: [
      {
        label: 'Number of People Enrolled',
        data: courseData.map(item => item._count.courseName),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const timeSpentChartData = {
    labels: timeSpentData.map(item => item.courseName),
    datasets: [
      {
        label: 'Total Time Spent (in seconds)',
        data: timeSpentData.map(item => item._sum.timespend),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='flex h-screen bg-gray-100'>
    <Sidebar className="w-1/4" />
    <div className='ml-6 w-3/4 flex flex-col h-full'>
      {/* Dropdown for selecting an employee as a floating button */}
      <div className="fixed top-4 right-4 z-10 bg-white shadow-lg p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700">Select Employee</label>
        <select
          className="block appearance-none w-full max-w-xs bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-200 ease-in-out"
          value={selectedEmployee}
          onChange={(e) => {
            setSelectedEmployee(e.target.value);
            fetchEmployeeSkills(e.target.value); // Fetch skills when an employee is selected
          }}
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.employeeName}
            </option>
          ))}
        </select>
      </div>
  
      <div className='grid grid-cols-2 gap-6 flex-grow mt-20'> {/* Added mt-20 to prevent overlap with dropdown */}
        <div className="w-full h-1/2">
          <h2 className="text-xl font-semibold mb-4">Course Enrollment Data</h2>
          <Bar data={courseChartData} options={{ responsive: true }} />
        </div>
  
        <div className="w-full h-1/2">
          <h2 className="text-xl font-semibold mb-4">Time Spent on Courses</h2>
          <Bar data={timeSpentChartData} options={{ responsive: true }} />
        </div>
  
        <div className="w-full h-1/2 mt-6">
          <h2 className="text-xl font-semibold mb-4">Employee Skills</h2>
          {employeeSkills.length > 0 ? (
           <ul className="list-disc pl-6">
           {employeeSkills.map((skill, index) => (
             <li key={index} className="flex items-center mb-1">
               <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
               <span>{skill}</span>
             </li>
           ))}
         </ul>
         

            
          ) : (
            <p>No skills available for this employee.</p>
          )}
        </div>
  
        <div className="w-full h-1/2 mt-6">
          <h2 className="text-xl font-semibold mb-4">Employee Specialization</h2>
        
          {employeeSpecialization.length > 0 ? (
            <div className="list-disc pl-6">
            {employeeSpecialization.map((spec, index) => (
              <li key={index} className="flex items-center mb-1">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
                <span>{spec}</span>
              </li>
            ))}
          </div>
          ) : (
            <p>No specialization available for this employee.</p>
          )}
        </div>
      </div>
    </div>
  </div>
  
  );
}
