// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs'); // Importing the fs module to handle file operations

// const app = express();
// const PORT = 3000; // Change this to any port you prefer

// // Middleware to serve static files (CSS, JS)
// app.use(express.static(path.join(__dirname)));
// app.use(express.json()); // Middleware to parse JSON body from requests

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

// // // Endpoint for uploading images
// // app.post('/save_image', upload.single('image'), (req, res) => {
// //     if (req.file) {
// //         res.json({
// //             status: 'success',
// //             message: 'Image uploaded successfully',
// //             file: req.file.path
// //         });
// //     } else {
// //         res.status(400).json({ status: 'error', message: 'Image upload failed' });
// //     }
// // });
// // New endpoint for saving images
// app.post('/save_image', (req, res) => {
//     const imageData = req.body;

//     const filePath = path.join(__dirname, 'savedImages.json');

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         let savedImages = [];
//         if (!err && data) {
//             savedImages = JSON.parse(data); 
//         }
//         savedImages.push(imageData); 
        
//         fs.writeFile(filePath, JSON.stringify(savedImages, null, 2), (err) => {
//             if (err) {
//                 return res.status(500).json({ status: 'error', message: 'Could not save image data' });
//             }
//             res.json({ status: 'success', message: 'Image saved successfully' });
//         });
//     });
// });

// // Endpoint for saving outfits
// app.post('/save_outfit', (req, res) => {
//     const outfitData = req.body;

//     // Ensure outfits.json file exists to store outfit data
//     const filePath = path.join(__dirname, 'outfits.json');

//     // Read existing outfits
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         let outfits = [];
//         if (!err) { // If reading the file was successful
//             outfits = JSON.parse(data); // Parse the existing data
//         }
//         outfits.push(outfitData); // Add the new outfit
        
//         // Write updated outfits back to the file
//         fs.writeFile(filePath, JSON.stringify(outfits, null, 2), (err) => {
//             if (err) {
//                 return res.status(500).json({ status: 'error', message: 'Could not save outfit data' });
//             }

//             res.json({ status: 'success', message: 'Outfit saved successfully' });
//         });
//     });
// });

// // Endpoint for getting outfits
// app.get('/get_outfits', (req, res) => {
//     const filePath = path.join(__dirname, 'outfits.json');

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ status: 'error', message: 'Could not read outfit data' });
//         }
        
//         const outfits = JSON.parse(data); // Parse and return the saved outfits
//         res.json(outfits);
//     });
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
//app.use(express.json()); // Middleware to parse JSON body from requests
app.use(express.json({ limit: '1000mb' })); // Allow up to 50MB payload size
app.use(express.urlencoded({ limit: '1000mb', extended: true })); // For handling form data with larger sizes


// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images')); // Ensure this path is correct
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Create unique filename
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Set limit to 50MB
});

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
// Inside server.js


// // New endpoint for saving images and attributes
// app.post('/save_image', (req, res) => {
//     const imageData = req.body;

//     // Path to save the image file
//     const fileName = `${Date.now()}.jpg`;
//     const imagePath = path.join(__dirname, 'images', fileName);

//     // Get the base64 string from the image data
//     const base64Image = imageData.src.split(',')[1];

//     // Write the saved image to the filesystem
//     fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
//         if (err) {
//             return res.status(500).json({ status: 'error', message: 'Could not save the image file' });
//         }

//         // Prepare the data for saving in savedImages.json
//         const dataToSave = {
//             src: imagePath, // Store the file path instead of Base64
//             attributes: imageData.attributes
//         };

//         // Read and parse savedImages.json
//         const jsonFilePath = path.join(__dirname, 'savedImages.json');

//         fs.readFile(jsonFilePath, 'utf8', (err, data) => {
//             let savedImages = [];
//             if (!err && data) {
//                 savedImages = JSON.parse(data); 
//             }

//             savedImages.push(dataToSave); 

//             // Write back to the savedImages.json
//             fs.writeFile(jsonFilePath, JSON.stringify(savedImages, null, 2), (err) => {
//                 if (err) {
//                     return res.status(500).json({ status: 'error', message: 'Could not save image data' });
//                 }
//                 res.json({ status: 'success', message: 'Image saved successfully' });
//             });
//         });
//     });
// });

// New endpoint for saving images and attributes
app.post('/save_image', (req, res) => {
        console.log('Request body size (bytes):', Buffer.byteLength(JSON.stringify(req.body)));
    const imageData = req.body;

    // Path to save the image file
    const fileName = `${Date.now()}.jpg`;
    const imagePath = path.join(__dirname, 'images', fileName);

    console.log('__dirname:', __dirname);


    // Get the base64 string from the image data
    const base64Image = imageData.src.split(',')[1];

    // Logging the Base64 image for debugging
    console.log('Base64 image:', base64Image);
    
    // Write the saved image to the filesystem
    fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Error saving image file:', err); // Log the error if saving fails
            return res.status(500).json({ status: 'error', message: 'Could not save the image file' });
        }

        // Prepare the data for saving in savedImages.json
        const dataToSave = {
            src: `/images/${fileName}`, // Store the relative path for public access
            attributes: imageData.attributes
        };

        // Read and parse savedImages.json
        const jsonFilePath = path.join(__dirname, 'savedImages.json');

        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            let savedImages = [];
            if (!err && data) {
                savedImages = JSON.parse(data); 
            }

            savedImages.push(dataToSave); 

            // Write back to the savedImages.json
            fs.writeFile(jsonFilePath, JSON.stringify(savedImages, null, 2), (err) => {
                if (err) {
                    console.error('Error saving image data:', err); // Log the error if saving fails
                    return res.status(500).json({ status: 'error', message: 'Could not save image data' });
                }
                res.json({ status: 'success', message: 'Image saved successfully' });
            });
        });
    });
});

// Endpoint for retrieving saved images
app.get('/get_saved_images', (req, res) => {
    const filePath = path.join(__dirname, 'savedImages.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not read saved images data' });
        }

        const savedImages = JSON.parse(data); // Parse and return the saved images
        res.json(savedImages);
    });
});

// Start the server only after checking if the savedImages.json file exists
const initializeSavedImages = () => {
    const initialData = [];
    const filePath = path.join(__dirname, 'savedImages.json');

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
    }
};

// Call the initialization function at the start of the server
initializeSavedImages();

// Endpoint to save image temporarily to imagesTemp
app.post('/save_temp_image', (req, res) => {
    const { src } = req.body; // Get Base64 image data

    // Define path for temporary image
    const tempFileName = `${Date.now()}_temp.jpg`;
    const tempImagePath = path.join(__dirname, 'imagesTemp', tempFileName);
    
    // Get the base64 string from the image data
    const base64Image = src.split(',')[1];

    // Write the saved image to the filesystem
    fs.writeFile(tempImagePath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
            console.error('Error saving temp image:', err);
            return res.status(500).json({ status: 'error', message: 'Could not save temporary image' });
        }
        // Return the filename for later deletion
        res.json({ status: 'success', message: 'Temporary image saved', filename: tempFileName });
    });
});

// Endpoint to delete the temporary image
app.post('/delete_temp_image', (req, res) => {
    const { filename } = req.body; // Get the filename

    // Define the path to the temp image to delete
    const tempImagePath = path.join(__dirname, 'imagesTemp', filename);

    fs.unlink(tempImagePath, (err) => {
        if (err) {
            console.error('Error deleting temp image:', err);
            return res.status(500).json({ status: 'error', message: 'Could not delete temporary image' });
        }
        res.json({ status: 'success', message: 'Temporary image deleted' });
    });
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

// Endpoint for deleting an image
app.post('/delete_image', (req, res) => {
    const imageToDelete = req.body;

    const filePath = path.join(__dirname, 'savedImages.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Could not read saved images data' });
        }

        let savedImages = JSON.parse(data);
        savedImages = savedImages.filter(img => img.src !== imageToDelete.src); // Remove the image based on its src

        fs.writeFile(filePath, JSON.stringify(savedImages, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Could not save updated images data' });
            }
            res.json({ status: 'success', message: 'Image deleted successfully' });
        });
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
