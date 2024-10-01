const express = require('express');
const router = express.Router();
const Authorize = require('../middleware/authorization')
const assessmentController= require('../controllers/assessmentController');



router.post('/assessment', assessmentController.addAssessment);

router.get('/assessment/:assessmentId', assessmentController.getAssessmentById);



module.exports = router;