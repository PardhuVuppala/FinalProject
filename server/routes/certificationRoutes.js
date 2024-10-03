const express = require('express');
const { addCertification, getCertificationsByEmployee,updateCertification,getAllCertifications } = require('../controllers/certificationController');
const router = express.Router();

// Route to submit a new certification
router.post('/certifications', addCertification);

router.get('/certificationsDetails',getAllCertifications)

// Route to get certifications by employee ID
router.get('/certifications/:employeeId', getCertificationsByEmployee);
router.put('/certifications/:certificationId', updateCertification);


module.exports = router;
