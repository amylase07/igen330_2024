const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000; // Change this to any port you prefer

// Middleware to serve static files (CSS, JS)
app.use(express.static(path.join(__dirname)));

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images')); // Ensure this path is correct
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Create unique filename
    }
});

const upload = multer({ storage: storage });

// Endpoint for uploading images
app.post('/save_image', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({
            status: 'success',
            message: 'Image uploaded successfully',
            file: req.file.path
        });
    } else {
        res.status(400).json({ status: 'error', message: 'Image upload failed' });
    }
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the home page
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});