const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAssessment = async (data) => {
  return await prisma.assessments.create({
    data: {
      courseName: data.courseName,
      courseDepartment: data.courseDepartment,
      questionsAndOptions: data.questionsAndOptions
      },
  });
};


const findAssessmentByCourseName = async ({ where: { courseName: skill } }) => {
  return await prisma.assessments.findFirst({
    where: { courseName: skill },
  });
};

module.exports = {
  createAssessment,
  findAssessmentByCourseName
};
