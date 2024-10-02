const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSkillScore = async (data) => {
  return await prisma.skillScore.create({
    data,
  });
};

// Function to get skill scores by employeeId
const findSkillScoresByEmployeeId = async (employeeId) => {
  return await prisma.skillScore.findMany({
    where: { employeeId },
    include: {
      Assessments: true, // Include assessment details if needed
    },
  });
};

const getAllSkillScoresFromDB = async() => {
  try {
    const skillScores = await prisma.skillScore.findMany({
      include: {
        Employee: true,      // Fetch related Employee details
        Assessments: true,   // Fetch related Assessments details
      },
    });
    return skillScores;
  } catch (error) {
    throw new Error('Failed to fetch SkillScores from database');
  }
};

module.exports = {
  createSkillScore,
  findSkillScoresByEmployeeId,
  getAllSkillScoresFromDB
};
