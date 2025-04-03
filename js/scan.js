// let videoStream;

// async function startScan() {
//     const constraints = { video: true };
//     try {
//         videoStream = await navigator.mediaDevices.getUserMedia(constraints);
//         const videoElement = document.createElement('video');
//         videoElement.srcObject = videoStream;
//         videoElement.play();

//         document.getElementById('camera-feed-container').appendChild(videoElement);
//         document.getElementById('camera-status').innerHTML = 'Camera On';
        
//         const cameraIndicator = document.createElement('div');
//         cameraIndicator.style.width = '20px';
//         cameraIndicator.style.height = '20px';
//         cameraIndicator.style.borderRadius = '50%';
//         cameraIndicator.style.backgroundColor = 'red';
//         document.getElementById('camera-status').appendChild(cameraIndicator);

//         // Delay for capturing image
//         setTimeout(captureImage, 5000);
//     } catch (error) {
//         console.error('Error accessing camera:', error);
//         alert('Unable to access camera. Please allow camera permissions.');
//     }
// }

// async function captureImage() {
//     const canvas = document.createElement('canvas');
//     const video = document.querySelector('video');
//     canvas.width = video.videoWidth; 
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const imgDataUrl = canvas.toDataURL('image/jpeg');

//     // Stop the camera and hide the video
//     stopCamera();

//     // Display the scanned image
//     document.getElementById('scanned-image').src = imgDataUrl; 
//     document.getElementById('scanned-image').style.display = 'block';
//     document.getElementById('image-actions').style.display = 'block';

//     // Save image to imagesTemp folder
//     await saveImageToTemp(imgDataUrl);

//     // Wait for 5 seconds before showing attributes
//     setTimeout(() => {
//         const attributes = generateRandomAttributes(); 
//         displayEditableAttributes(attributes);
//     }, 5000);
// }

// // Function to save the captured image to the imagesTemp folder
// async function saveImageToTemp(imgDataUrl) {
//     const response = await fetch('/save_temp_image', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ src: imgDataUrl })
//     });

//     if (!response.ok) {
//         console.error('Failed to save image to temp:', response);
//     }
// }

// // Function to keep the image and save it permanently
// async function keepImage() {
//     const imgSrc = document.getElementById('scanned-image').src;
//     const attributes = extractAttributes(); // Extract attributes

//     const data = {
//         src: imgSrc, // Image data for the real save
//         attributes: attributes // Include attributes
//     };

//     // Get the temp file name for deletion
//     const tempFileName = imgSrc.split(',')[0].split('/')[1].split(';')[0]; // Extract MIME type
//     const base64HeaderLength = imgSrc.indexOf(',') + 1; // Find the start of the Base64 part
//     const actualTempFileName = `${Date.now()}_temp.jpg`;  // Construct the expected temp file name

//     // Delete temporary image before moving to images folder
//     await fetch('/delete_temp_image', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ filename: actualTempFileName }) // Send the actual temp filename
//     });

//     // Save the image permanently
//     try {
//         const response = await fetch('/save_image', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         if (result.status === 'success') {
//             alert('Image saved! You can view it on the Saved Images page.');
//         } else {
//             alert('Error saving image: ' + result.message);
//         }

//         resetScanPage();
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while saving the image. Please try again.');
//     }
// }

// // Function to discard the image
// async function discardImage() {
//     const imgSrc = document.getElementById('scanned-image').src;

//     // Get the temp file name for deletion
//     const actualTempFileName = `${Date.now()}_temp.jpg`;  // Construct the expected temp file name

//     // Delete the temporary image
//     await fetch('/delete_temp_image', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ filename: actualTempFileName }) // Send the filename
//     });

//     // Reset the scan page
//     resetScanPage();
// }

// // Function to stop the camera
// function stopCamera() {
//     if (videoStream) {
//         videoStream.getTracks().forEach(track => track.stop());
//         videoStream = null;
//     }
//     document.getElementById('camera-feed-container').innerHTML = ''; // Clear the video container
//     document.getElementById('camera-status').innerHTML = 'Camera Off';
// }

// function resetScanPage() {
//     document.getElementById('scanned-image').style.display = 'none';
//     document.getElementById('image-actions').style.display = 'none';
//     document.getElementById('attributes-box').style.display = 'none';
// }

// // Function to extract attributes
// function extractAttributes() {
//     const attributesBox = document.getElementById('attributes-box');
//     return {
//         gender: attributesBox.querySelector('.gender-select')?.value || 'N/A',
//         subcategory: attributesBox.querySelector('.subcategory-select')?.value || 'N/A',
//         articleType: attributesBox.querySelector('.articleType-select')?.value || 'N/A',
//         baseColour: attributesBox.querySelector('.baseColour-select')?.value || 'N/A',
//         season: attributesBox.querySelector('.season-select')?.value || 'N/A',
//         usage: attributesBox.querySelector('.usage-select')?.value || 'N/A'
//     };
// }

// // Function to display editable attributes
// function displayEditableAttributes(attributes) {
//     const attributesBox = document.getElementById('attributes-box');
//     attributesBox.innerHTML = `
//         <div style="border: 1px solid #ccc; padding: 10px; position: relative; margin-top: 20px;">
//             <button id="edit-attrib" onclick="editAttributes()">Edit</button>
//             <button id="save-attrib" style="display:none;" onclick="saveAttributes()">Save</button>
//             <strong>Attributes:</strong>
//             <table style="width: 100%; margin-top: 10px;">
//                 <tr>
//                     <th style="text-align: left;">Attribute</th>
//                     <th style="text-align: left;">Value</th>
//                 </tr>
//                 <tr>
//                     <td>Gender</td>
//                     <td>
//                         <span class="gender-select-span">${attributes.gender}</span>
//                         <select class="gender-select" style="display:none;">
//                             ${attributesData.genders.map(g => `<option value="${g}">${g}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Subcategory</td>
//                     <td>
//                         <span class="subcategory-select-span">${attributes.subcategory}</span>
//                         <select class="subcategory-select" style="display:none;">
//                             ${attributesData.subcategories.map(s => `<option value="${s}">${s}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Article Type</td>
//                     <td>
//                         <span class="articleType-select-span">${attributes.articleType}</span>
//                         <select class="articleType-select" style="display:none;">
//                             ${attributesData.articleTypes.map(a => `<option value="${a}">${a}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Base Colour</td>
//                     <td>
//                         <span class="baseColour-select-span">${attributes.baseColour}</span>
//                         <select class="baseColour-select" style="display:none;">
//                             ${attributesData.baseColours.map(b => `<option value="${b}">${b}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Season</td>
//                     <td>
//                         <span class="season-select-span">${attributes.season}</span>
//                         <select class="season-select" style="display:none;">
//                             ${attributesData.seasons.map(se => `<option value="${se}">${se}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Usage</td>
//                     <td>
//                         <span class="usage-select-span">${attributes.usage}</span>
//                         <select class="usage-select" style="display:none;">
//                             ${attributesData.usages.map(u => `<option value="${u}">${u}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//             </table>
//         </div>
//     `;
//     attributesBox.style.display = 'block';
// }

// function editAttributes() {
//     document.getElementById('edit-attrib').style.display = 'none';
//     document.getElementById('save-attrib').style.display = 'block';

//     const selects = document.querySelectorAll('#attributes-box select');
//     selects.forEach(select => {
//         select.style.display = 'block';
//     });

//     const spans = document.querySelectorAll('#attributes-box span');
//     spans.forEach(span => {
//         span.style.display = 'none';
//     });
// }

// function saveAttributes() {
//     const selects = document.querySelectorAll('#attributes-box select');
//     selects.forEach(select => {
//         const selectedValue = select.value;
//         const span = select.previousElementSibling;
//         span.textContent = selectedValue; // Update displayed attribute
//         span.style.display = 'inline'; // Show updated value
//         select.style.display = 'none'; // Hide dropdown
//     });

//     document.getElementById('edit-attrib').style.display = 'block';
//     document.getElementById('save-attrib').style.display = 'none';
// }




// let videoStream;

// async function startScan() {
//     const constraints = { video: true };
//     try {
//         videoStream = await navigator.mediaDevices.getUserMedia(constraints);
//         const videoElement = document.createElement('video');
//         videoElement.srcObject = videoStream;
//         videoElement.play();

//         document.getElementById('camera-feed-container').appendChild(videoElement);
//         document.getElementById('camera-status').innerHTML = 'Camera On';
        
//         const cameraIndicator = document.createElement('div');
//         cameraIndicator.style.width = '20px';
//         cameraIndicator.style.height = '20px';
//         cameraIndicator.style.borderRadius = '50%';
//         cameraIndicator.style.backgroundColor = 'red';
//         document.getElementById('camera-status').appendChild(cameraIndicator);

//         // Delay for capturing image
//         setTimeout(captureImage, 5000);
//     } catch (error) {
//         console.error('Error accessing camera:', error);
//         alert('Unable to access camera. Please allow camera permissions.');
//     }
// }

// async function captureImage() {
//     const canvas = document.createElement('canvas');
//     const video = document.querySelector('video');
//     canvas.width = video.videoWidth; 
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const imgDataUrl = canvas.toDataURL('image/jpeg');

//     // Stop the camera and hide the video
//     stopCamera();

//     // Display the scanned image
//     document.getElementById('scanned-image').src = imgDataUrl; 
//     document.getElementById('scanned-image').style.display = 'block';
//     document.getElementById('image-actions').style.display = 'block';

//     // Save image to imagesTemp folder
//     await saveImageToTemp(imgDataUrl);

//     // Wait for 5 seconds before showing attributes
//     setTimeout(() => {
//         const attributes = generateRandomAttributes(); 
//         displayEditableAttributes(attributes);
//     }, 5000);
// }

// // Function to save the captured image to the imagesTemp folder
// async function saveImageToTemp(imgDataUrl) {
//     const response = await fetch('/save_temp_image', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ src: imgDataUrl })
//     });

//     if (!response.ok) {
//         console.error('Failed to save image to temp:', response);
//     }
// }

// // Function to keep the image and save it permanently
// async function keepImage() {
//     const imgSrc = document.getElementById('scanned-image').src;
//     const attributes = extractAttributes(); // Extract attributes

//     const data = {
//         src: imgSrc, // Image data for the real save
//         attributes: attributes // Include attributes
//     };

//     // Delete the temporary image on the server
//     await deleteTempImage();

//     // Save the image permanently
//     try {
//         const response = await fetch('/save_image', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         if (result.status === 'success') {
//             alert('Image saved! You can view it on the Saved Images page.');
//         } else {
//             alert('Error saving image: ' + result.message);
//         }

//         resetScanPage();
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while saving the image. Please try again.');
//     }
// }

// // Function to discard the image
// async function discardImage() {
//     // Delete the temporary image on the server
//     await deleteTempImage();

//     // Reset the scan page
//     resetScanPage();
// }

// // Function to handle deletion of temporary image
// async function deleteTempImage() {
//     const actualTempFileName = `${Date.now()}_temp.jpg`; // Construct the expected temp file name

//     // Delete the temporary image
//     await fetch('/delete_temp_image', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ filename: actualTempFileName }) // Send the filename
//     });
// }

// // Function to stop the camera
// function stopCamera() {
//     if (videoStream) {
//         videoStream.getTracks().forEach(track => track.stop());
//         videoStream = null;
//     }
//     document.getElementById('camera-feed-container').innerHTML = ''; // Clear the video container
//     document.getElementById('camera-status').innerHTML = 'Camera Off';
// }

// function resetScanPage() {
//     document.getElementById('scanned-image').style.display = 'none';
//     document.getElementById('image-actions').style.display = 'none';
//     document.getElementById('attributes-box').style.display = 'none';
// }

// // Function to extract attributes
// function extractAttributes() {
//     const attributesBox = document.getElementById('attributes-box');
//     return {
//         gender: attributesBox.querySelector('.gender-select')?.value || 'N/A',
//         subcategory: attributesBox.querySelector('.subcategory-select')?.value || 'N/A',
//         articleType: attributesBox.querySelector('.articleType-select')?.value || 'N/A',
//         baseColour: attributesBox.querySelector('.baseColour-select')?.value || 'N/A',
//         season: attributesBox.querySelector('.season-select')?.value || 'N/A',
//         usage: attributesBox.querySelector('.usage-select')?.value || 'N/A'
//     };
// }

// // Function to display editable attributes
// function displayEditableAttributes(attributes) {
//     const attributesBox = document.getElementById('attributes-box');
//     attributesBox.innerHTML = `
//         <div style="border: 1px solid #ccc; padding: 10px; position: relative; margin-top: 20px;">
//             <button id="edit-attrib" onclick="editAttributes()">Edit</button>
//             <button id="save-attrib" style="display:none;" onclick="saveAttributes()">Save</button>
//             <strong>Attributes:</strong>
//             <table style="width: 100%; margin-top: 10px;">
//                 <tr>
//                     <th style="text-align: left;">Attribute</th>
//                     <th style="text-align: left;">Value</th>
//                 </tr>
//                 <tr>
//                     <td>Gender</td>
//                     <td>
//                         <span class="gender-select-span">${attributes.gender}</span>
//                         <select class="gender-select" style="display:none;">
//                             ${attributesData.genders.map(g => `<option value="${g}">${g}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Subcategory</td>
//                     <td>
//                         <span class="subcategory-select-span">${attributes.subcategory}</span>
//                         <select class="subcategory-select" style="display:none;">
//                             ${attributesData.subcategories.map(s => `<option value="${s}">${s}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Article Type</td>
//                     <td>
//                         <span class="articleType-select-span">${attributes.articleType}</span>
//                         <select class="articleType-select" style="display:none;">
//                             ${attributesData.articleTypes.map(a => `<option value="${a}">${a}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Base Colour</td>
//                     <td>
//                         <span class="baseColour-select-span">${attributes.baseColour}</span>
//                         <select class="baseColour-select" style="display:none;">
//                             ${attributesData.baseColours.map(b => `<option value="${b}">${b}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Season</td>
//                     <td>
//                         <span class="season-select-span">${attributes.season}</span>
//                         <select class="season-select" style="display:none;">
//                             ${attributesData.seasons.map(se => `<option value="${se}">${se}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Usage</td>
//                     <td>
//                         <span class="usage-select-span">${attributes.usage}</span>
//                         <select class="usage-select" style="display:none;">
//                             ${attributesData.usages.map(u => `<option value="${u}">${u}</option>`).join('')}
//                         </select>
//                     </td>
//                 </tr>
//             </table>
//         </div>
//     `;
//     attributesBox.style.display = 'block';
// }

// function editAttributes() {
//     document.getElementById('edit-attrib').style.display = 'none';
//     document.getElementById('save-attrib').style.display = 'block';

//     const selects = document.querySelectorAll('#attributes-box select');
//     selects.forEach(select => {
//         select.style.display = 'block';
//     });

//     const spans = document.querySelectorAll('#attributes-box span');
//     spans.forEach(span => {
//         span.style.display = 'none';
//     });
// }

// function saveAttributes() {
//     const selects = document.querySelectorAll('#attributes-box select');
//     selects.forEach(select => {
//         const selectedValue = select.value;
//         const span = select.previousElementSibling;
//         span.textContent = selectedValue; // Update displayed attribute
//         span.style.display = 'inline'; // Show updated value
//         select.style.display = 'none'; // Hide dropdown
//     });

//     document.getElementById('edit-attrib').style.display = 'block';
//     document.getElementById('save-attrib').style.display = 'none';
// }

let videoStream;
let tempFileName; // Variable to hold the temporary file name

async function startScan() {
    const constraints = { video: true };
    try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.createElement('video');
        videoElement.srcObject = videoStream;
        videoElement.play();

        document.getElementById('camera-feed-container').appendChild(videoElement);
        document.getElementById('camera-status').innerHTML = 'Camera On';
        
        const cameraIndicator = document.createElement('div');
        cameraIndicator.style.width = '20px';
        cameraIndicator.style.height = '20px';
        cameraIndicator.style.borderRadius = '50%';
        cameraIndicator.style.backgroundColor = 'red';
        document.getElementById('camera-status').appendChild(cameraIndicator);

        // Delay for capturing image
        setTimeout(captureImage, 5000);
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please allow camera permissions.');
    }
}

async function captureImage() {
    const canvas = document.createElement('canvas');
    const video = document.querySelector('video');
    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgDataUrl = canvas.toDataURL('image/jpeg');

    // Stop the camera and hide the video
    stopCamera();

    // Display the scanned image
    document.getElementById('scanned-image').src = imgDataUrl; 
    document.getElementById('scanned-image').style.display = 'block';
    document.getElementById('image-actions').style.display = 'block';

    // Save image to imagesTemp folder
    await saveImageToTemp(imgDataUrl);

    // Wait for 5 seconds before showing attributes
    setTimeout(() => {
        const attributes = generateRandomAttributes();
        displayEditableAttributes(attributes);
    }, 5000);
}

// Function to save the captured image to the imagesTemp folder
async function saveImageToTemp(imgDataUrl) {
    const response = await fetch('/save_temp_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ src: imgDataUrl })
    });

    if (response.ok) {
        const result = await response.json();
        tempFileName = result.filename; // Store the filename returned from the server
    } else {
        console.error('Failed to save image to temp:', response);
    }
}

// Function to keep the image and save it permanently
async function keepImage() {
    const imgSrc = document.getElementById('scanned-image').src;
    const attributes = extractAttributes(); // Extract attributes

    const data = {
        src: imgSrc, // Image data for the real save
        attributes: attributes // Include attributes
    };

    // Save the image permanently
    try {
        const response = await fetch('/save_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Image saved! You can view it on the Saved Images page.');
        } else {
            alert('Error saving image: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the image. Please try again.');
    }

    // Delete the temporary image
    await deleteTempImage();
    resetScanPage();
}

// Function to discard the image
async function discardImage() {
    // Delete the temporary image
    await deleteTempImage();

    // Reset the scan page
    resetScanPage();
}

// Function to handle deletion of temporary image
async function deleteTempImage() {
    // Delete the temporary image using the stored filename
    if (tempFileName) {
        await fetch('/delete_temp_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: tempFileName }) // Send the filename
        }).catch(error => {
            console.error('Failed to delete the temporary image:', error);
        });
    } else {
        console.warn('No temporary file name available for deletion.');
    }
}

// Function to stop the camera
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    document.getElementById('camera-feed-container').innerHTML = ''; // Clear the video container
    document.getElementById('camera-status').innerHTML = 'Camera Off';
}

function resetScanPage() {
    document.getElementById('scanned-image').style.display = 'none';
    document.getElementById('image-actions').style.display = 'none';
    document.getElementById('attributes-box').style.display = 'none';
}

// Function to extract attributes
function extractAttributes() {
    const attributesBox = document.getElementById('attributes-box');
    return {
        gender: attributesBox.querySelector('.gender-select')?.value || 'N/A',
        subcategory: attributesBox.querySelector('.subcategory-select')?.value || 'N/A',
        articleType: attributesBox.querySelector('.articleType-select')?.value || 'N/A',
        baseColour: attributesBox.querySelector('.baseColour-select')?.value || 'N/A',
        season: attributesBox.querySelector('.season-select')?.value || 'N/A',
        usage: attributesBox.querySelector('.usage-select')?.value || 'N/A'
    };
}

// Function to display editable attributes
function displayEditableAttributes(attributes) {
    const attributesBox = document.getElementById('attributes-box');
    attributesBox.innerHTML = `
        <div style="border: 1px solid #ccc; padding: 10px; position: relative; margin-top: 20px;">
            <button id="edit-attrib" onclick="editAttributes()">Edit</button>
            <button id="save-attrib" style="display:none;" onclick="saveAttributes()">Save</button>
            <strong>Attributes:</strong>
            <table style="width: 100%; margin-top: 10px;">
                <tr>
                    <th style="text-align: left;">Attribute</th>
                    <th style="text-align: left;">Value</th>
                </tr>
                <tr>
                    <td>Gender</td>
                    <td>
                        <span class="gender-select-span">${attributes.gender}</span>
                        <select class="gender-select" style="display:none;">
                            ${attributesData.genders.map(g => `<option value="${g}">${g}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Subcategory</td>
                    <td>
                        <span class="subcategory-select-span">${attributes.subcategory}</span>
                        <select class="subcategory-select" style="display:none;">
                            ${attributesData.subcategories.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Article Type</td>
                    <td>
                        <span class="articleType-select-span">${attributes.articleType}</span>
                        <select class="articleType-select" style="display:none;">
                            ${attributesData.articleTypes.map(a => `<option value="${a}">${a}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Base Colour</td>
                    <td>
                        <span class="baseColour-select-span">${attributes.baseColour}</span>
                        <select class="baseColour-select" style="display:none;">
                            ${attributesData.baseColours.map(b => `<option value="${b}">${b}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Season</td>
                    <td>
                        <span class="season-select-span">${attributes.season}</span>
                        <select class="season-select" style="display:none;">
                            ${attributesData.seasons.map(se => `<option value="${se}">${se}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Usage</td>
                    <td>
                        <span class="usage-select-span">${attributes.usage}</span>
                        <select class="usage-select" style="display:none;">
                            ${attributesData.usages.map(u => `<option value="${u}">${u}</option>`).join('')}
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    `;
    attributesBox.style.display = 'block';
}

function editAttributes() {
    document.getElementById('edit-attrib').style.display = 'none';
    document.getElementById('save-attrib').style.display = 'block';

    const selects = document.querySelectorAll('#attributes-box select');
    selects.forEach(select => {
        select.style.display = 'block';
    });

    const spans = document.querySelectorAll('#attributes-box span');
    spans.forEach(span => {
        span.style.display = 'none';
    });
}

function saveAttributes() {
    const selects = document.querySelectorAll('#attributes-box select');
    selects.forEach(select => {
        const selectedValue = select.value;
        const span = select.previousElementSibling;
        span.textContent = selectedValue; // Update displayed attribute
        span.style.display = 'inline'; // Show updated value
        select.style.display = 'none'; // Hide dropdown
    });

    document.getElementById('edit-attrib').style.display = 'block';
    document.getElementById('save-attrib').style.display = 'none';
}