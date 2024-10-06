import React, { useEffect, useState } from 'react';
import Sidebar from './UI Components/sidebar';
import { FaVideo, FaBookOpen, FaChalkboardTeacher, FaProjectDiagram } from 'react-icons/fa';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:1200/courses/getdetails');
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    setSelectedModule(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setSelectedModule(null);
  };

  return (
    <div className="flex">
      <Sidebar className="w-1/4" />
      <div className="grid grid-cols-4 gap-4 h-min p-6">
        {courses.map((course) => (
      <div
      key={course.id}
      onClick={() => handleCourseClick(course)}
      className="rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 bg-white p-4 flex flex-col justify-between items-center cursor-pointer"
    >
      <img
        src={course.imageurl} // Assuming `imageurl` contains the course image URL
        alt={course.courseName}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
    
      {/* Optional footer (if needed) */}
      <div className="mt-4">
        <button className="bg-primary-100 text-white px-4 py-2 rounded-lgtransition duration-200">
          View Details
        </button>
      </div>
    </div>
    
        ))}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-5xl p-6 relative">
              <header className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                <h2 className="text-2xl font-semibold">{selectedCourse.courseName}</h2>
                <button
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </header>

              <div className="flex">
                {/* Module Names Section */}
                <ul className="w-1/3 border-r border-gray-300 p-4 space-y-4 flex flex-col items-center">
                  {Object.keys(selectedCourse.modules).map((moduleKey) => (
                    <li key={moduleKey} className="flex items-center w-full justify-start">
                      <button
                        className={`flex items-center bg-gray-200 rounded-lg px-4 py-2 w-full justify-start hover:bg-gray-300 transition duration-200 ${
                          selectedModule && selectedModule.key === selectedCourse.modules[moduleKey].key ? 'font-bold' : ''
                        }`}
                        onClick={() => handleModuleClick(selectedCourse.modules[moduleKey])}
                      >
                        {/* Different icons for each module */}
                        {moduleKey.includes('Video') && (
                          <FaVideo className="mr-2 text-blue-600 text-xl" />
                        )}
                        {moduleKey.includes('Project') && (
                          <FaProjectDiagram className="mr-2 text-green-600 text-xl" />
                        )}
                        {moduleKey.includes('Teaching') && (
                          <FaChalkboardTeacher className="mr-2 text-orange-600 text-xl" />
                        )}
                        {moduleKey.includes('Reading') && (
                          <FaBookOpen className="mr-2 text-purple-600 text-xl" />
                        )}
                        <span className="text-lg">{moduleKey}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Video Player Section */}
                <div className="w-2/3 p-4 flex items-center justify-center">
                  {selectedModule ? (
                    <div className="w-full">
                      <h3 className="text-lg font-semibold mb-2 text-center">
                        <FaVideo className="inline mr-2 text-blue-600" /> Video Player
                      </h3>
                      {loading && (
                        <div className="flex justify-center items-center h-64">
                          <div className="loader border-4 border-t-4 border-blue-600 rounded-full animate-spin w-12 h-12"></div>
                        </div>
                      )}
                      <iframe
                        className="w-full h-64 md:h-80 rounded-lg border"
                        src={selectedModule.video}
                        title="Video Player"
                        frameBorder="0"
                        allowFullScreen
                        onLoad={() => setLoading(false)}
                        onLoadStart={() => setLoading(true)} // Set loading state when loading starts
                      ></iframe>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">Select a module to view the video.</div>
                  )}
                </div>
              </div>

              {/* Footer with Action Buttons */}
              <footer className="mt-4 border-t border-gray-300 pt-4 flex justify-end">
                <button
                  className="bg-primary-100 text-white px-4 py-2 rounded transition duration-200"
                  onClick={closeModal}
                >
                  Close
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
