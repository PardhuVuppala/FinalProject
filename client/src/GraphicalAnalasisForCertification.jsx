import React, { useEffect, useState } from 'react';
import Sidebar from './UI Components/sidebar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { ChartBarIcon, BookOpenIcon, ArrowTrendingUpIcon ,TrophyIcon } from '@heroicons/react/24/outline'; 
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Register the necessary components for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraphicalAnalasis() {
  const [chartData, setChartData] = useState({});
  const [chartDataSkillset, setchartDataSkillset] = useState({});
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topEmployees, setTopEmployees] = useState([]);
  const [topEmployee, setTopEmployee] = useState(null);
  const Navigate = useNavigate()

  useEffect(() => {
    // Fetch course statistics from backend

    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const Employee_id = Cookies.get('Employee_id');
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
    
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1200/graphs/course-statistics'); // Replace with actual API route
        const data = response.data;
        const courseNames = data.map(item => item.courseName);
        const counts = data.map(item => item.count);

        setChartData({
          labels: courseNames,
          datasets: [
            {
              label: 'Number of People',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.7)', // Slightly higher opacity for better visuals
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching course statistics:', error);
      }
    };
    
    const fetchDataSkillSet = async () => {
      try {
        const response = await axios.get('http://localhost:1200/graphs/skill-statistics'); // API route for skill statistics
        const data = response.data;

        const courseNames = data.map(item => item.courseName);
        const counts = data.map(item => item.count);

        setchartDataSkillset({
          labels: courseNames,
          datasets: [
            {
              label: 'Number of People with Skills',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching skill statistics:', error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:1200/graphs/getSkillScoreStatistics');
        setStatistics(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchTopEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:1200/graphs/top-certifications');
        setTopEmployees(response.data);
      } catch (error) {
        console.error('Error fetching top employees:', error);
      }
    };

    const fetchTopEmployee = async () => {
      try {
        const response = await fetch('http://localhost:1200/graphs/top-employee'); // Update the endpoint as per your route
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTopEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    verifyToken()
    fetchTopEmployee();
    fetchTopEmployees();
    fetchStatistics();
    fetchDataSkillSet();
    fetchData();
  }, []);

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar className="w-1/4"/>
      <div className="flex-1 p-6 grid grid-cols-1 gap-6">
        <div className=" p-6  ">
          <div className="grid grid-cols-2 gap-6 h-3/5"> {/* Changed to grid-cols-2 for side-by-side layout */}
            {/* First box - Bar Graph for Courses */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center items-center">
              {chartData && chartData.labels ? (
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: '#4A5568' }, // Darker axis labels for better readability
                      },
                      x: {
                        ticks: { color: '#4A5568' },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          color: '#2D3748', // Darker legend text for contrast
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>

            {/* Second box - Bar Graph for SkillSet */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center items-center">
              {chartDataSkillset && chartDataSkillset.labels ? (
                <Bar
                  data={chartDataSkillset}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 grid grid-cols-3 gap-4 bg-gray-100 rounded-lg">
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-3xl font-bold mb-4 text-gray-800 text-center">Skill Score Statistics</h3>
    <div>
      <h4 className="text-2xl font-semibold mb-2 text-gray-700">Overall Statistics</h4>
      <div className="space-y-4">
        <div className="flex items-center">
          <ChartBarIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
          <span className="font-medium text-gray-600 ml-2">Total Tests Taken:</span>
          <span className="ml-2 text-gray-800">{statistics.totalTestsTaken}</span>
        </div>
        <div className="flex items-center">
          <BookOpenIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
          <span className="font-medium text-gray-600 ml-2">Most Tests Taken Course:</span>
          <span className="ml-2 text-gray-800">{statistics.mostTestsCourseName}</span>
        </div>
        <div className="flex items-center">
          <ArrowTrendingUpIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
          <span className="font-medium text-gray-600 ml-2">Average of Score:</span>
          <span className="ml-2 text-gray-800">{statistics.averagescore}</span>
        </div>
      </div>
    </div>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">Top 3 Employees by Certifications</h3>
      <ul className="space-y-4">
        {topEmployees.map(employee => (
          <li key={employee.id} className="flex items-center">
            <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" /> {/* Icon for visual enhancement */}
            <span className="text-gray-800">
              {employee.name} - <span className="font-semibold">{employee.certificationsCount}</span> Certifications
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-3xl font-bold mb-4 text-gray-800 flex items-center">
        <ChartBarIcon className="h-8 w-8 text-blue-500 mr-2" />
        Top Employee by Skillset and Average Score
      </h3>
      {topEmployee ? (
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-600">Name:</span>
            <span className="ml-2 text-gray-800">{topEmployee.name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600">Total Skills:</span>
            <span className="ml-2 text-gray-800">{topEmployee.skillsetCount}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600">Average Skill Score:</span>
            <span className="ml-2 text-gray-800">{topEmployee.averageSkillScore}</span>
          </div>
        </div>
      ) : (
        <p>No employee data found.</p>
      )}
    </div>
</div>

        </div>
      </div>
    </div>
  );
}
