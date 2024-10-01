const express = require('express');
const { createSkillset, getSkillsetsByEmployeeId, updateSkillset, deleteSkillset } = require('../controllers/skillsetController');

const router = express.Router();

router.post('/skillsets', createSkillset);

router.get('/skillsets/:employeeId', getSkillsetsByEmployeeId);

// router.put('/skillsets/:id', updateSkillset);

// router.delete('/skillsets/:id', deleteSkillset);

module.exports = router;
