// const express = require('express');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const PORT = 3000; // Change this to any port you prefer

// // Middleware to serve static files (CSS, JS)
// app.use(express.static(path.join(__dirname)));

// // Set up storage for uploaded images
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, 'images')); // Ensure this path is correct
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Create unique filename
//     }
// });

// const upload = multer({ storage: storage });

// // Endpoint for uploading images
// app.post('/save_image', upload.single('image'), (req, res) => {
//     if (req.file) {
//         res.json({
//             status: 'success',
//             message: 'Image uploaded successfully',
//             file: req.file.path
//         });
//     } else {
//         res.status(400).json({ status: 'error', message: 'Image upload failed' });
//     }
// });

// // Define a route for the root URL
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html')); // Serve the home page
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importing the fs module to handle file operations

const app = express();
const PORT = 3000; // Change this to any port you prefer

// Middleware to serve static files (CSS, JS)
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Middleware to parse JSON body from requests

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

// Endpoint for saving outfits
app.post('/save_outfit', (req, res) => {
    const outfitData = req.body;

    // Ensure outfits.json file exists to store outfit data
    const filePath = path.join(__dirname, 'outfits.json');

    // Read existing outfits
    fs.readFile(filePath, 'utf8', (err, data) => {
        let outfits = [];
        if (!err) { // If reading the file was successful
            outfits = JSON.parse(data); // Parse the existing data
        }
        outfits.push(outfitData); // Add the new outfit
        
        // Write updated outfits back to the file
        fs.writeFile(filePath, JSON.stringify(outfits, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Could not save outfit data' });
            }

            res.json({ status: 'success', message: 'Outfit saved successfully' });
        });
    });
});

// Endpoint for getting outfits
app.get('/get_outfits', (req, res) => {
    const filePath = path.join(__dirname, 'outfits.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not read outfit data' });
        }
        
        const outfits = JSON.parse(data); // Parse and return the saved outfits
        res.json(outfits);
    });
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the home page
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});