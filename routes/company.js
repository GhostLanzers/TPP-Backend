const express = require("express");
const router = express.Router();

const {
  getAllCompanies,
  addCompany,
  getRoles,
  addCompanyRoles,
  deleteCompany,
  getResponseTypes,
  addResponseTypes,
  getCompanyUseType,
  getCompanyCounts,
} = require("../controllers/company");

router.route("/").get(getAllCompanies).post(addCompany);
router.route("/:id/roles").get(getRoles);
router.route("/:id").patch(addCompanyRoles).delete(deleteCompany);
router.route("/resTypes").get(getResponseTypes).post(addResponseTypes);
router.route("/companyType").get(getCompanyUseType);
router.route("/counts").get(getCompanyCounts);

module.exports = router;
