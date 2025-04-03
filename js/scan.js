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

//         setTimeout(captureImage, 5000);
//     } catch (error) {
//         console.error('Error accessing camera:', error);
//         alert('Unable to access camera. Please allow camera permissions.');
//     }
// }

// function captureImage() {
//     const canvas = document.createElement('canvas');
//     const video = document.querySelector('video');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     document.getElementById('scanned-image').src = canvas.toDataURL('image/jpeg');

//     const imgDataUrl = canvas.toDataURL('image/jpeg');
//     document.getElementById('scanned-image').style.display = 'block';
//     document.getElementById('image-actions').style.display = 'block';

//     // Use a shared function to generate attributes
//     const attributes = generateRandomAttributes(); 
//     displayEditableAttributes(attributes); 

//     stopCamera();
// }

// function stopCamera() {
//     if (videoStream) {
//         videoStream.getTracks().forEach(track => track.stop());
//         videoStream = null;
//     }
//     document.getElementById('camera-status').innerHTML = 'Camera Off';
//     document.getElementById('camera-feed-container').innerHTML = '';
// }

// // function keepImage() {
// //     const imgSrc = document.getElementById('scanned-image').src;
// //     const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
// //     const attributes = extractAttributes(); // Extract current attributes from the display

// //     // Debugging log to check what attributes are being saved
// //     console.log("Attributes to save:", attributes);

// //     savedImages.push({ src: imgSrc, attributes });
// //     localStorage.setItem('savedImages', JSON.stringify(savedImages));
    
// //     alert('Image saved! You can view it on the Saved Images page.');
// //     resetScanPage();
// // }

// async function keepImage() {
//     const imgSrc = document.getElementById('scanned-image').src;
//     const attributes = extractAttributes(); // Extract current attributes from the display

//     // Debugging log to check what attributes are being saved
//     console.log("Attributes to save:", attributes);

//     const data = {
//         src: imgSrc, // Base64 image data
//         attributes: attributes
//     };

//     try {
//         const response = await fetch('/save_outfit', {
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

// function discardImage() {
//     resetScanPage();
// }

// function resetScanPage() {
//     document.getElementById('scanned-image').style.display = 'none';
//     document.getElementById('image-actions').style.display = 'none';
//     document.getElementById('camera-status').innerHTML = 'Camera Off';
//     document.getElementById('attributes-box').style.display = 'none';
// }

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

        setTimeout(captureImage, 5000);
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please allow camera permissions.');
    }
}

function captureImage() {
    const canvas = document.createElement('canvas');
    const video = document.querySelector('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    document.getElementById('scanned-image').src = canvas.toDataURL('image/jpeg');

    const imgDataUrl = canvas.toDataURL('image/jpeg');
    document.getElementById('scanned-image').style.display = 'block';
    document.getElementById('image-actions').style.display = 'block';

    // Use a shared function to generate attributes
    const attributes = generateRandomAttributes(); 
    displayEditableAttributes(attributes); 

    stopCamera();
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    document.getElementById('camera-status').innerHTML = 'Camera Off';
    document.getElementById('camera-feed-container').innerHTML = '';
}

// async function keepImage() {
//     const imgSrc = document.getElementById('scanned-image').src;
//     const attributes = extractAttributes(); // Extract current attributes from the display

//     // Debugging log to check what attributes are being saved
//     console.log("Attributes to save:", attributes);

//     const data = {
//         src: imgSrc, // Image data
//         attributes: attributes
//     };

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

async function keepImage() {
    const imgSrc = document.getElementById('scanned-image').src;
    const attributes = extractAttributes(); // Extract current attributes from the display

    // Debugging log to check what attributes are being saved
    console.log("Attributes to save:", attributes);

    // Prepare data for saving
    const data = {
        src: imgSrc, // Image data as Base64 string
        attributes: attributes // Include attributes
    };

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
        
        resetScanPage();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the image. Please try again.');
    }
}

function discardImage() {
    resetScanPage();
}

function resetScanPage() {
    document.getElementById('scanned-image').style.display = 'none';
    document.getElementById('image-actions').style.display = 'none';
    document.getElementById('camera-status').innerHTML = 'Camera Off';
    document.getElementById('attributes-box').style.display = 'none';
}

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