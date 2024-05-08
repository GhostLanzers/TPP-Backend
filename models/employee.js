const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const employeeSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  employeeType: {
    type: String,
    enum: {
      values: ["Recruiter", "Teamlead", "Manager", "Intern"],
    },
  },
  mobile: String,
  parentMobile: String,
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female"],
    },
  },
  currentAddress: String,
  permanentAddress: String,
  DOB: Date,
  DOJ: Date,
  documentation: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

employeeSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
employeeSchema.methods.createJWT = function () {
  return jwt.sign({ userid: this._id }, process.env.SECRET, {
    expiresIn: "1h",
  });
};

employeeSchema.methods.checkPassword = async function (providedPassword) {
  const match = await bcrypt.compare(providedPassword, this.password);
  return match;
};

module.exports = new mongoose.model("Employee", employeeSchema);
