const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/not-found");
const Candidate = require("../models/candidate");

const addCandidate = async (req, res) => {
  const candidate = await Candidate.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ success: true, candidate: candidate });
};

const getAllCandidates = async (req, res) => {
  const candidates = await Candidate.find({});
  res.status(StatusCodes.OK).json(candidates);
};

const getCandidate = async (req, res) => {
  const { id: candidateId } = req.params;
  console.log(candidateId);
  const candidate = await Candidate.findById({
    _id: candidateId,
  });
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

const getInterviewStatusValues = async (req, res) => {
  const values = Candidate.schema.path(
    "application.interviewStatus"
  ).enumValues;
  res.status(StatusCodes.OK).json(values);
};

const getL2AssessmentValues = async (req, res) => {
  const values = Candidate.schema.path("l2Assessment").enumValues;
  res.status(StatusCodes.OK).json(values);
};

const getSelectValues = async (req, res) => {
  const values = Candidate.schema.path("application.select").enumValues;
  res.status(StatusCodes.OK).json(values);
};

const getL1AssessmentValues = async (req, res) => {
  const values = Candidate.schema.path("l1Assessment").enumValues;
  res.status(StatusCodes.OK).json(values);
};

const getAssessmentCounts = async (req, res) => {
  const l1values = await Candidate.aggregate().sortByCount("l1Assessment");
  const l2values = await Candidate.aggregate().sortByCount("l2Assessment");
  const interview = await Candidate.aggregate().sortByCount("interviewStatus");
  const select = await Candidate.aggregate().sortByCount("select");
  const awaiting = await Candidate.find({ l1Assessment: ["GOOD",'TAC'],l2Assessment:null });
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
  console.log(awaiting.length);
  res.status(StatusCodes.OK).json({ l1data, l2data, interdata, selectData,awaiting:awaiting.length });
};

const bulkInsert = async (req, res) => {
  const data = req.body;
  console.log(data);
  const employees = await Candidate.insertMany(data);
  res.status(StatusCodes.CREATED).json({ success: true });
};
module.exports = {
  getAllCandidates,
  getCandidate,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getInterviewStatusValues,
  getL1AssessmentValues,
  getL2AssessmentValues,
  getSelectValues,
  getAssessmentCounts,
  bulkInsert,
};
