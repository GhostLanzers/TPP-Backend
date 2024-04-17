const mongoose = require('mongoose')
const {roleSchema} = require('./role')
const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please Provide Company Name'],
    maxlength: 30,
  },
  HRName: {
    type: String,
  },
  HRMobile: {
    type: [String],
    validate: [
      (value) => {
        return value.length <= 10
      },
      'Cannot have more than 10 Mobile Numbers',
    ],
  },
  HREmail: {
    type: String,
    required: [true, 'Please provide Email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid Email',
    ],
    unique:true
  },
  about:{
   type:String,
   default:""
  },
  remarks:{
   type:String,
   default:""
  },
  response:{
   type:String,
   enum:{
    values:['Empanelled','Need to Approach','In Process','Future','Not Intrested','Rejected','No Response'],
    message:'Not a valid Response'
   },
   default:'No Response'
  },
  empanelled:{
   type:Boolean,
   default:false
  },
  roles:{
   type:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Role'
    }
  ]
  }
})


module.exports=new mongoose.model('Company',companySchema)