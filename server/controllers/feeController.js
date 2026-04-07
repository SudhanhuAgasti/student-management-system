const Fee = require("../models/Fee");
const nodemailer = require("nodemailer");


exports.payFees = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
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
    const adminId = req.admin.id;
    const data = await Fee.find({ adminId }).populate("studentId");
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.sendFeeReminders = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const Student = require("../models/Student");
    
    // Find students with pending fees
    const studentsWithPending = await Student.find({
      adminId,
      $expr: { $gt: ["$totalFees", "$feesPaid"] }
    });

    if (studentsWithPending.length === 0) {
      return res.json({ message: "No students with pending fees found." });
    }

    // Connect to Nodemailer to send real email to the Admin
    let emailSent = false;
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Generate HTML list of students with WhatsApp quick links
      let studentsHtml = `<table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f8fafc;">
          <th>Name</th>
          <th>Course</th>
          <th>Due Amount</th>
          <th>Quick Action</th>
        </tr>`;

      studentsWithPending.forEach(student => {
        const pendingAmount = student.totalFees - student.feesPaid;
        const msg = encodeURIComponent(`Hello ${student.name}, this is a gentle reminder from ${req.admin.name || "Administration"} regarding your pending fees of Rs ${pendingAmount} for the ${student.course} course. Please clear your dues.`);
        
        studentsHtml += `
          <tr>
            <td><strong>${student.name}</strong><br/><small>${student.phone || "No phone"}</small></td>
            <td>${student.course || "N/A"}</td>
            <td style="color: #e11d48; font-weight: bold;">₹${pendingAmount}</td>
            <td><a href="https://wa.me/${student.phone}?text=${msg}" style="display: inline-block; padding: 6px 12px; background-color: #10b981; color: white; text-decoration: none; border-radius: 4px;">WhatsApp Student</a></td>
          </tr>
        `;
      });
      studentsHtml += `</table>`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.admin.email, // Send to the logged-in Admin's verified email Address
        subject: `Fee Defaulter Report - ${new Date().toLocaleDateString()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Action Required: Fee Reminders</h2>
            <p>Hello <b>${req.admin.name || "Admin"}</b>,</p>
            <p>You have triggered the bulk reminder system for your institution.</p>
            <p>Currently, there are <strong>${studentsWithPending.length}</strong> students with outstanding balances. You can review the list below and use the "WhatsApp Student" links to dispatch quick reminders securely.</p>
            <br/>
            ${studentsHtml}
            <br/>
            <p>Regards,<br/>EduCore Automation System</p>
          </div>
        `,
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } else {
        console.log(`[DEBUG MAIL] Email not setup. Content: ${studentsHtml}`);
      }
    } catch (emailErr) {
      console.error("Error sending reminder report: ", emailErr);
    }

    res.json({
      message: emailSent ? `Report dispatched to ${req.admin.email}` : "Report generated locally (no email env configured)",
      count: studentsWithPending.length
    });
  } catch (err) {

    next(err);
  }
};
