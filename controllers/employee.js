const { StatusCodes } = require("http-status-codes");
const Employee = require("../models/employee");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const addEmployee = async (req, res) => {
  const { DOJ: DOJ, DOB: DOB, ...rest } = req.body;
  const employee = await Employee.create({
    ...rest,
    DOJ: Date(DOJ),
    DOB: Date(DOB),
  });
  res.status(StatusCodes.CREATED).json({ success: true, employee: employee });
};

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find({});
  res.status(StatusCodes.OK).json({ employees });
};

const getEmployee = async (req, res) => {
  const { id: employeeId } = req.params;
  const employee = await Employee.findById({ _id: employeeId });
  if (!employee) {
    throw new NotFoundError("Employee with given ID not found");
  }
  res.status(StatusCodes.OK).json({ employee });
};

const deleteEmployee = async (req, res) => {
  const { id: employeeId } = req.params;
  const employee = await Employee.findByIdAndDelete({ _id: employeeId });
  if (!employee) {
    throw new NotFoundError("Employee with given ID not found");
  }
  res.status(StatusCodes.OK).json({ employee });
};

const updateEmployee = async (req, res) => {
  const { id: employeeId } = req.params;
  const employee = await Employee.findByIdAndUpdate(
    { _id: employeeId },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!employee) {
    throw new NotFoundError("Employee with given ID not found");
  }
  res.status(StatusCodes.OK).json({ employee });
};
const bulkInsert = async (req, res) => {
  const data = req.body;
  //console.log(data);
  const employees = await Employee.insertMany(data);
  res.status(StatusCodes.CREATED).json({ success: true });
};
const getEmployeeCounts = async (req,res)=>{
  const values = await Employee.aggregate().sortByCount("employeeType");
  res.status(StatusCodes.OK).json(values);
}
module.exports = {
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  bulkInsert,
  getEmployeeCounts
};
