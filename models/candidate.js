const mongoose = require('mongoose')

const preCompanySchema = mongoose.Schema({
  companyName: String,
  role: String,
  salary: Number,
  startDate: Date,
  endDate: Date,
  experience: Number,
})

const candidateSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide name'],
  },
  mobile: {
    type: [String],
    required: [true, 'Please provide Mobile Number'],
  },
  email: String,
  currentCity: String,
  languages: [String],
  dob: Date,
  skills: [String],
  experience: [preCompanySchema],
  applications: {
    type: [
      {
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company',
        },
        roleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',
        },
        interviewDate: Date,
      },
    ],
  },
  l1Assessment: {
    type: String,
    enum: {
      values: [
        'DND',
        'Number Not Reachable',
        'Wrong Number',
        'Blacklist',
        'NE-Fresher',
        'NI-In-Job',
        'NI-Experienced',
        'NI-Convincing',
        'WD',
        'TAC',
        'GOOD',
      ],
    },
  },
  l2Assessment: {
    type: String,
    enum: {
      values: [
        'DND',
        'Number Not Reachable',
        'Wrong Number',
        'Blacklist',
        'NE-Fresher',
        'NI-In-Job',
        'NI-Experienced',
        'NI-Convincing',
        'WD',
        'TAC',
        'GOOD',
      ],
    },
    required: [
      function () {
        return this.l1Assessment != null
      },
      'Fill L1 Assessment first',
    ],
  },
})

module.exports = new mongoose.model('Candidate', candidateSchema)
