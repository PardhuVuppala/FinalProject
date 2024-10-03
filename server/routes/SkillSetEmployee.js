const express = require('express');
const SkillsetEmployee = require('../controllers/SkillSetEmployeeController');

const router = express.Router();


router.get('/skillset/:employeeId', SkillsetEmployee.getSkillsetsByEmployeeId);




// router.put('/skillsets/:id', updateSkillset);

// router.delete('/skillsets/:id', deleteSkillset);

module.exports = router;
