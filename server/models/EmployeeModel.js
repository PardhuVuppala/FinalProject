const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findEmployeeByemployeeEmail = async (employeeEmail) => {
  return await prisma.employee.findUnique({
    where: { employeeEmail },
  });
};

const createEmployee = async (Employee) => {
  return await prisma.employee.create({
    data: Employee,
  });
};


const FindEmployeeForOtp = async (employeeEmail) => {
  try {
    const Employee = await prisma.employee.findUnique({
      where: { employeeEmail: employeeEmail },
    });
    return Employee;
  } catch (err) {
    console.error('Error finding Employee by employeeEmail:', err);
    throw err;
  }
};

const updateEmployeePassword = async (employeeEmail, password) => {
  try {
    await prisma.employee.update({
      where: { employeeEmail: employeeEmail },
      data: { password: password },
    });
    return true;
  } catch (err) {
    console.error('Error updating Employee password:', err);
    throw err;
  }
};
module.exports = {
  findEmployeeByemployeeEmail,
  createEmployee,
  FindEmployeeForOtp,
  updateEmployeePassword
};