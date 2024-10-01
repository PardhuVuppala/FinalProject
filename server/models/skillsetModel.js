const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSkillset = async (data) => {
  return prisma.updateSkillsetWithoutCertification.create({
    data: {
      employeeId: data.employeeId,
      skill: data.skill,
      description: data.description,
      status: data.status,
    },
  });
};

const getSkillsetsByEmployeeId = async (employeeId) => {
  return prisma.updateSkillsetWithoutCertification.findMany({
    where: {
      employeeId: employeeId,
    },
  });
};

const updateSkillset = async (id, data) => {
  return prisma.updateSkillsetWithoutCertification.update({
    where: { id },
    data: {
      skill: data.skill,
      description: data.description,
      status: data.status,
    },
  });
};

const deleteSkillset = async (id) => {
  return prisma.updateSkillsetWithoutCertification.delete({
    where: { id },
  });
};

module.exports = {
  createSkillset,
  getSkillsetsByEmployeeId,
  updateSkillset,
  deleteSkillset,
};
