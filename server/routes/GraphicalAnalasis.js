const express = require('express');
const { getCourseStatistics,getSkillStatistics,getSkillScoreStatistics,getTopThreeEmployees,getTopEmployeeBySkillsetAndAverage, getCourseCount, getTimeSpentPerCourse,getEmployeeCourses,getAllEmployees ,fetchEmployeeSkills} = require("../controllers/GraphicalAnalasis")

const router = express.Router();

// Route to get the number of people who have taken each course
router.get('/course-statistics', getCourseStatistics);
router.get('/skill-statistics', getSkillStatistics);
router.get('/getSkillScoreStatistics', getSkillScoreStatistics);
router.get('/top-certifications', getTopThreeEmployees);
router.get('/top-employee', getTopEmployeeBySkillsetAndAverage);
// Route to get the count of employees per course
router.get('/course-count', getCourseCount);

// Route to get total time spent per course
router.get('/time-spent', getTimeSpentPerCourse);

// Route to get all employees and their courses
router.get('/employee-courses', getEmployeeCourses);

router.get('/employees', getAllEmployees);

router.get('/skills/:employeeId', fetchEmployeeSkills);



module.exports = router;