const express = require('express');
const { updateSkillScore } = require('../controllers/skillScoreController');

const router = express.Router();

// Route to update a SkillScore
router.post('/update', updateSkillScore);

module.exports = router;
