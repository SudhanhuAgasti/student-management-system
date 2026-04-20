import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BASE_URL } from "../services/api";

export const generateFeeReceipt = (data) => {
  const doc = new jsPDF();
  const { student, transaction } = data;

  // Header - Brand
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EduCore", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Fee Receipt", 20, 30);
  doc.text(new Date().toLocaleDateString(), 170, 20);

  // Content
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.text("Student Details", 20, 55);
  doc.setLineWidth(0.5);
  doc.line(20, 58, 190, 58);

  doc.setFontSize(10);
  doc.text(`Name: ${student.name}`, 20, 65);
  doc.text(`Student ID: ${student._id.toUpperCase()}`, 20, 72);
  doc.text(`Course: ${student.course}`, 20, 79);

  doc.text("Payment Details", 20, 95);
  doc.line(20, 98, 190, 98);

  const tableData = [
    ["Description", "Amount"],
    ["Tuition Fees Received", `INR ${transaction.amount.toLocaleString()}`],
    ["Remaining Balance", `INR ${transaction.remaining.toLocaleString()}`]
  ];

  autoTable(doc, {
    startY: 105,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }
  });

  const finalY = doc.lastAutoTable.finalY + 20;
  
  doc.setFont("helvetica", "italic");
  doc.text("This is a computer-generated receipt and does not require a physical signature.", 20, finalY);
  doc.text("Thank you for choosing EduCore.", 20, finalY + 7);

  doc.save(`Receipt_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const shareFeeReceipt = async (data) => {
  const doc = new jsPDF();
  const { student, transaction } = data;

  // Re-using same receipt generation logic
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("EduCore", 20, 20);
  doc.setFontSize(10);
  doc.text("Official Fee Receipt", 20, 30);
  
  doc.setTextColor(50, 50, 50);
  doc.text(`Student: ${student.name}`, 20, 60);
  
  autoTable(doc, {
    startY: 80,
    head: [["Description", "Amount"]],
    body: [
      ["Amount Paid", `INR ${transaction.amount.toLocaleString()}`],
      ["Remaining", `INR ${transaction.remaining.toLocaleString()}`]
    ],
    headStyles: { fillColor: [79, 70, 229] }
  });

  const pdfBlob = doc.output('blob');
  const fileName = `Receipt_${student.name.replace(/\s+/g, '_')}.pdf`;
  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Fee Receipt',
        text: `Here is the fee receipt for ${student.name} from EduCore.`,
      });
    } catch (err) {
      console.error("Share failed:", err);
      doc.save(fileName); // Fallback to download
    }
  } else {
    // If sharing not supported (Desktop), just download
    doc.save(fileName);
    alert("Sharing not supported on this browser. PDF has been downloaded instead.");
  }
};

export const generateAttendanceReport = (student, logs) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EduCore Athletics", 20, 20);
  
  doc.setFontSize(10);
  doc.text("Monthly Attendance Report", 20, 30);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 160, 20);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.text(`Student: ${student.name}`, 20, 55);
  doc.text(`Course: ${student.course}`, 20, 62);
  
  const tableData = logs.map(log => [
    new Date(log.date).toLocaleDateString(),
    new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    log.status
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Date", "Time", "Status"]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }
  });

  doc.save(`Attendance_${student.name.replace(/\s+/g, '_')}.pdf`);
};

export const generatePerformanceCard = async (student, stats) => {
  const doc = new jsPDF();

  // Helper function to load image
  const loadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Vibrant Blue Header
  doc.setFillColor(99, 102, 241); 
  doc.rect(0, 0, 210, 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("EduCore Performance Card", 20, 30);
  doc.setFontSize(12);
  doc.text("Academic Excellence & Growth Metrics", 20, 42);

  // Profile Picture handling
  let avatarX = 160;
  let avatarY = 70;
  let avatarSize = 35;

  if (student.profilePic) {
    let imgUrl = student.profilePic;
    if (!imgUrl.startsWith('http') && !imgUrl.startsWith('data:')) {
      imgUrl = `${BASE_URL}${imgUrl}`;
    }
    const img = await loadImage(imgUrl);
    if (img) {
      // Draw a frame for the photo
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(1);
      doc.rect(avatarX - 2, avatarY - 2, avatarSize + 4, avatarSize + 4);
      doc.addImage(img, "PNG", avatarX, avatarY, avatarSize, avatarSize, undefined, 'FAST');
    }
  } else {
    // Placeholder if no photo
    doc.setDrawColor(200, 200, 200);
    doc.rect(avatarX, avatarY, avatarSize, avatarSize);
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(8);
    doc.text("NO PHOTO", avatarX + 10, avatarY + 18);
  }

  // Student Section
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(student.name.toUpperCase(), 20, 85);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Roll Number: ${student.rollNumber || "NOT ASSIGNED"}`, 20, 93);
  doc.text(`Course: ${student.course}`, 20, 99);
  doc.text(`Student ID: ${student._id.slice(-8).toUpperCase()}`, 20, 105);

  // Line Separator
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 115, 190, 115);

  // Stats Grid
  autoTable(doc, {
    startY: 125,
    head: [["Performance Metric", "Student Score", "Status"]],
    body: [
      ["Overall Attendance", `${stats.attendancePercentage}%`, stats.attendancePercentage >= 75 ? "EXCELLENT" : "WARNING"],
      ["Course Progress", `Enrolled: ${student.course}`, "ACTIVE"],
      ["Fee Status", stats.pendingFees === 0 ? "FULL RECOVERY" : "PARTIAL PAID", stats.pendingFees === 0 ? "CLEAR" : "DUE"]
    ],
    theme: 'striped',
    styles: { fontSize: 11, cellPadding: 8, font: 'helvetica' },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' }
  });

  // Footer Branding
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Verified by EduCore Academic Board", 105, 270, null, null, "center");
  doc.text("© 2026 EduCore Institute Management System", 105, 277, null, null, "center");

  doc.save(`Performance_${student.name.replace(/\s+/g, '_')}.pdf`);
};
