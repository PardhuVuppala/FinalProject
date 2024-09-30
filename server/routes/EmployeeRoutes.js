const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');
const Authorize = require('../middleware/authorization')

router.post('/register', EmployeeController.registerEmployee);
router.post('/login', EmployeeController.loginEmployee);
router.post('/otp-verify', EmployeeController.otpVerify)
router.post('/changepasword', EmployeeController.changePassword)



router.get("/is-verify", Authorize, async (req, res) => {
    try {
      console.log("true")
      res.json(true);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
  

module.exports = router;