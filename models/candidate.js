const mongoose = require("mongoose");

const Counter = require("./count");
const candidateSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide name"],
  },
  mobile: {
    type: [String],
    required: [true, "Please provide Mobile Number"],
    unique: true,
  },
  email: [String],
  candidateId: String,
  homeTown: String,
  currentCity: String,
  qualifications: {
    type: [
      {
        qualification: String,
        YOP: String,
      },
    ],
  },
  languages: {
    type: [
      {
        language: String,
        level: {
          type: String,
          enum: {
            values: ["Beginner", "Intermediate", "Advanced", "Proficient"],
          },
          default: "Beginner",
        },
      },
    ],
  },
  skills: [String],
  experience: {
    type: [
      {
        companyName: String,
        role: String,
        salary: Number,
        startDate: Date,
        endDate: Date,
        experience: Number,
      },
    ],
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  interviewDate: Date,
  remarks: String,
  interviewStatus: {
    type: String,
    enum: {
      values: [
        "TPP Venue",
        "Client Venue",
        "Virtual Interview",
        "Reject FSR Communication",
        "Reject FSR Stability",
        "Reject FSR Domain",
        "Reject Amcat",
        "Reject Amcat - Technical Issue Reject Amcat Cooling Period",
        "Reject Versant",
        "Reject Versant - Technical Issue",
        "Reject Versant Cooling Period",
        "Reject Technical",
        "Reject Typing",
        "Reject Group Discussion",
        "Reject Ops/Client Communication",
        "Reject Ops/Client Stability",
        "Reject Ops/Client Domain",
        "Reject Vice President",
        "No Show Walk-in",
        "No Show IC",
        "Hold",
        "Pending FSR",
        "Pending Amcat",
        "Pending Versant",
        "Pending Technical",
        "Pending Typing",
        "Pending Group Discussion",
        "Pending Ops/Client",
        "Pending Vice President",
        "Offer Drop",
        "Select",
      ],
    },
  },
  select: {
    type: String,
    enum: {
      values: [
        "Tracking",
        "Non Tenure",
        "Need to Bill",
        "Billed",
        "Process Rampdown",
        "Client Rampdown",
      ],
    },
    required: [
      function () {
        return this.interviewStatus == "Select";
      },
      "You can select if you selected Select in Interview Status",
    ],
  },

  EMP_ID: {
    type: String,
    // required: [true, "Need to provide Employee ID"],
  },
  onboardingDate: Date,
  nextTrackingDate: Date,

  l1Assessment: {
    type: String,
    enum: {
      values: [
        "DND",
        "Number Not Reachable",
        "Wrong Number",
        "Blacklist",
        "NE-Fresher",
        "NI-In-Job",
        "NI-Experienced",
        "NI-Convincing",
        "WD",
        "TAC",
        "GOOD",
      ],
    },
  },
  l2Assessment: {
    type: String,
    enum: {
      values: [
        "DND",
        "Number Not Reachable",
        "Wrong Number",
        "Blacklist",
        "NE-Fresher",
        "NI-In-Job",
        "NI-Experienced",
        "NI-Convincing",
        "WD",
        "TAC",
        "GOOD",
      ],
    },
    
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
});

candidateSchema.pre("save", function (next) {
  if (this.isNew) {
    var doc = this;
    Counter.findByIdAndUpdate(
      { _id: "candidateCounter" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
      .then(function (count) {
        doc.candidateId = "CAN" + String(count.seq).padStart(5, "0");
        next();
      })
      .catch(function (error) {
        throw error;
      });
  } else {
    next();
  }
});

candidateSchema.pre("insertMany", async function (next, docs) {
  try {
    for (const doc of docs) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "candidateCounter" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.candidateId = "CAN" + String(counter.seq).padStart(7, "0");
    }
    next();
  } catch (err) {
    throw err;
  }
});

module.exports = new mongoose.model("Candidate", candidateSchema);
