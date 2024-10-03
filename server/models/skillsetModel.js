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

const existingSkillRequest = async (data) => {
  const { employeeId, skill, status } = data;
  
  try {
    // Query the database to find if a skillset request exists
    const existingSkillset = await prisma.updateSkillsetWithoutCertification.findFirst({
      where: {
        employeeId: employeeId,
        skill: skill, // Ensure this matches your schema
        status: {
          in: status, // Check for 'pending' or 'accepted' status
        },
      },
    });

    console.log('Found existing skillset:', existingSkillset);
    return existingSkillset; // Will be null if no match is found
  } catch (error) {
    console.error('Error fetching existing skillset:', error);
    throw new Error('Database error');
  }
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
  existingSkillRequest
};
