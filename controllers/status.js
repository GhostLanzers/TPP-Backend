const { StatusCodes } = require("http-status-codes");

const status = async (req, res) => {
  console.log(req.user);
  res
    .status(StatusCodes.OK)
    .json({ success: true, userMail: req.user.userMail });
};
module.exports = { status };
