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


const updateCertificationStatus = async (certificationId, status) => {
    return await prisma.certification.update({
      where: { id: certificationId },
      data: { status },
    });
  };
module.exports = {
  createCertification,
  getCertificationsByEmployeeId,
  updateCertificationStatus
};