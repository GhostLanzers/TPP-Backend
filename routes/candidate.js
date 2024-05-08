const express = require("express");
const router = express.Router();

const {
  getAllCandidates,
  getCandidate,
  addCandidate,
  deleteCandidate,
  updateCandidate,
  getInterviewStatusValues,
  getSelectValues,
  getL1AssessmentValues,
  getL2AssessmentValues,
  getAssessmentCounts,
} = require("../controllers/candidate");

router.route("/").get(getAllCandidates).post(addCandidate);
router
  .route("/:id")
  .get(getCandidate)
  .patch(updateCandidate)
  .delete(deleteCandidate);
router.route("/values/interviewStatus").get(getInterviewStatusValues);
router.route("/values/select").get(getSelectValues);
router.route("/values/l1assessment").get(getL1AssessmentValues);
router.route("/values/l2assessment").get(getL2AssessmentValues);
router.route("/values/counts").get(getAssessmentCounts);

module.exports = router;
