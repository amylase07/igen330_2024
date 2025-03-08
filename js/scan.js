let videoStream;

async function startScan() {
    const constraints = {
        video: true,
    };

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
    
    // Convert to Blob
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('image', blob, 'captured-image.jpg'); // Append Blob

        // Send to server
        fetch('http://localhost:3000/save_image', { // Use the URL to your server
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Handle success
            if (data.status === 'success') {
                alert('Image successfully uploaded: ' + data.file);
            }
        })
        .catch((error) => {
            console.error('Error saving image:', error);
        });
    }, 'image/jpeg');

    document.getElementById('scanned-image').src = canvas.toDataURL('image/jpeg');
    document.getElementById('scanned-image').style.display = 'block';
    document.getElementById('image-actions').style.display = 'block';

    // Stop the video stream
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
    savedImages.push(imgSrc);
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
}