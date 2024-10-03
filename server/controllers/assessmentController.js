const assessmentModel = require('../models/assessmentModel');


const addAssessment = async (req, res) => {
  try {
    const { courseName, courseDepartment, questionsAndOptions } = req.body;

    // Check if course already exists
    const existingCourse = await assessmentModel.findCourseByName(courseName);

    if (existingCourse) {
      return res.status(400).json('Course already present');
    }

    // Limit questions to a maximum of 20
    if (questionsAndOptions.length > 20) {
      return res.status(400).json('Cannot add more than 20 questions');
    }

    // Create new assessment
    const newAssessment = await assessmentModel.createAssessment({
      courseName,
      courseDepartment,
      questionsAndOptions,
    });

    res.status(201).json(true);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await assessmentModel.findAssessmentById(assessmentId);

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  addAssessment,
  getAssessmentById
};
