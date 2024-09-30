const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
  return await prisma.userData.findUnique({
    where: { email },
  });
};

const createUser = async (user) => {
  return await prisma.userData.create({
    data: user,
  });
};


const FindUserForOtp = async (email) => {
  try {
    const user = await prisma.userData.findUnique({
      where: { email: email },
    });
    return user;
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }
};

const updateUserPassword = async (email, password) => {
  try {
    await prisma.userData.update({
      where: { email: email },
      data: { password: password },
    });
    return true;
  } catch (err) {
    console.error('Error updating user password:', err);
    throw err;
  }
};
module.exports = {
  findUserByEmail,
  createUser,
  FindUserForOtp,
  updateUserPassword
};