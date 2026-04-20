const cron = require('node-cron');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Function to simulate sending WhatsApp message
// In a real scenario, you'd use Twilio, Interakt, or another WhatsApp API provider here
const sendWhatsAppReminder = async (studentName, parentPhone) => {
    const header = `🚨 *ATTENDANCE ALERT | EduCore* 🚨\n\n`;
    
    const englishMsg = `*Dear Parent*,\nYour child, *${studentName}*, has NOT marked their attendance today. Please ensure they attend classes regularly. Continuous absence can lead to learning gaps and cause significant disturbance in upcoming exams.`;
    
    const hindiMsg = `*प्रिय अभिभावक*,\nआपके बच्चे, *${studentName}*, ने आज अपनी उपस्थिति दर्ज नहीं की है। कृपया सुनिश्चित करें कि वे नियमित रूप से कक्षाओं में उपस्थित हों। लगातार अनुपस्थिति से सीखने में कमी आ सकती है और आगामी परीक्षाओं में भी बाधा उत्पन्न हो सकती है।`;
    
    const odiaMsg = `*ପ୍ରିୟ ଅଭିଭାବକ*,\nଆପଣଙ୍କ ସନ୍ତାନ *${studentName}*, ଆଜି ନିଜର ଉପସ୍ଥିତି ଦର୍ଶାଇ ନାହାଁନ୍ତି | ଦୟାକରି ସେମାନେ ନିୟମିତ ଶ୍ରେଣୀରେ ଯୋଗଦେବା ନିଶ୍ଚିତ କରନ୍ତୁ | କ୍ରମାଗତ ଅନୁପସ୍ଥିତି ଶିକ୍ଷାରେ ବ୍ୟାଘାତ ସୃଷ୍ଟି କରିପାରେ ଏବଂ ଆଗାମୀ ପରୀକ୍ଷାରେ ଅସୁବିଧା ସୃଷ୍ଟି କରିପାରେ |`;

    const footer = `\n\n_Regards,_\n*Management, EduCore*`;

    const fullMessage = `${header}${englishMsg}\n\n${hindiMsg}\n\n${odiaMsg}${footer}`;

    console.log(`--------------------------------------------------`);
    console.log(`SENDING WHATSAPP TO: ${parentPhone}`);
    console.log(`MESSAGE:\n${fullMessage}`);
    console.log(`--------------------------------------------------`);
    
    // INTEGRATION TIP: 
    // To actually send this via WhatsApp, you would call your API here.
    // Example with a generic API:
    // await axios.post('https://api.whatsapp.com/send', { phone: parentPhone, text: fullMessage });
};

const runAbsenceCheck = async () => {
    console.log('Running Manual Absence Reminder Check...');

    try {
        const today = new Date();
        // Check if Sunday (0 = Sunday)
        if (today.getDay() === 0) {
            console.log('Today is Sunday, skipping absence reminders.');
            return { msg: 'Today is Sunday, no reminders sent.' };
        }

        const dateStr = today.toISOString().split('T')[0];
        
        // 1. Get all students
        const allStudents = await Student.find({});
        let sentCount = 0;
        
        for (const student of allStudents) {
            // 2. Check if student has a 'Present' record for today
            const attendance = await Attendance.findOne({
                studentId: student._id,
                date: dateStr,
                status: 'Present'
            });

            // 3. If no 'Present' record found, send reminder to parent
            if (!attendance) {
                if (student.parentPhone) {
                    await sendWhatsAppReminder(student.name, student.parentPhone);
                    sentCount++;
                } else {
                    console.log(`Skipping reminder for ${student.name} - No parent phone number found.`);
                }
            }
        }
        
        console.log(`Presence check completed. Reminders generated for ${sentCount} absentees.`);
        return { msg: `Success! ${sentCount} reminders generated. Check server console.` };
    } catch (err) {
        console.error('Error in Absence Reminder Check:', err);
        throw err;
    }
};

const initAbsenceReminderJob = () => {
    // Schedule task to run at 11:05 AM IST daily
    cron.schedule('05 11 * * *', async () => {
        await runAbsenceCheck();
    });
};

module.exports = { initAbsenceReminderJob, runAbsenceCheck };
