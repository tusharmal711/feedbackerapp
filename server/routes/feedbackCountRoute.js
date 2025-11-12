const express = require("express");
const countResponsesByDepartment = require("../utils/feedbackStat");

const router = express.Router();

router.get("/feedback-stats/:department", async (req, res) => {
  try {
    const department = req.params.department; 
    const stats = await countResponsesByDepartment(department);

    res.status(200).json({ department, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
