import React, { useEffect, useState } from 'react';
import Sidebar from './UI Components/sidebar';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the necessary components for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraphicalAnalasis() {
  const [chartData, setChartData] = useState({});
  const [chartDataSkillset, setchartDataSkillset] = useState({});
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch course statistics from backend
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

          <div className="flex-1 p-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-200 p-4 rounded shadow">
              <h1 className="text-2xl font-bold mb-4">Skill Score Statistics</h1>
      <div className="">
        <h2 className="text-xl font-semibold mb-2">Overall Statistics</h2>
        <div className="space-y-4">
          <div className="flex">
            <span className="font-medium">Total Tests Taken:</span>
            <span>{statistics.totalTestsTaken}</span>
          </div>
          <div className="flex ">
            <span className="font-medium">Most Tests Course:</span>
            <span>{statistics.mostTestsCourseName}</span>
          </div>
          <div className="flex ">
            <span className="font-medium">Average of No Attempts:</span>
            <span>{statistics.averagescore}</span> {/* Format to 2 decimal places */}
          </div>
        </div>
      </div>
            </div>
            <div className="bg-gray-200 p-4 rounded shadow">05</div>
            <div className="bg-gray-200 p-4 rounded shadow">05</div>
          </div>
        </div>
      </div>
    </div>
  );
}
