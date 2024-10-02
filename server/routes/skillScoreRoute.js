const express = require('express');
const { updateSkillScore, getAllSkillScores,updateSkillScoreStatus } = require('../controllers/skillScoreController');

const router = express.Router();

// Route to update a SkillScore
router.post('/update', updateSkillScore);
router.get('/details',getAllSkillScores);
router.put('/update/:id', updateSkillScoreStatus);



module.exports = router;


