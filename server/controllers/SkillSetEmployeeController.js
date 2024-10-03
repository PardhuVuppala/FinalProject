const skillsetModel =require('../models/SkillSetEmployeeModel')


const getSkillsetsByEmployeeId = async (req, res) => {
    const { employeeId } = req.params;
  
    try {
      const skillsets = await skillsetModel.getSkillsetsdataByEmployeeId(employeeId);
      res.status(200).json(skillsets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching skillsets', error: error.message });
    }
  };


  module.exports = {
    getSkillsetsByEmployeeId
  }