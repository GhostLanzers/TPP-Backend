const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/not-found");
const Candidate = require("../models/candidate");
const Role = require("../models/role");
const Company = require("../models/company");
const { buildQuery } = require("../utils/candidateHelper");
const addCandidate = async (req, res) => {
   const candidate = await Candidate.create({ ...req.body });
   res.status(StatusCodes.CREATED).json({
      success: true,
      candidate: candidate,
   });
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
// Helper to build query per type

const getAssessmentCounts = async (req, res) => {
   const titles = [
      "newCandidates",
      "L1L2WrongNumbers",
      "L1L2Blacklist",
      "NonLeads",
      "L1WD",
      "L2WD",
      "NSWI",
      "NSIC",
      "Awaiting",
      "L2DND",
      "InterviewScheduled",
      "Rejects",
      "VirtualInterview",
      "OfferDrop",
      "AwaitingJoining",
      "Hold",
      "TrackingTenure",
      "NonTenure",
      "Billed",
      "N2B",
      "ProcessRampdown",
      "ClientRampdown",
      "InvoiceProcessed",
      "BusinessTracking",
      "all",
   ];

   const access = ["Intern", "Recruiter"].includes(req.user.employeeType);
   const userId = req.user.userid;

   // Build all count promises
   const countPromises = titles.map(async (type) => {
      let query = buildQuery(type);
      if (access) {
         query = { ...query, assignedEmployee: userId };
      }
      const count = await Candidate.countDocuments(query);
      return [type, count];
   });

   const countsArr = await Promise.all(countPromises);
   const final = Object.fromEntries(countsArr);

   const allCompany = await Company.countDocuments({});

   res.status(StatusCodes.OK).json({
      ...final,
      allCompany,
   });
};
const bulkInsert = async (req, res) => {
   const data = req.body;
   const employees = await Candidate.insertMany(data, {
      ordered: false,
      rawResult: true,
   });
   res.status(StatusCodes.CREATED).json({ success: true, employees });
};

const searchCandidate = async (req, res) => {
   const { name: name, mobile: mobile, email: email } = req.body;
   query = [];
   if (name)
      query.push({ fullName: { $regex: ".*" + name + ".*", $options: "i" } });
   if (mobile)
      query.push({ mobile: { $regex: ".*" + mobile + ".*", $options: "i" } });
   if (email)
      query.push({ email: { $regex: ".*" + email + ".*", $options: "i" } });
   const candidates = await Candidate.find({ $or: query });

   res.status(StatusCodes.OK).json(candidates);
};
const getPotentialLeads = async (req, res) => {
   const { query: query, roleId: roleId, companyId: companyId } = req.body;
   const role = await Role.findById({ _id: roleId });
   var searchquery = {
      "qualifications.qualification": { $in: role.qualification },

      $or: [
         { currentCity: { $in: role.location } },
         { homeTown: { $in: role.location } },
      ],
   };
   if (role.mandatorySkills.length > 0 && role.optionalSkills.length > 0) {
      searchquery["skills"] = {
         $all: [...role.mandatorySkills],
         $in: [...role.optionalSkills],
      };
   } else if (role.mandatorySkills.length > 0)
      searchquery["skills"] = {
         $all: [...role.mandatorySkills],
      };
   else if (role.optionalSkills.length > 0)
      searchquery["skills"] = {
         $in: [...role.optionalSkills],
      };
   if (query.length > 0) searchquery["$nor"] = query;

   const candidates = await Candidate.find(searchquery)
      .populate("assignedEmployee")
      .populate("createdByEmployee")
      .exec();
   res.status(StatusCodes.OK).json(candidates);
};

const assignRecruiter = async (req, res) => {
   const { list: list } = req.body;
   var candidates = [];
   for (let { emp, part } of list) {
      for (let id of part) {
         try {
            const candidate = await Candidate.findByIdAndUpdate(
               { _id: id },
               { assignedEmployee: emp }
            );
            candidates.push(candidate);
         } catch (error) {
            console.log(id);
         }
      }
   }
   res.status(StatusCodes.OK).json(candidates);
};
const assignSearch = async (req, res) => {
   const candidates = await Candidate.find({ ...req.body.query })
      .populate("assignedEmployee")
      .populate("createdByEmployee")
      .populate("companyId")
      .populate("roleId")
      .exec();
   res.status(StatusCodes.OK).json({ candidates });
};
const checkNumber = async (req, res) => {
   const { number: number } = req.params;

   const candidate = await Candidate.find({
      mobile: String(number),
   });
   var status = true;

   if (candidate.length == 0) {
      status = false;
   }

   res.status(StatusCodes.OK).json({ status });
};

const getAllByClass = async (req, res) => {
   const {
      companyId: companyId,
      roleId: roleId,
      page = 1,
      limit = 20,
   } = req.query;
   const { type: type } = req.params;
   var query = buildQuery(type);

   const access = ["Intern", "Recruiter"].includes(req.user.employeeType);
   if (access) query.assignedEmployee = req.user.userid;

   // Pagination
   const skip = (parseInt(page) - 1) * parseInt(limit);

   // Get total count for pagination
   const total = await Candidate.countDocuments(query);

   const candidates = await Candidate.find(query)
      .select(
         "_id createdByEmployee assignedEmployee fullName candidateId mobile email l1Assessment l2Assessment companyId roleId interviewDate interviewStatus onboardingDate nextTrackingDate billingDate invoiceDate invoiceNumber"
      )
      .populate("companyId", "_id companyName ")
      .populate("roleId", "_id role")
      .populate("assignedEmployee", "_id name")
      .populate("createdByEmployee", "_id name")
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

   res.status(StatusCodes.OK).json({
      candidates,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
   });
};
const getAllByClassOnlyIDs = async (req, res) => {
   const { companyId: companyId, roleId: roleId } = req.query;
   const { type: type } = req.params;
   var query = buildQuery(type);

   const access = ["Intern", "Recruiter"].includes(req.user.employeeType);
   if (access) query.assignedEmployee = req.user.userid;

   // Pagination
   const skip = (parseInt(page) - 1) * parseInt(limit);

   // Get total count for pagination
   const total = await Candidate.countDocuments(query);

   const candidates = await Candidate.find(query).select("_id ");

   res.status(StatusCodes.OK).json(candidates);
};

module.exports = {
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
   checkNumber,
   getAllByClass,
   getAllByClassOnlyIDs,
};
