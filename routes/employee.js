const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee");

router.route("/").get(getAllEmployees).post(addEmployee);
router
  .route("/:id")
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
