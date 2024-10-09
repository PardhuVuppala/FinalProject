const skillsetModel =require('../models/skillsetModel')
const assessmentModel = require('../models/assessmentModel');
const skillScoreModel = require('../models/skillScoreModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSkillset = async (req, res) => {
  const { employeeId, skill, description, status } = req.body;

  try {
    const existingSkillset = await skillsetModel.existingSkillRequest({
      employeeId,
      skill,
      status: ['pending', 'accepted'], 
    });
    if (existingSkillset) {
      return res.status(400).json({ message: 'Skillset request is already pending or accepted for this skill.' });
    }


    const assessment = await assessmentModel.findAssessmentByCourseName({
      where: { courseName: skill },
    });

    console.log(assessment);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found for the provided skill' });
    }

    const courses = await prisma.courseModule.findMany({
      where: { 
        courseName: skill 
      },
    });
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'Course not found for the provided skill.' });
    }
    
    const course = courses[0];
    
    const existingCourse = await prisma.employeeCourse.findFirst({
      where: {
    
          EmployeeID: employeeId,
          courseid: course.id, 
      },
    });
    
    if (!existingCourse) {
      const newEmployeeCourse = await prisma.employeeCourse.create({
        data: {
          EmployeeID: employeeId,
          courseid: course.id,
          modules: course.modules, 
          courseName : course.courseName,
          courseDepartment : course.courseDepartment,
          imageurl : course.imageurl,
          percentage_completed: 0, 
          timespend: 0, 
        },
      });
    }
    
   

    const newSkillset = await skillsetModel.createSkillset({ employeeId, skill, description, status });

    const newSkillScore = await skillScoreModel.createSkillScore({
      employeeId,
      assessmentId: assessment.id, 
      courseName: assessment.courseName,
      skill,
      courseDepartment: assessment.courseDepartment,
      testName: skill, 
      testScore: 0, 
      status,
      noOfAttempts: 1, 
    });

    res.status(201).json({ newSkillset, newSkillScore });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating skillset', error: error.message });
  }
};









// Get skillsets for an employee
const getSkillsetsByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const skillsets = await skillsetModel.getSkillsetsByEmployeeId(employeeId);
    res.status(200).json(skillsets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skillsets', error: error.message });
  }
};



const getSkillScoresByEmployeeId = async (req, res) => {
  const { employeeId } = req.params; // Assuming employeeId is passed as a URL parameter

  try {
    const skillScores = await skillScoreModel.findSkillScoresByEmployeeId(employeeId);

    if (skillScores.length === 0) {
      return res.status(404).json({ message: 'No skill scores found for this employee.' });
    }

    res.status(200).json(skillScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching skill scores', error: error.message });
  }
};




// Update skillset
const updateSkillset = async (req, res) => {
  const { id } = req.params;
  const { skill, description, status } = req.body;

  try {
    const updatedSkillset = await skillsetModel.updateSkillset(id, { skill, description, status });
    res.status(200).json(updatedSkillset);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skillset', error: error.message });
  }
};






// Delete skillset
const deleteSkillset = async (req, res) => {
  const { id } = req.params;

  try {
    await skillsetModel.deleteSkillset(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skillset', error: error.message });
  }
};





module.exports = {
  createSkillset,
  getSkillsetsByEmployeeId,
  updateSkillset,
  deleteSkillset,
  getSkillScoresByEmployeeId
};
