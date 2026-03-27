const Fee = require("../models/Fee");

exports.payFees = async (req, res, next) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.json({
      message: "Fee Paid Successfully"
    });
  } catch (err) {
    next(err);
  }
};

exports.getFees = async (req, res, next) => {
  try {
    const data = await Fee.find().populate("studentId");
    res.json(data);
  } catch (err) {
    next(err);
  }
};
