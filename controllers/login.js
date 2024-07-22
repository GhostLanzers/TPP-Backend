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
const login = async (req, res) => {
  const { userMail, password } = req.body;
  if (!userMail || !password) {
    throw new BadRequestError("Username and password required");
  }

  const user = await Employee.findOne({ email: userMail });
  if (!user) {
    throw new NotFoundError("User with given mail not found");
  }

  const passwordMatch = await user.checkPassword(password);
  if (!passwordMatch)
    throw new UnauthenticatedError("Password does not Match , Try Again");
  if(!user.status)
    throw new UnauthenticatedError("Access Denied by Admin");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ success: true, token: token });
};

const status = async (req,res) => {
  res.status(StatusCodes.OK).json({success:true,userMail:req.user.userMail})
}
module.exports = { login,status };
