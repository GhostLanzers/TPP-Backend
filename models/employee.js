const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Counter = require("./count");
const employeeSchema = mongoose.Schema({
  employeeId: String,
  name: String,
  password: {
    type:String,
  },
  email: String,
  employeeType: {
    type: String,
    enum: {
      values: [
        "Recruiter",
        "Teamlead",
        "Manager",
        "Intern",
        "Business Development",
        "Admin"
      ],
    },
  },
  mobile: [String],
  parentMobile: String,
  gender: {
    type: String,
    enum: {
      values: ["Male", "Female","Other"],
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
employeeSchema.pre("save", function  (next) {
  
  if (this.isNew) {
    var doc = this;
    Counter.findByIdAndUpdate(
      { _id: "employeeCounter" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
      .then(function (count) {
        doc.employeeId = "EMP" + String(count.seq).padStart(5, "0");
        if(!doc.password)
          doc.password = "TPP@Pass";
      
        next();
      })
      .catch(function (error) {
        throw error;
      });
  } else {
    next();
  }
});

employeeSchema.pre("save", async function () {
 console.log("HI");
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});
employeeSchema.methods.createJWT = function () {
  return jwt.sign({ userid: this._id,userMail:this.email,employeeType:this.employeeType,status:this.status }, process.env.SECRET, {
    expiresIn: "12h",
  });
};

employeeSchema.methods.checkPassword = async function (providedPassword) {
  const match = await bcrypt.compare(providedPassword, this.password);
  return match;
};

employeeSchema.pre("insertMany", async function (next, docs) {
  try {
    for (const doc of docs) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "employeeCounter" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.employeeId = "EMP" + String(counter.seq).padStart(5, "0");
      if(!doc.password){
        const salt = await bcrypt.genSalt(10);
        doc.password = await bcrypt.hash("TPP@Pass", salt);
      }
    }
    next();
  } catch (err) {
    throw err;
  }
});

module.exports = new mongoose.model("Employee", employeeSchema);
