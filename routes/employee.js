const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  bulkInsert,
  getEmployeeCounts
} = require("../controllers/employee");

router.route("/").get(getAllEmployees).post(addEmployee);
router
  .route("/:id")
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);
  router.route("/bulkinsert").post(bulkInsert)
  router.route("/counts/counts").get(getEmployeeCounts)

module.exports = router;
