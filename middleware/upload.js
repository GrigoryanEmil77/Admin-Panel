
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Uploading to directory: ', path.join(__dirname, 'public', 'videos'));
        if (file.mimetype.startsWith('image/')) {
            cb(null, './public/images');
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, './public/videos'); 
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const fileFilter = (req, file, cb) => {
    console.log('File MIME Type:', file.mimetype);  
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
};



const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } 
});

module.exports = upload;
