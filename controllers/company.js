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
  // const companyRoles = await saveRoles()
  // console.log('HI', companyRoles)
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
      ...req.body,
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
  console.log(companyRoles.roles);
  // const companyRoles = company.roles.map(
  //   async (roleId)=>{
  //     const role = await Role.findById(roleId).then((data) => console.log(data))
  //     return role

  //   }
  // )
  //  console.log(companyRoles)
  res.status(StatusCodes.OK).json(companyRoles);
  // const companyRoles = company.;
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
const getResponseTypes = async (req, res) => {
  const responseTypes = Company.schema.path("response").enumValues;
  res.status(StatusCodes.OK).json({ responseTypes: responseTypes });
};

const addResponseTypes = async (req, res) => {
  const { value: newResponse } = req.body;
  let responseTypes = Company.schema.path("response").enumValues;
  responseTypes.push(newResponse);
  Company.schema.path("response").enumValues = responseTypes;
  res
    .status(StatusCodes.OK)
    .json({ responseTypes: Company.schema.path("response").enumValues });
};

const getCompanyUseType = async (req, res) => {
  const { companyType: companyType } = req.query;
  console.log(req.query);
  const companies = await Company.find({ response: companyType });
  res.status(StatusCodes.OK).json(companies);
};

const getCompanyCounts = async (req, res) => {
  const values = await Company.aggregate().sortByCount("response");
  res.status(StatusCodes.OK).json(values);
};

module.exports = {
  getAllCompanies,
  addCompany,
  getRoles,
  addCompanyRoles,
  deleteCompany,
  getResponseTypes,
  addResponseTypes,
  getCompanyUseType,
  getCompanyCounts,
};
