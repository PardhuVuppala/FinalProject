const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to handle adding a new course
const addCourse = async (req, res) => {
    try {
        const { courseName, skill, courseDepartment, modules, imageurl } = req.body;

        // Validate request body
        if (!courseName || !skill || !courseDepartment || !modules || !imageurl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if a course with the same courseName and courseDepartment already exists
        const existingCourse = await prisma.courseModule.findFirst({
            where: {
                courseName,
                courseDepartment
            },
        });

        if (existingCourse) {
            return res.status(400).json({
                message: 'Course already exists in this department',
            });
        }

        // Create new course entry if it doesn't exist
        const newCourse = await prisma.courseModule.create({
            data: {
                imageurl, // Added the imageurl field
                courseName,
                skill,
                courseDepartment,
                modules, // modules is stored as a JSON object
            },
        });

        res.status(201).json({
            message: 'Course added successfully',
            course: newCourse,
        });
    } catch (error) {
        console.error("Error adding course:", error); // Log the error for debugging
        res.status(500).json({
            message: 'Error adding course',
            error: error.message,
        });
    }
};

// Controller to get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await prisma.courseModule.findMany();
        res.json({ courses });
    } catch (error) {
        console.error("Error fetching courses:", error); // Log the error for debugging
        res.status(500).json({
            message: 'Error fetching courses',
            error: error.message,
        });
    }
};


const getCoursesByEmployeeId = async (req, res) => {
    const { employeeId } = req.params; // Assuming you're passing employeeId in the URL
  
    try {
      // Fetch courses associated with the given employeeId
      const courses = await prisma.employeeCourse.findMany({
        where: {
          EmployeeID: employeeId,
        },
        include: {
          CourseModule: true, // Include related CourseModule details
        },
      });
  
      // Check if courses were found
      if (courses.length === 0) {
        return res.status(404).json({ message: 'No courses found for this employee.' });
      }
  
      // Return the list of courses
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching employee courses:', error);
      res.status(500).json({ message: 'Error fetching employee courses', error: error.message });
    }
  };
  


  const updateCourseModuleCompletion = async (req, res) => {
    const { employeeId, courseId, modules, percentage_completed, timespend } = req.body;
    console.log(employeeId, courseId, modules, percentage_completed);
    
    try {
      // Update the EmployeeCourse with new modules and updated percentage
      const updatedCourse = await prisma.employeeCourse.update({
        where: {
         // Assuming you have a composite key for unique identification
            EmployeeID: employeeId,
            id: courseId
    
        },
        data: {
          modules: modules,  
          percentage_completed: percentage_completed, 
          timespend: timespend
        },
      });
  
      res.status(200).json({ message: 'Module completion updated successfully', updatedCourse });
    } catch (error) {
      console.error('Error updating module completion:', error);
      res.status(500).json({ error: 'An error occurred while updating module completion' });
    }
  };
  




module.exports = { addCourse,getAllCourses, getCoursesByEmployeeId,updateCourseModuleCompletion };
