import React, { useEffect, useState } from 'react';
import Sidebar from './UI Components/sidebar';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import icons for pagination

export default function SkillTest() {
  const [examDetails, setExamDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(20); // Items per page
  const Navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    const Employee_id = Cookies.get('Employee_id');

    // Token verification
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

    const GetExamDetails = async (Employee_id) => {
      try {
        const response = await axios.get(`http://localhost:1200/newskill/skill-scores/employee/${Employee_id}`);
        setExamDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching exam details:', error);
      }
    };

    verifyToken();
    GetExamDetails(Employee_id);
  }, [Navigate]);

  // Logic to navigate to the test page or handle test-taking action
  const handleTakeTest = (examId, id) => {
    Cookies.set("SkillScoreid", id);
    Navigate(`/TestWindow/${examId}`);
  };

  // Calculate the index of the first and last exam on the current page
  const indexOfLastExam = currentPage * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = examDetails.slice(indexOfFirstExam, indexOfLastExam); // Current exams based on page

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Total pages calculation
  const totalPages = Math.ceil(examDetails.length / itemsPerPage);

  return (
    <div className='flex'>
      <Sidebar className="w-1/3" />
      <div className="flex-1 p-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
          <div className="h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-primary-100 text-white">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Test Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Attempts</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Take Test</th>
                  </tr>
                </thead>
                <tbody>
                  {currentExams.length > 0 ? (
                    currentExams.map((exam) => (
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

            {/* Pagination Controls */}
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
        </div>
      </div>
    </div>
  );
}
