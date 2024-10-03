
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// controllers/certificationController.js
const { createCertification, getCertificationsByEmployeeId, updateCertificationStatus  } = require('../models/CertificationModel');

// Add certification for an employee
const addCertification = async (req, res) => {
  const { courseName, certificationLink, skills, courseDepartment, status, certificationDate } = req.body;
  const employeeId = req.body.employeeId || req.cookies.Employee_id;  // Get Employee ID from request or cookies

  try {
    // Check for existing certification with the same courseName and 'pending' or 'accepted' status
    const existingCertification = await getCertificationsByEmployeeId(employeeId);

    const isCertificationExists = existingCertification.some(cert => 
      cert.courseName === courseName && 
      (cert.status === 'pending' || cert.status === 'accepted')
    );

    if (isCertificationExists) {
      return res.status(400).json({ message: 'Certification request is already pending or accepted for this course.' });
    }

    // Prepare certification data
    const certificationData = {
      employeeId,
      courseName,
      certificationLink,
      skills,
      courseDepartment,
      status,
      certificationDate,
    };

    // Create new certification
    const certification = await createCertification(certificationData);
    res.status(201).json({ certification });
  } catch (error) {
    res.status(400).json({ error: 'Error adding certification', details: error.message });
  }
};


// Get certifications by Employee ID
const getCertificationsByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const certifications = await getCertificationsByEmployeeId(employeeId);
    res.status(200).json({ certifications });
  } catch (error) {
    res.status(400).json({ error: 'Error retrieving certifications', details: error.message });
  }
};

const updateCertification = async (req, res) => {
    const { certificationId } = req.params;
    const {employeeId, skill, courseDepartment, status } = req.body;
    console.log(courseDepartment)
    try {
      const updatedCertification = await updateCertificationStatus(certificationId, employeeId, skill, courseDepartment, status);
      res.status(200).json({ certification: updatedCertification });
    } catch (error) {
      res.status(400).json({ error: 'Error updating certification status', details: error.message });
    }
  };

  const getAllCertifications = async (req, res) => {
    try {
      const certifications = await prisma.certification.findMany();
      res.status(200).json({ certifications });
    } catch (error) {
      res.status(400).json({ error: 'Error fetching certifications', details: error.message });
    }
  };



module.exports = { addCertification, getCertificationsByEmployee,updateCertification ,getAllCertifications};
