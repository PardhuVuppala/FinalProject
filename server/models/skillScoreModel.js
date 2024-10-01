const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSkillScore = async (data) => {
  return await prisma.skillScore.create({
    data,
  });
};

module.exports = {
  createSkillScore,
};
