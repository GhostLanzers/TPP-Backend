const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  bulkInsert,
  getEmployeeCounts,
  getEmployeesByType,
  updatePassword
} = require("../controllers/employee");

router.route("/").get(getAllEmployees).post(addEmployee);
router
  .route("/:id")
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);
  router.route("/bulkinsert").post(bulkInsert)
  router.route("/counts/counts").get(getEmployeeCounts)
  router.route("/employeeType/:type").get(getEmployeesByType)
  router.route("/:id/password").patch(updatePassword)

module.exports = router;
