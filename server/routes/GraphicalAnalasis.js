const express = require('express');
const { getCourseStatistics,getSkillStatistics,getSkillScoreStatistics,getTopThreeEmployees,getTopEmployeeBySkillsetAndAverage } = require("../controllers/GraphicalAnalasis")

const router = express.Router();

// Route to get the number of people who have taken each course
router.get('/course-statistics', getCourseStatistics);
router.get('/skill-statistics', getSkillStatistics);
router.get('/getSkillScoreStatistics', getSkillScoreStatistics);
router.get('/top-certifications', getTopThreeEmployees);
router.get('/top-employee', getTopEmployeeBySkillsetAndAverage);




module.exports = router;