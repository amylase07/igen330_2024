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
    
//     canvas.toBlob(function(blob) {
//         const formData = new FormData();
//         formData.append('image', blob, 'captured-image.jpg');

//         fetch('http://localhost:3000/save_image', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 alert('Image successfully uploaded: ' + data.file);
//             }
//         })
//         .catch((error) => {
//             console.error('Error saving image:', error);
//         });
//     }, 'image/jpeg');

//     document.getElementById('scanned-image').src = canvas.toDataURL('image/jpeg');
//     document.getElementById('scanned-image').style.display = 'block';
//     document.getElementById('image-actions').style.display = 'block';

//     const attributes = generateRandomAttributes(); 
//     displayAttributes(attributes); 

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

// function keepImage() {
//     const imgSrc = document.getElementById('scanned-image').src;
//     const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
//     const attributes = generateRandomAttributes(); 

//     savedImages.push({ src: imgSrc, attributes });
//     localStorage.setItem('savedImages', JSON.stringify(savedImages));
    
//     alert('Image saved! You can view it on the Saved Images page.');
//     resetScanPage();
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

// function displayAttributes(attributes) {
//     const attributesBox = document.getElementById('attributes-box');
//     attributesBox.innerHTML = `
//         <strong>Attributes:</strong><br>
//         gender: ${attributes.gender}<br>
//         subcategory: ${attributes.subcategory}<br>
//         articleType: ${attributes.articleType}<br>
//         baseColour: ${attributes.baseColour}<br>
//         season: ${attributes.season}<br>
//         usage: ${attributes.usage}
//     `;
//     attributesBox.style.display = 'block';
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

function keepImage() {
    const imgSrc = document.getElementById('scanned-image').src;
    const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    const attributes = extractAttributes(); // Extract current attributes from the display

    // Debugging log to check what attributes are being saved
    console.log("Attributes to save:", attributes);

    savedImages.push({ src: imgSrc, attributes });
    localStorage.setItem('savedImages', JSON.stringify(savedImages));
    
    alert('Image saved! You can view it on the Saved Images page.');
    resetScanPage();
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
        <div style="border: 1px solid #ccc; padding: 10px; position: relative;">
            <button id="edit-attrib" onclick="editAttributes()">Edit</button>
            <button id="save-attrib" style="display:none;" onclick="saveAttributes()">Save</button>
            <strong>Attributes:</strong><br>
            <div>
                gender: 
                <span class="gender-select-span">${attributes.gender}</span>
                <select class="gender-select" style="display:none;">
                    ${attributesData.genders.map(g => `<option value="${g}">${g}</option>`).join('')}
                </select>
            </div>
            <div>
                subcategory: 
                <span class="subcategory-select-span">${attributes.subcategory}</span>
                <select class="subcategory-select" style="display:none;">
                    ${attributesData.subcategories.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </div>
            <div>
                articleType: 
                <span class="articleType-select-span">${attributes.articleType}</span>
                <select class="articleType-select" style="display:none;">
                    ${attributesData.articleTypes.map(a => `<option value="${a}">${a}</option>`).join('')}
                </select>
            </div>
            <div>
                baseColour: 
                <span class="baseColour-select-span">${attributes.baseColour}</span>
                <select class="baseColour-select" style="display:none;">
                    ${attributesData.baseColours.map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
            </div>
            <div>
                season: 
                <span class="season-select-span">${attributes.season}</span>
                <select class="season-select" style="display:none;">
                    ${attributesData.seasons.map(se => `<option value="${se}">${se}</option>`).join('')}
                </select>
            </div>
            <div>
                usage: 
                <span class="usage-select-span">${attributes.usage}</span>
                <select class="usage-select" style="display:none;">
                    ${attributesData.usages.map(u => `<option value="${u}">${u}</option>`).join('')}
                </select>
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
}