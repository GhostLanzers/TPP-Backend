const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  bulkInsert
} = require("../controllers/employee");

router.route("/").get(getAllEmployees).post(addEmployee);
router
  .route("/:id")
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);
  router.route("/bulkinsert").post(bulkInsert)

module.exports = router;
