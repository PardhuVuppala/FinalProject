import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './UI Components/sidebar'; // Adjust the path based on your folder structure
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EmployeeScoreAnalysis() {
  const [employees, setEmployees] = useState([]);
  const [averageScores, setAverageScores] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(7);
  const token = "your_auth_token"; // Replace with actual token logic

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:1200/graphs/employees", {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      setEmployees(response.data); // Set employees in state
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Fetch average scores based on selected employee
  const fetchAverageScores = async (employeeId) => {
    try {
      console.log(employeeId);
      const url = `http://localhost:1200/graphs/average/${employeeId || ''}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      setAverageScores(response.data); // Set average scores in state
    } catch (error) {
      console.error('Error fetching average scores:', error);
    }
  };

  // Fetch employees and average scores when component mounts
  useEffect(() => {
    fetchEmployees();
    fetchAverageScores(); // Fetch average scores for all employees initially
  }, []);

  // Handle employee selection change
  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value; // Get selected employee ID
    setSelectedEmployee(employeeId); // Set selected employee ID
    fetchAverageScores(employeeId); // Fetch average scores for the selected employee
    setCurrentPage(1); // Reset to first page when employee changes
  };

  // Prepare data for the chart
  const chartData = {
    labels: averageScores.map(score => score.testName), // Extract test names for labels
    datasets: [
      {
        label: 'Score',
        data: averageScores.map(score => score._avg.testScore), // Extract average scores for data
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Set bar color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentScores = averageScores.slice(indexOfFirstRow, indexOfLastRow);
  const certificationTotalPages = Math.ceil(averageScores.length / rowsPerPage);

  // Handle pagination
  const handleCertificationPageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= certificationTotalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar className="w-1/4" />
      <div className="flex-grow p-6">
        {/* Dropdown for selecting an employee */}
        <div className="flex justify-end mb-6">
  
            <select
                id="employee-select"
                value={selectedEmployee || ''} // Controlled component
                onChange={handleEmployeeChange}
                className="block w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">-- Select an Employee --</option>
                {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                    {employee.employeeName} {/* Assuming employee object has 'id' and 'name' */}
                </option>
                ))}
            </select>
            </div>


        {/* Render chart for average scores */}
        <div className="h-96">
          <h3 className="text-lg font-semibold mb-4">Test Scores</h3>
          {averageScores.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p>No scores available.</p>
          )}
        </div>

        {/* Table for average scores */}
        <div className="mt-9">
          <h3 className="text-lg font-semibold mb-4">Scores Table</h3>
          {currentScores.length > 0 ? (
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-primary-100">
              <tr className="text-left text-white uppercase text-sm font-semibold">
                <th className="border px-4 py-2">Test Name</th>
                <th className="border px-4 py-2">Score</th>
                <th className="border px-4 py-2">No of Attempts Left</th>
              </tr>
            </thead>
            <tbody>
              {currentScores.length > 0 ? (
                currentScores.map((score, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{score.testName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{score._avg.testScore || 0}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{score.noOfAttempts || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center text-gray-500">No scores available for the selected employee.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          ) : (
            <p>No scores available for the selected employee.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handleCertificationPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-primary-100 rounded text-white disabled:opacity-50 flex items-center"
          >
            <FaArrowLeft className="mr-1" /> {/* Left Arrow Icon */}
          </button>
          {Array.from({ length: certificationTotalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handleCertificationPageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === index + 1
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handleCertificationPageChange(currentPage + 1)}
            disabled={currentPage === certificationTotalPages}
            className="px-4 py-2 mx-1 bg-primary-100 text-white rounded disabled:opacity-50 flex items-center"
          >
            <FaArrowRight className="ml-1" /> {/* Right Arrow Icon */}
          </button>
        </div>
      </div>
    </div>
  );
}
