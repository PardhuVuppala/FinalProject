import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './UI Components/sidebar';

export default function CertificationData() {
  const [certifications, setCertifications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch certifications visible to admin
    const fetchCertifications = async () => {
      try {
        const response = await axios.get('http://localhost:1200/certificate/certificationsDetails');
        setCertifications(response.data.certifications);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      }
    };

    fetchCertifications();
  }, []);

  // Function to handle accept/reject action
  const handleStatusChange = async (certificationId, status) => {
    try {
      await axios.put(`http://localhost:1200/certificate/certifications/${certificationId}`, { status });
      setCertifications(prev =>
        prev.map(certification =>
          certification.id === certificationId ? { ...certification, status } : certification
        )
      );
    } catch (error) {
      console.error(`Error updating certification status:`, error);
    }
  };

  // Function to open the image popup
  const openImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Function to close the popup
  const closePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="flex">
      <Sidebar className="w-1/3" />
      <div className="flex-1 p-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
          <h2 className="text-lg font-semibold mb-4">Certification Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left">Course Name</th>
                  <th className="px-4 py-2 text-left">Skills</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Certification</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((certification) => (
                  <tr key={certification.id} className="border-b">
                    <td className="px-4 py-2">{certification.courseName}</td>
                    <td className="px-4 py-2">{certification.skills}</td>
                    <td className="px-4 py-2">{certification.courseDepartment}</td>
                    <td className="px-4 py-2">
                      {certification.status === 'pending' ? (
                        certification.status
                      ) : (
                        <span className="font-semibold">{certification.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {/* Image Link with Popup */}
                      <button
                        onClick={() => openImagePopup(certification.certificationLink)}
                        className="text-blue-500 hover:underline"
                      >
                        View Certification
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      {certification.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(certification.id, 'accepted')}
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(certification.id, 'rejected')}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      ) : certification.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Image Popup Modal */}
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className=" p-4 rounded shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={closePopup}
                >
                  &times; {/* Close button */}
                </button>
                <img src={selectedImage} alt="Certification" className="max-w-full max-h-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
