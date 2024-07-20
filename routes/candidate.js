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
  bulkInsert,searchCandidate,getPotentialLeads,assignRecruiter,assignSearch
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
router.route("/bulkinsert").post(bulkInsert)
router.route("/search").post(searchCandidate)
router.route("/candidate/potentialleads").post(getPotentialLeads)
router.route("/candidate/assign").post(assignRecruiter).get(assignSearch)
router.route("/candidate/assignSearch").post(assignSearch);

module.exports = router;
