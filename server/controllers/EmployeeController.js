const bcrypt = require('bcrypt');
const EmployeeModel = require('../Models/EmployeeModel');
const mailService = require('../services/RegistrationServices'); // assuming you have a mail service
const jwtgenerator = require("../JwtToken/jwtgenerator");
const Authorize = require("../middleware/authorization");
const randomize = require('randomatic');


const registerEmployee = async (req, res) => {
  try {
    const {
      employeeEmail,
      employeeName,
      role,
      gender,
      password,
      repassword

    } = req.body;

    if (repassword !== password) {
      return res.status(401).send("Password Mismatch");
    }

    const existingEmployee = await EmployeeModel.findEmployeeByemployeeEmail(employeeEmail);

    if (existingEmployee) {
      return res.status(401).send("Employee already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newEmployee = {
     employeeEmail,
      employeeName,
      role,
      gender,
      password
    };

    await EmployeeModel.createEmployee(newEmployee);

    await mailService.sendMail(
        newEmployee,
      "Task Management System",
      `${newEmployee.first_name}, Thank you for registering with us`
  );

    res.json({ status: true });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { employeeEmail, password } = req.body;

    console.log('Login attempt:', { employeeEmail });

    const Employee = await EmployeeModel.findEmployeeByemployeeEmail(employeeEmail);

    if (!Employee) {
      console.log('Employee not found');
      return res.status(401).send("Invalid employeeEmail or Password");
    }
    const isMatch = await bcrypt.compare(password, Employee.password);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).send("Invalid employeeEmail or Password");
    }

    const token = jwtgenerator(Employee.id);
    const Employee_id = Employee.id;
    const role = Employee.role;
    const name = Employee.first_name;

    const body = {
      token,
      role,
      Employee_id,
      name
    };
    res.json(body);

  } catch (err) {
    console.error('Error in loginEmployee function:', err.message);
  }
};


const otpVerify = async (req, res) => {
  try {
    const { employeeEmail } = req.body;
    const check = await EmployeeModel.FindEmployeeForOtp(employeeEmail);
    if (check) {
      const otp = randomize('0', 4);
      
      await mailService.sendMail(
        employeeEmail,
        'Here is the OTP to verify your account',
        `${otp}`
      );
      res.json({ otp });
    } else {
      res.status(401).json('Employee does not exist');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const changePassword = async (req, res) => {
  try {
    const { employeeEmail, Password, repassword } = req.body;
    if (Password !== repassword) {
      return res.status(401).send('Password Mismatch');
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(Password, salt);

    const status = await EmployeeModel.updateEmployeePassword(employeeEmail, bcryptPassword);
    await mailService.sendMail(employeeEmail, 'Password has been changed', 'Thank you');
    
    res.json({ verify: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  otpVerify,
  changePassword,
  registerEmployee,
  loginEmployee

};