const skillsetModel =require('../models/skillsetModel')
const assessmentModel = require('../models/assessmentModel');
const skillScoreModel = require('../models/skillScoreModel');

// Create new skillset without certification
const createSkillset = async (req, res) => {
  const { employeeId, skill, description, status } = req.body;

  try {
    // Fetch the assessment details based on the skill (courseName)
    const assessment = await assessmentModel.findAssessmentByCourseName({
      where: { courseName: skill },
    });
    console.log(assessment);


    // Check if the assessment exists
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found for the provided skill' });
    }

    // Create the new skillset without certification
    const newSkillset = await skillsetModel.createSkillset({ employeeId, skill, description, status });

    // Create the skill score entry based on the assessment found
    const newSkillScore = await skillScoreModel.createSkillScore({
      employeeId,
      assessmentId: assessment.id, // Link to the found assessment
      courseName: assessment.courseName,
      skill,
      courseDepartment: assessment.courseDepartment,
      testName: 'Default Test Name', // Set based on your logic
      testScore: 0, // Default score or calculated value
      status,
      noOfAttempts: 1, // Default or calculated attempts
    });

    // Return both skillset and skill score details
    res.status(201).json({ newSkillset, newSkillScore });
  } catch (error) {
    console.log(error)
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
};
