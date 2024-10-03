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

const findCourseByName = async (courseName) => {
  return await prisma.assessments.findFirst({
    where: { courseName},
  });
};


const findAssessmentByCourseName = async ({ where: { courseName: skill } }) => {
  return await prisma.assessments.findFirst({
    where: { courseName: skill },
  });
};


const findAssessmentById = async (assessmentId) => {
  return await prisma.assessments.findUnique({
    where: {
      id: assessmentId,
    },
  });
};

module.exports = {
  createAssessment,
  findCourseByName,
  findAssessmentByCourseName,
  findAssessmentById
};
