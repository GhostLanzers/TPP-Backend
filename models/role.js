const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: '',
  },
  designation: {
    type: String,
    default: '',
  },
  processType: {
    type: String,
    enum: {
      values: ['International', 'Domestic'],
      message: 'Not a valid process type',
    },
    default: 'Domestic',
  },
  experience: {
    type: Number,
    default: 0,
  },
  skill: {
    type: [String],
    default: [],
  },
  qualification: {
    type: String,
    default: '',
  },
  shift: {
    type: String,
    default: '',
  },
  salary: {
    type: String,
    default: '',
  },
  cabFacility: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    default: '',
  },
  area: {
    type: String,
    default: '',
  },
  bond: {
    type: Number,
    default: 0,
  },
  ageCriteria: {
    type: String,
    default: '',
  },
  period: {
    type: String,
    enum: {
      values: ['Permanent', 'Contract', 'Notice Period', 'Buyout'],
      message: 'Not a valid period',
    },
    default: 'Permanent',
  },
  otherDocs: {
    type: String,
    default: '',
  },
  orginalJD: {
    type: String,
    default: '',
  },
  faqs: {
    type: String,
    default: '',
  },
  rejectionReasons: {
    type: [String],
    default: [],
  },
})
roleSchema.pre('save', function (next) {
  if ('invalid' == this.name) {
    return next(new Error('#sadpanda'))
  }
  next()
})

module.exports = mongoose.model('Role',roleSchema)