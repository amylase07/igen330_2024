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

// Global variables to store the parsed attributes and description
let currentParsedAttributes = {};
let currentFullDescription = '';

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

    console.log('Captured image data URL:', imgDataUrl);

    // Display the scanned image
    document.getElementById('scanned-image').src = imgDataUrl;
    document.getElementById('scanned-image').style.display = 'block';
    document.getElementById('image-actions').style.display = 'block';

    console.log('Image actions displayed, sending image to backend');

    try {
        const response = await fetch('http://localhost:3000/process_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imgDataUrl })
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log('Received extracted data: text:', result.text_data);

            // Parse the text from result.text_data
            currentParsedAttributes = {}; // Reset global variable
            currentFullDescription = ''; // Reset global variable
            const lines = result.text_data.split('\n');

            lines.forEach(line => {
                const [key, value] = line.split(':').map(s => s.trim());
                if (key && value) {
                    if (['gender', 'masterCategory', 'sub', 'articleType', 'baseColour', 'season', 'usage'].includes(key)) {
                        currentParsedAttributes[key] = value.replace(/[\[\]]/g, ''); // Remove brackets
                    } else if (key === 'productDisplayName') {
                        currentFullDescription = value; // Capture description
                    }
                }
            });

            // Inject parsed attributes and description into the interface
            const attributesBox = document.getElementById('attributes-box');
            attributesBox.style.display = 'block';

            attributesBox.innerHTML = `
                <button id="edit-button">Edit</button>
                <strong>Attributes:</strong>
                <table>
                    <tr><th>Attribute</th><th>Value</th></tr>
                    <tr><td>Gender</td><td class="attribute-value" data-key="gender">${currentParsedAttributes.gender || 'N/A'}</td></tr>
                    <tr><td>Master Category</td><td class="attribute-value" data-key="masterCategory">${currentParsedAttributes.masterCategory || 'N/A'}</td></tr>
                    <tr><td>Subcategory</td><td class="attribute-value" data-key="sub">${currentParsedAttributes.sub || 'N/A'}</td></tr>
                    <tr><td>Article Type</td><td class="attribute-value" data-key="articleType">${currentParsedAttributes.articleType || 'N/A'}</td></tr>
                    <tr><td>Base Colour</td><td class="attribute-value" data-key="baseColour">${currentParsedAttributes.baseColour || 'N/A'}</td></tr>
                    <tr><td>Season</td><td class="attribute-value" data-key="season">${currentParsedAttributes.season || 'N/A'}</td></tr>
                    <tr><td>Usage</td><td class="attribute-value" data-key="usage">${currentParsedAttributes.usage || 'N/A'}</td></tr>
                </table>
                <div style="margin-top: 10px;">
                    <strong>Description:</strong>
                    <p class="description">${currentFullDescription || 'No description available'}</p>
                </div>
            `;

            // Call displayEditableAttributes to enable editing
            setTimeout(() => {
                displayEditableAttributes(currentParsedAttributes);
            }, 5000);
        } else {
            console.error('Error from backend:', result.message);
        }
    } catch (error) {
        console.error('Failed to send image:', error);
        const attributesBox = document.getElementById('attributes-box');
        attributesBox.innerHTML = `<p style="color: red;">Error processing image: ${error.message}</p>`;
        attributesBox.style.display = 'block';
    }
}

// Function to save the captured image to the imagesTemp folder
async function saveImageToTemp(imgDataUrl) {
    const response = await fetch('http://localhost:5000/save_temp_image', {
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
        src: imgSrc,
        attributes: attributes
    };

    // Save the image permanently
    try {
        const response = await fetch('http://localhost:5000/save_image', {
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
        await fetch('http://localhost:5000/delete_temp_image', {
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
    const isEditableView = attributesBox.querySelector('.gender-select-span'); // Check if editable view is active

    if (isEditableView) {
        // Extract from the displayed spans (which may have been edited)
        return {
            gender: attributesBox.querySelector('.gender-select-span')?.textContent || currentParsedAttributes.gender || 'N/A',
            masterCategory: currentParsedAttributes.masterCategory || 'N/A', // Not editable
            sub: attributesBox.querySelector('.subcategory-select-span')?.textContent || currentParsedAttributes.sub || 'N/A',
            articleType: attributesBox.querySelector('.articleType-select-span')?.textContent || currentParsedAttributes.articleType || 'N/A',
            baseColour: attributesBox.querySelector('.baseColour-select-span')?.textContent || currentParsedAttributes.baseColour || 'N/A',
            season: attributesBox.querySelector('.season-select-span')?.textContent || currentParsedAttributes.season || 'N/A',
            usage: attributesBox.querySelector('.usage-select-span')?.textContent || currentParsedAttributes.usage || 'N/A',
            productDisplayName: currentFullDescription || 'No description available'
        };
    } else {
        // Extract from the initial table view
        const attributes = {};
        const attributeElements = attributesBox.querySelectorAll('.attribute-value');
        attributeElements.forEach(element => {
            const key = element.getAttribute('data-key');
            attributes[key] = element.textContent;
        });
        attributes.productDisplayName = attributesBox.querySelector('.description')?.textContent || currentFullDescription || 'No description available';
        return attributes;
    }
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
                        <span class="gender-select-span">${attributes.gender || 'N/A'}</span>
                        <select class="gender-select" style="display:none;">
                            ${attributesData.genders.map(g => `<option value="${g}" ${g.toLowerCase() === (attributes.gender || '').toLowerCase() ? 'selected' : ''}>${g}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Subcategory</td>
                    <td>
                        <span class="subcategory-select-span">${attributes.sub || 'N/A'}</span>
                        <select class="subcategory-select" style="display:none;">
                            ${attributesData.subcategories.map(s => `<option value="${s}" ${s.toLowerCase() === (attributes.sub || '').toLowerCase() ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Article Type</td>
                    <td>
                        <span class="articleType-select-span">${attributes.articleType || 'N/A'}</span>
                        <select class="articleType-select" style="display:none;">
                            ${attributesData.articleTypes.map(a => `<option value="${a}" ${a.toLowerCase() === (attributes.articleType || '').toLowerCase() ? 'selected' : ''}>${a}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Base Colour</td>
                    <td>
                        <span class="baseColour-select-span">${attributes.baseColour || 'N/A'}</span>
                        <select class="baseColour-select" style="display:none;">
                            ${attributesData.baseColours.map(b => `<option value="${b}" ${b.toLowerCase() === (attributes.baseColour || '').toLowerCase() ? 'selected' : ''}>${b}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Season</td>
                    <td>
                        <span class="season-select-span">${attributes.season || 'N/A'}</span>
                        <select class="season-select" style="display:none;">
                            ${attributesData.seasons.map(se => `<option value="${se}" ${se.toLowerCase() === (attributes.season || '').toLowerCase() ? 'selected' : ''}>${se}</option>`).join('')}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Usage</td>
                    <td>
                        <span class="usage-select-span">${attributes.usage || 'N/A'}</span>
                        <select class="usage-select" style="display:none;">
                            ${attributesData.usages.map(u => `<option value="${u}" ${u.toLowerCase() === (attributes.usage || '').toLowerCase() ? 'selected' : ''}>${u}</option>`).join('')}
                        </select>
                    </td>
                </tr>
            </table>
            <div style="margin-top: 10px;">
                <strong>Description:</strong>
                <p>${currentFullDescription || 'No description available'}</p>
            </div>
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

    // Update the global variables with the edited values
    currentParsedAttributes = {
        gender: document.querySelector('.gender-select-span')?.textContent || 'N/A',
        masterCategory: currentParsedAttributes.masterCategory || 'N/A', // Not editable in current UI
        sub: document.querySelector('.subcategory-select-span')?.textContent || 'N/A',
        articleType: document.querySelector('.articleType-select-span')?.textContent || 'N/A',
        baseColour: document.querySelector('.baseColour-select-span')?.textContent || 'N/A',
        season: document.querySelector('.season-select-span')?.textContent || 'N/A',
        usage: document.querySelector('.usage-select-span')?.textContent || 'N/A'
    };
}