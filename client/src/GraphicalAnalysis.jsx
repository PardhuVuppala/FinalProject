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
  const [timeSpentData, setTimeSpentData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeSkills, setEmployeeSkills] = useState([]);
  const [employeeSpecialization, setEmployeeSpecialization] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");

    // Verify the user's token
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

    // Fetch employee data
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:1200/graphs/employees", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setEmployees(response.data); // Set employees in state
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    verifyToken();
    fetchEmployees();
  }, [Navigate]);

  // Fetch course count and time spent data based on selected employee
  useEffect(() => {
    const token = Cookies.get("token");
      
    const fetchCourseData = async (employeeId) => {
      try {
        console.log(employeeId);
        const response = await axios.get(`http://localhost:1200/graphs/course-count/${employeeId || ''}`, {
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
    
    const fetchTimeSpentData = async (employeeId) => {
      try {
        const response = await axios.get(`http://localhost:1200/graphs/time-spent/${employeeId || ''}`, {
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
    

    // Call both functions when the selectedEmployee changes
    fetchCourseData(selectedEmployee);
    fetchTimeSpentData(selectedEmployee);
  }, [selectedEmployee]);

  // Fetch employee skills when the selected employee changes
  useEffect(() => {
    const token = Cookies.get("token");

    const fetchEmployeeSkills = async (employeeId) => {
      console.log(employeeId)
      try {
        const response = await axios.get(`http://localhost:1200/graphs/skills/${employeeId}`, {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        setEmployeeSkills(response.data.skillSet);
        setEmployeeSpecialization(response.data.specialized);
      } catch (error) {
        console.error('Error fetching employee skills:', error);
      }
    };

    if (selectedEmployee) {
      fetchEmployeeSkills(selectedEmployee);
    } else {
      setEmployeeSkills([]); // Clear skills if no employee is selected
      setEmployeeSpecialization([]); // Clear specialization if no employee is selected
    }
  }, [selectedEmployee]);

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
        <div className="fixed top-4 right-4 z-10 bg-white shadow-lg p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">Select Employee</label>
          <select
            className="block appearance-none w-full max-w-xs bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-200 ease-in-out"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.employeeName}
              </option>
            ))}
          </select>
        </div>
    
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow mt-20 p-4'>
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <h2 className="text-lg font-semibold mb-3">Course Enrollment Data</h2>
            <Bar data={courseChartData} options={{ responsive: true }} />
          </div>
  
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <h2 className="text-lg font-semibold mb-3">Time Spent on Courses</h2>
            <Bar data={timeSpentChartData} options={{ responsive: true }} />
          </div>
  
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <h2 className="text-lg font-semibold mb-3">Employee Skills</h2>
            {employeeSkills.length > 0 ? (
              <ul className="flex flex-wrap">
                {employeeSkills.map((skill) => (
                  <li key={skill} className="bg-green-100 text-green-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-lg flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No skills found for this employee.</p>
            )}
          </div>
    
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <h2 className="text-lg font-semibold mb-3">Employee Specialization</h2>
            {employeeSpecialization.length > 0 ? (
              <ul className="flex flex-wrap">
                {employeeSpecialization.map((special) => (
                  <li key={special} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-lg flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-1" />
                    {special}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specialization found for this employee.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
