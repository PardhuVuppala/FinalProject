const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


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
      },
    });

    return res.status(200).json(updatedSkillScore);
  } catch (error) {
    console.error('Error updating SkillScore:', error);
    return res.status(500).json({ error: 'Failed to update score.' });
  }
};

module.exports = {
  updateSkillScore,
};