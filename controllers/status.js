const { StatusCodes } = require("http-status-codes");
const Employee = require("../models/employee");
const { UnauthenticatedError } = require("../errors");
const status = async (req, res) => {
  console.log(req.user);
  const user = await Employee.findById({_id:req.user.userid})
  if(!user.status)
    throw new UnauthenticatedError("Access Denied by Admin");
  res
    .status(StatusCodes.OK)
    .json({ success: true, userMail: user.email,employeeType:user.employeeType,userid:user._id });
};
module.exports = { status };
