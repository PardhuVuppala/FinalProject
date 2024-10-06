const express = require('express');
const { addCourse, getAllCourses, getCoursesByEmployeeId,updateCourseModuleCompletion } = require('../controllers/CoursesController');

const router = express.Router();


router.get('/getdetails', getAllCourses);

router.get('/employee/:employeeId/', getCoursesByEmployeeId);

router.post('/add-course', addCourse);

router.put('/update', updateCourseModuleCompletion);


module.exports = router;
