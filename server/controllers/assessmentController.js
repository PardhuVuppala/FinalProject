const { createAssessment } = require('../models/assessmentModel');

const addAssessment = async (req, res) => {
  try {
    const { courseName, courseDepartment, questionsAndOptions, correctOption } = req.body;

    const newAssessment = await createAssessment({
      courseName,
      courseDepartment,
      questionsAndOptions
      });

    res.status(201).json(true);
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addAssessment,
};
