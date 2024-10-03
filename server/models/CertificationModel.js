const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCertification = async (certificationData) => {
  return prisma.certification.create({
    data: {
      ...certificationData,
      certificationDate: new Date(certificationData.certificationDate),  // Ensure the date is handled properly
    },
  });
};

const getCertificationsByEmployeeId = async (employeeId) => {
  return prisma.certification.findMany({
    where: { employeeId },
  });
};

const updateCertificationStatus = async (certificationId, employeeId, skill, courseDepartment, status) => {
  try {
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
        if (!Array.isArray(employeeSkillset.skillSet)) {
          employeeSkillset.skillSet = []; // Ensure it's an array
        }
        
        if (!employeeSkillset.skillSet.includes(skill)) {
          await prisma.skillset.update({
            where: { id: employeeSkillset.id }, // Use the ID of the existing skillset
            data: {
              skillSet: { push: skill }, // Add new skill to the skillSet
            },
          });
        }

        // Ensure specialized is an array before checking
        if (!Array.isArray(employeeSkillset.specialized)) {
          employeeSkillset.specialized = []; // Ensure it's an array
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

    // Update the certification status
    return await prisma.certification.update({
      where: { id: certificationId },
      data: { status },
    });
  } catch (error) {
    console.error('Error updating certification status:', error);
    throw new Error('Failed to update certification status'); // Or handle accordingly
  }
};

module.exports = {
  createCertification,
  getCertificationsByEmployeeId,
  updateCertificationStatus
};