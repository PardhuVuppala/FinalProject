const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSkillsetsdataByEmployeeId = async (employeeId) => {
    return prisma.skillset.findMany({
      where: {
        employeeId: employeeId,
      },
    });
  };
  module.exports = {
    getSkillsetsdataByEmployeeId
  }