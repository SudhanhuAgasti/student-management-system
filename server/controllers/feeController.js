const Fee = require("../models/Fee");
const nodemailer = require("nodemailer");


exports.payFees = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const fee = new Fee({ ...req.body, adminId });
    await fee.save();

    const Student = require("../models/Student");
    if (req.body.studentId && req.body.amountPaid) {
      const student = await Student.findOne({ _id: req.body.studentId, adminId });
      if (student) {
        student.feesPaid = (student.feesPaid || 0) + Number(req.body.amountPaid);
        await student.save();
      }
    }

    res.json({
      message: "Fee Paid Successfully"
    });
  } catch (err) {
    next(err);
  }
};

exports.getFees = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const data = await Fee.find({ adminId }).populate("studentId");
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.sendFeeReminders = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const Student = require("../models/Student");
    
    // Find students with pending fees
    const studentsWithPending = await Student.find({
      adminId,
      $expr: { $gt: ["$totalFees", "$feesPaid"] }
    });

    if (studentsWithPending.length === 0) {
      return res.json({ 
        message: "No students with pending fees found.",
        defaulters: []
      });
    }

    const defaulters = studentsWithPending.map(student => {
      const pendingAmount = student.totalFees - student.feesPaid;
      const message =`🎓 *Educore Institute Update*

Dear ${student.name},

We truly appreciate your commitment to your *${student.course || "enrolled"}* course. This is a friendly note to let you know that a small balance is still pending on your account.

*Here’s a quick overview:*

* Total Fee: ₹${student.totalFees}
* Amount Paid: ₹${student.feesPaid}
* *Remaining Balance: ₹${pendingAmount}*

We kindly request you to clear the dues at your convenience so you can continue your learning journey without any interruptions.

Thank you for being a valued part of Educore! 🌟

Best regards,
*Educore Administration*`
;
      
      return {
        _id: student._id,
        name: student.name,
        phone: student.phone,
        course: student.course,
        pendingAmount,
        whatsappUrl: `https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`
      };
    });

    res.json({
      message: `${defaulters.length} defaulters identified.`,
      defaulters
    });
  } catch (err) {
    next(err);
  }
};
