const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findUserByemployeeEmail = async (employeeEmail) => {
  return await prisma.Employee.findUnique({
    where: { employeeEmail },
  });
};

const createUser = async (user) => {
  return await prisma.Employee.create({
    data: user,
  });
};


const FindUserForOtp = async (employeeEmail) => {
  try {
    const user = await prisma.Employee.findUnique({
      where: { employeeEmail: employeeEmail },
    });
    return user;
  } catch (err) {
    console.error('Error finding user by employeeEmail:', err);
    throw err;
  }
};

const updateUserPassword = async (employeeEmail, password) => {
  try {
    await prisma.Employee.update({
      where: { employeeEmail: employeeEmail },
      data: { password: password },
    });
    return true;
  } catch (err) {
    console.error('Error updating user password:', err);
    throw err;
  }
};
module.exports = {
  findUserByemployeeEmail,
  createUser,
  FindUserForOtp,
  updateUserPassword
};