const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const skillScoreModel = require("../models/skillScoreModel")

// Controller function to update a SkillScore
const updateSkillScore = async (req, res) => {
  const { id, assessmentId, testScore } = req.body;

  // Validate the input
  if (!id || !assessmentId || testScore === undefined) {
    return res.status(400).json({ error: 'ID, Assessment ID, and Test Score are required.' });
  }

  try {
    const updatedSkillScore = await prisma.skillScore.update({
      where: { id },
      data: {
        assessmentId,
        testScore,
        noOfAttempts:0
      },
    });

    return res.status(200).json(updatedSkillScore);
  } catch (error) {
    console.error('Error updating SkillScore:', error);
    return res.status(500).json({ error: 'Failed to update score.' });
  }
};




// const getAllSkillScores = async (req, res) => {
//   try {
//     const skillScores = await skillScoreModel.getAllSkillScoresFromDB();  // Fetch data from the model
//     res.status(200).json(skillScores);                    // Send successful response
//   } catch (error) {
//     res.status(500).json({ error: error.message });       // Handle errors
//   }
// };



const getAllSkillScores = async (req, res) => {
  try {
    const skillScores = await skillScoreModel.getAllSkillScoresFromDB();

    const modifiedSkillScores = skillScores.map(score => {
      if (score.noOfAttempts === 0) {
        return {
          ...score,
          action: 'Accept/Reject', // Display Accept/Reject buttons
        };
      } else {
        return {
          ...score,
          action: 'Test', // Display Test option
        };
      }
    });

    res.status(200).json(modifiedSkillScores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SkillScore details' });
  }
};


const updateSkillScoreStatus = async (req, res) => {
  const { id } = req.params;
  const { status, skill, employeeId, courseDepartment } = req.body;
  console.log(skill);

  try {
    // Update the skill score status
    const updatedSkillScore = await prisma.skillScore.update({
      where: { id },
      data: { status },
    });

    const updateRequest = await prisma.updateSkillsetWithoutCertification.updateMany({
      where: { 
        employeeId: employeeId,
        skill: skill 
      },
      data: { status: status }, // Update the status field
    });
    console.log(updateRequest)

    // Check if the status is "accepted"
    if (status === "accepted") {
      // Fetch the Skillset for the employee
      const employeeSkillset = await prisma.skillset.findFirst({
        where: { employeeId: employeeId },
      });

      // If the Skillset does not exist, create a new one
      if (!employeeSkillset) {
        await prisma.skillset.create({
          data: {
            employeeId: employeeId,
            skillSet: [skill], // Add skill to the skill set
            specialized: courseDepartment ? [courseDepartment] : [], // Add courseDepartment if provided
          },
        });
      } else {
        // If the Skillset exists, check and update skillSet
        if (!employeeSkillset.skillSet.includes(skill)) {
          await prisma.skillset.update({
            where: { id: employeeSkillset.id }, // Use the ID of the existing skillset
            data: {
              skillSet: { push: skill }, // Add new skill to the skillSet
            },
          });
        }

        // Check if the courseDepartment already exists in specialized skills
        if (courseDepartment && !employeeSkillset.specialized.includes(courseDepartment)) {
          await prisma.skillset.update({
            where: { id: employeeSkillset.id }, // Use the ID of the existing skillset
            data: {
              specialized: { push: courseDepartment }, // Add courseDepartment to specialized
            },
          });
        }
      }
    }

    res.status(200).json(updatedSkillScore);
  } catch (error) {
    console.error('Error updating SkillScore status:', error);
    res.status(500).json({ message: 'Error updating skill score status' });
  }
};


module.exports = {
  updateSkillScore,
  getAllSkillScores,
  updateSkillScoreStatus
};