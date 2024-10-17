const path = require('path');
const multer = require('multer');

// Allowed audio file types
const UPLOADS_DIR = 'uploads/';  // Directory to save uploaded files
const ALLOWED_FILE_TYPES = /mp3|wav|ogg|mpeg|flac/;

// Define custom storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);  // Set the upload destination folder
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname).toLowerCase(); // Get the file extension
        const fileName = `${file.fieldname}-${Date.now()}${fileExt}`;  // Create a unique file name
        cb(null, fileName);  // Pass the final filename to multer
    }
});

// Define file type validation logic
const fileFilter = (req, file, cb) => {
    const isMimeTypeValid = ALLOWED_FILE_TYPES.test(file.mimetype);
    const isExtValid = ALLOWED_FILE_TYPES.test(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeValid && isExtValid) 
    {
        cb(null, true);  // Accept file
    } 
    else 
    {
        cb(new Error('Invalid file type. Only audio files are allowed (mp3, wav, ogg, mpeg, flac).'), false);
    }
};

// Create upload instance with max file size and file filter
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB (adjust as necessary) 
    fileFilter,
}).single('file');  // Single file upload handler for 'file' field


// Middleware function to handle file uploads
const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) 
        {
            // A multer-specific error occurred
            return res.status(400).json({
                success: false,
                message: `Multer error: ${err.message}`,
            });
        } 
        else if(err) 
        {
            // An unknown error occurred
            return res.status(400).json({
                success: false,
                message: `File upload error: ${err.message}`,
            });
        }

        if (!req.file) 
        {
            // No file was uploaded
            return res.status(400).json({
                success: false,
                message: 'No file was uploaded. Please provide an audio file.',
            });
        }

        // Proceed to the next middleware/controller
        next();
    });
};

module.exports = handleFileUpload;