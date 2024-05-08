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
  const values = await Candidate.aggregate().sortByCount("l1Assessment");
  res.status(StatusCodes.OK).json(values);
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
};
