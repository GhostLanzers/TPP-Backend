const { NotFoundError } = require("../errors/not-found");
const Company = require("../models/company");
const Role = require("../models/role");
const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, NotFoundError } = require('../errors')

const getAllCompanies = async (req, res) => {
  const companies = await Company.find({});
  return res.status(StatusCodes.OK).json(companies);
};
const addCompany = async (req, res) => {
  const cRoles = req.body.roles || [];
  const saveRoles = async () => {
    var roleIDs = [];
    for (let role = 0; role < cRoles.length; role++) {
      const i = new Role({
        ...cRoles[role],
      });

      const savedRole = await i.save();

      roleIDs.push(savedRole._id);
    }

    return roleIDs;
  };
  const { roles, ...rest } = req.body;
  const company = new Company({
    ...rest,
    roles: (await saveRoles()) || [],
  });
  const savedCompany = await company.save();
  res.status(StatusCodes.CREATED).json(savedCompany);
};

const addCompanyRoles = async (req, res) => {
  const {
    params: { id: companyId },
  } = req;
  const cRoles = req.body.roles;
  const saveRoles = async () => {
    var roleIDs = [];
    for (let role = 0; role < cRoles.length; role++) {
      const i = new Role({
        ...cRoles[role],
      });

      const savedRole = await i.save();

      roleIDs.push(savedRole._id);
    }

    return roleIDs;
  };
  req.body.roles = (await saveRoles()) || [];
  const company = await Company.findByIdAndUpdate(
    {
      _id: companyId,
    },
    {
      $push: { ...req.body },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!company) {
    throw new NotFoundError("Company not found with given id");
  }
  res.status(StatusCodes.OK).json(company);
};
const getRoles = async (req, res) => {
  const {
    params: { id: companyId },
  } = req;
  const company = await Company.findById({ _id: companyId });
  if (!company) {
    throw new NotFoundError("Company not found with given id");
  }
  const companyRoles = await Company.findOne({ _id: companyId })
    .populate("roles")
    .exec();
  res.status(StatusCodes.OK).json(companyRoles);
};
const getCompany = async (req, res) => {
  const {
    params: { id: companyId },
  } = req;
  const company = await Company.findOne({ _id: companyId })
    .populate("roles")
    .exec();
  res.status(StatusCodes.OK).json(company);
};
const deleteCompany = async (req, res) => {
  const {
    params: { id: companyId },
  } = req;
  const company = await Company.findOne({ _id: companyId });
  if (!company) {
    throw new NotFoundError("Company not found with given id");
  }
  company.roles.map(async (role) => {
    await Role.deleteOne({ _id: role });
  });

  await Company.deleteOne({ _id: company._id });
  res.status(StatusCodes.OK).json(company);
};




const getCompanyUseType = async (req, res) => {
  const { companyType: companyType } = req.query;
  const companies = await Company.find({ response: companyType }).populate('roles').exec();
  res.status(StatusCodes.OK).json(companies);
};

const getCompanyCounts = async (req, res) => {
  const values = await Company.aggregate().sortByCount("response");
  res.status(StatusCodes.OK).json(values);
};

const bulkInsert = async (req, res) => {
  const data = req.body;
  const companies = await Company.insertMany(data);
  res.status(StatusCodes.CREATED).json({ success: true });
};
const getRole = async (req, res) => {
  const {
    params: { companyId: companyId, roleId: roleId },
  } = req;
  const company = await Company.find({ _id: companyId });
  if (!company) {
    throw new NotFoundError("Company not found with given id");
  }
  const role = await Role.find({ _id: roleId });
  if (!role) {
    throw new NotFoundError("Role not found with given id");
  }
  res.status(StatusCodes.OK).json(role);
};
const updateRole = async (req, res) => {
  const {
    params: { companyId: companyId, roleId: roleId },
  } = req;
  const company = await Company.find({ _id: companyId });
  if (!company) {
    throw new NotFoundError("Company not found with given id");
  }
  const data = req.body
  const role = await Role.findByIdAndUpdate({ _id: roleId },{...data});
  if (!role) {
    throw new NotFoundError("Role not found with given id");
  }
  res.status(StatusCodes.OK).json(role);
};
module.exports = {
  getAllCompanies,
  addCompany,
  getRoles,
  addCompanyRoles,
  deleteCompany,
  getCompanyUseType,
  getCompanyCounts,
  bulkInsert,
  getCompany,
  getRole,
  updateRole
};
