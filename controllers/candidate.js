const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/not-found");
const Candidate = require("../models/candidate");
const Role = require("../models/role");
const Count = require("../models/count");
const Company = require("../models/company");

const addCandidate = async (req, res) => {
  const candidate = await Candidate.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ success: true, candidate: candidate });
};

const getAllCandidates = async (req, res) => {
  
  const {
    l1Assessment: l1Assessment,
    l2Assessment: l2Assessment,
    select: select,
    interviewStatus: interviewStatus,
    awaiting: awaiting,
    companyId: companyId,
    roleId: roleId,
  } = req.query;
  var query = [];
  if (l1Assessment)
    query.push({ l1Assessment: { $in: l1Assessment.split(",") } });
  if (l2Assessment)
    query.push({ l2Assessment: { $in: l2Assessment.split(",") } });
  if (select) query.push({ select: { $in: select.split(",") } });
  if (interviewStatus)
    query.push({ interviewStatus: { $in: interviewStatus.split(",") } });
  

  if (query.length == 0) {
    query = {};
  } else {
    query = { $or: query };
  }
  if (awaiting) {
    console.log("HI");
    query = { l1Assessment: ["GOOD", "TAC"], l2Assessment: null };
  } 
  var candidates = await Candidate.find(query);
  const access = ["Intern","Recruiter"].includes(req.user.employeeType)
  if(companyId){
    candidates = candidates.filter(
      (c) => c.companyId == companyId
    );
  }
  if (roleId) {
    candidates = candidates.filter((c) => c.roleId == roleId);
  }
  if(access){
    candidates = candidates.filter(
      (c) => c.assignedEmployee == req.user.userid
    );
    
  }

  res.status(StatusCodes.OK).json(candidates);
};

const getCandidate = async (req, res) => {
  const { id: candidateId } = req.params;

  const candidate = await Candidate.findById({
    _id: candidateId,
  })
    .populate("companyId")
    .populate("roleId")
    .exec();
  if (!candidate) throw new NotFoundError("Candidate with given ID Not Found");
  res.status(StatusCodes.OK).json(candidate);
};

const updateCandidate = async (req, res) => {
  const { id: candidateId } = req.params;
  const candidate = await Candidate.findByIdAndUpdate(
    {
      _id: candidateId,
    },
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  if (!candidate) throw new NotFoundError("Candidate with given ID Not Found");
  res.status(StatusCodes.OK).json(candidate);
};

const deleteCandidate = async (req, res) => {
  const { id: candidateId } = req.params;
  const candidate = await Candidate.findByIdAndDelete({
    _id: candidateId,
  });
  if (!candidate) throw new NotFoundError("Candidate with given ID Not Found");
  res.status(StatusCodes.OK).json(candidate);
};








const getAssessmentCounts = async (req, res) => {
  const l1values = await Candidate.aggregate().sortByCount("l1Assessment");
  const l2values = await Candidate.aggregate().sortByCount("l2Assessment");
  const interview = await Candidate.aggregate().sortByCount("interviewStatus");
  const select = await Candidate.aggregate().sortByCount("select");
  const awaiting = await Candidate.find({
    l1Assessment: ["GOOD", "TAC"],
    l2Assessment: null,
  });
  var l1data = {};
  for (const i of l1values) {
    l1data[i["_id"]] = i["count"];
  }
  var l2data = {};
  for (const i of l2values) {
    l2data[i["_id"]] = i["count"];
  }
  var interdata = {};
  for (const i of interview) {
    interdata[i["_id"]] = i["count"];
  }
  var selectData = {};
  for (const i of select) {
    selectData[i["_id"]] = i["count"];
  }
  const allCandidate = await Candidate.find({});
  const allCompany = await Company.find({});
 
  res
    .status(StatusCodes.OK)
    .json({
      l1data,
      l2data,
      interdata,
      selectData,
      awaiting: awaiting.length,
      allCompany: allCompany.length,
      allCandidate: allCandidate.length,
    });
};

const bulkInsert = async (req, res) => {
  const data = req.body;
  const employees = await Candidate.insertMany(data);
  res.status(StatusCodes.CREATED).json({ success: true });
};

const searchCandidate = async (req, res) => {
  const { name: name, mobile: mobile, email: email } = req.body;
  query = [];
  if (name) query.push({ fullName: { $regex: ".*" + name + ".*" } });
  if (mobile) query.push({ mobile: { $in: mobile } });
  if (email) query.push({ email: { $in: email } });
  const candidates = await Candidate.find({ $or: query });

  res.status(StatusCodes.OK).json(candidates);
};
const getPotentialLeads = async (req, res) => {
  const { query: query, roleId: roleId, companyId: companyId } = req.body;
  const role = await Role.findById({ _id: roleId });

  searchquery = {$or:[{
    "qualifications.qualification": { $in: role.qualification }},
    {$or: [
      { currentCity: { $in: role.location } },
      { homeTown: { $in: role.location } },
    ]},
    {skills: { $in: role.skill }}]
  };
  if (query.length > 0) searchquery["$nor"] = query;
  const candidates = await Candidate.find(searchquery);
  res.status(StatusCodes.OK).json(candidates);
};

const assignRecruiter = async (req, res) => {
  const { list: list,companyId:companyId, roleId:roleId } = req.body;
  var candidates = [];
  list.forEach(({ emp, part }) => {
    part.forEach(async (_id) => {
      const candidate = await Candidate.findByIdAndUpdate(
        { _id: _id },
        { assignedEmployee: emp, companyId: companyId, roleId: roleId }
      );
      candidates.push(candidate);
    });
  });
  res.status(StatusCodes.OK).json(candidates);
};
const assignSearch = async (req,res) =>{
  const candidates = await Candidate.find({...req.body.query})
  res.status(StatusCodes.OK).json({candidates})
}
const checkNumber = async (req,res) => {
const { number: number } = req.params;
const candidate = await Candidate.find({
  mobile:{$in:[number]}
});
const status = true
if (!candidate) status=false
res.status(StatusCodes.OK).json(status);
}
const getCompanyRoleCounts = async (req,res) =>{
  const {
    interviewStatus: interviewStatus,
    companyId: companyId,
    roleID: roleID,
  } = req.body;
    
}

module.exports = {
  getAllCandidates,
  getCandidate,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getAssessmentCounts,
  bulkInsert,
  searchCandidate,
  getPotentialLeads,
  assignRecruiter,
  assignSearch,
  checkNumber
};
