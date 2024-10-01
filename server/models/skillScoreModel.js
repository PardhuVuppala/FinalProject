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

module.exports = {
  createSkillScore,
  findSkillScoresByEmployeeId
};
