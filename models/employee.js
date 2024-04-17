const mongoose  = require('mongoose')
const employeeSchema = mongoose.Schema({
 name:String,
 password:String,
 email:String,
 designation:{
  type:String,
  enum:{
   values:['Manager','Admin','Team Lead','Intern']
  }
 }
})