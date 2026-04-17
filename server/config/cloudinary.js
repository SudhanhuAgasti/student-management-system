const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configure Student Profile Pic Storage
const studentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'student_profiles',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

// Configure Teacher Notes Storage
const noteStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'teacher_notes',
        resource_type: 'auto', // Important for PDFs
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'docx'],
    },
});

const uploadStudentPic = multer({ storage: studentStorage });
const uploadTeacherNote = multer({ storage: noteStorage });

module.exports = {
    cloudinary,
    uploadStudentPic,
    uploadTeacherNote
};
