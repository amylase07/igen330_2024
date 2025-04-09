

// script.js

// DOM Elements
const weatherDiv = document.getElementById('weather');
const datetimeDiv = document.getElementById('datetime');
const carousel = document.getElementById('carousel');
const carouselImage = document.getElementById('carouselImage');
const buttonsDiv = document.getElementById('buttons');
const createOutfitButton = document.getElementById('create-outfit-button');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

// Weather API Key
const API_KEY = '8a8e5365dcb47dad3771724e957823b5';

// Images array for outfits that are hardcoded
const images = [
    'imageRepo/tempImage1.jpg',
    'imageRepo/tempImage2.jpg',
    'imageRepo/tempImage3.jpg',
    'imageRepo/tempImage4.jpg',
    'imageRepo/tempImage6.jpg'
];

let currentIndex = 0;
let selectedOccasionValue = null;
let selectedGenderValue = null;
let attributesArray = []; // To hold the attributes for each image

// Function to fetch and display the current weather
async function getWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Vancouver,CA&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;
        weatherDiv.innerText = `Current Weather in Vancouver: ${temperature}°C, ${weatherDescription}`;
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// Function to display the current date and time in Vancouver timezone
function displayDateTime() {
    const options = { timeZone: 'America/Vancouver', year: 'numeric', weekday: 'long', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const now = new Date();
    datetimeDiv.innerText = `Current Date and Time: ${now.toLocaleString('en-US', options)}`;
}

// Function to create outfits based on selected occasion
// Function to create outfits based on selected occasion
async function createOutfits() {
    if (!selectedOccasionValue || !selectedGenderValue) {
        alert("Please select both occasion and gender.");
        return;
    }

    carousel.style.display = 'block';
    currentIndex = 0;

    try {
        console.log("Sending request to /create_outfits with:", {
            occasion: selectedOccasionValue,
            gender: selectedGenderValue
        });

        const response = await fetch('http://localhost:3000/create_outfits', {  // Fixed the double slash
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                occasion: selectedOccasionValue,
                gender: selectedGenderValue,
                weather: weatherDiv.innerText // optional
            })
        });

        console.log("Raw response from backend:", response);

        const result = await response.json();

        console.log("Parsed JSON result from backend:", result);

        if (response.ok && result.image && result.text) {
            console.log("✅ recommend_outfits output received:");
            console.log("Image path:", result.image);
            console.log("Outfit description:", result.text);

            images.length = 0;
            images.push(result.image);

            attributesArray.length = 0;
            attributesArray.push({
                description: result.text
            });

            // Update the carousel and handle image load errors
            carouselImage.src = result.image;
            carouselImage.onerror = () => {
                console.error("Failed to load image:", result.image);
                alert("Failed to load the outfit image. Please check if the image exists in the imageRepo directory.");
            };
            carouselImage.onload = () => {
                console.log("Image loaded successfully:", result.image);
            };

            buttonsDiv.innerHTML = '';
            const button = document.createElement('button');
            button.innerText = 'Save';
            button.onclick = async () => {
                try {
                    const saveResp = await fetch('http://localhost:3000/save_outfit', {  // Updated to port 3000
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image: result.image,
                            attributes: { description: result.text }
                        })
                    });

                    alert(saveResp.ok ? 'Successfully saved outfit' : 'Failed to save outfit');
                } catch (saveErr) {
                    console.error('Error saving outfit:', saveErr);
                    alert('An error occurred while saving the outfit.');
                }
            };
            buttonsDiv.appendChild(button);

            displayAttributes();
            updateArrowState();
        } else {
            console.warn("❌ Unexpected backend response format:", result);
            alert('Failed to generate outfit.');
        }
    } catch (error) {
        console.error('🚨 Error generating outfits:', error);
        alert('An error occurred while generating outfits.');
    }
}

// Function to update the carousel image
function updateCarousel() {
    carouselImage.src = images[currentIndex];
    console.log("Current index before update:", currentIndex);
    displayAttributes(); // Show attributes of the current image
    updateArrowState(); // Update button states whenever the image changes.
}

// Functions for carousel navigation
function nextImage() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateCarousel();
    }
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
}

// Function to update arrow state based on currentIndex
function updateArrowState() {
    leftArrow.disabled = currentIndex === 0;
    rightArrow.disabled = currentIndex === images.length - 1;
    leftArrow.style.opacity = leftArrow.disabled ? 0.5 : 1;
    rightArrow.style.opacity = rightArrow.disabled ? 0.5 : 1;
}

// Function to check if an occasion is selected
function checkSelection(event) {
    console.log("Selected value:", event.target.value); // Log the selected value
    
    //Saves the values selected for later. The initializations are near the beginning
    selectedOccasionValue = document.querySelector('input[name="occasion"]:checked')?.value || null;
    selectedGenderValue = document.querySelector('input[name="gender"]:checked')?.value || null;

    // checks if buttons are checked and reenables the create outfit button if they're both on
    const selectedOccasion = document.querySelector('input[name="occasion"]:checked');
    const selectedGender = document.querySelector('input[name="gender"]:checked');

    createOutfitButton.disabled = !(selectedOccasion && selectedGender);
    /*if (currentlySelected === selectedOccasion) {
        selectedOccasion.checked = false;
        currentlySelected = null; // Reset the currently selected.
    } else {
        currentlySelected = selectedOccasion;
    }

    if (currentlySelected2 === selectedGender) {
        selectedGender.checked = false;
        currentlySelected2 = null; // Reset the currently selected.
    } else {
        currentlySelected2 = selectedGender; 
    }*/

    // Verify if an option is selected to enable/disable the button.
    //createOutfitButton.disabled = currentlySelected === null;
}

// function displayAttributes() {
//     const attributes = attributesArray[currentIndex];
//     const attributesBox = document.getElementById('attributes-box');
//     attributesBox.innerHTML = `
//         <div style="border: 1px solid #ccc; padding: 10px; position: relative;">
//             <strong>Attributes:</strong><br>
//             <div>gender: <span>${attributes.gender}</span></div>
//             <div>subcategory: <span>${attributes.subcategory}</span></div>
//             <div>articleType: <span>${attributes.articleType}</span></div>
//             <div>baseColour: <span>${attributes.baseColour}</span></div>
//             <div>season: <span>${attributes.season}</span></div>
//             <div>usage: <span>${attributes.usage}</span></div>
//         </div>
//     `;
// }

function displayAttributes() {
    const attributes = attributesArray[currentIndex];
    const attributesBox = document.getElementById('attributes-box');

    attributesBox.innerHTML = `
        <div style="border: 1px solid #ccc; padding: 10px; position: relative;">
            <strong>Recommended Outfit Description:</strong><br>
            <p>${attributes.description}</p>
        </div>
    `;
}


// Function to switch to edit mode
function editAttributes() {
    document.getElementById('edit-attrib').style.display = 'none';
    document.getElementById('save-attrib').style.display = 'block';

    const selects = document.querySelectorAll('.attribute-select');
    selects.forEach(select => {
        select.style.display = 'block';
    });

    const spans = document.querySelectorAll('.attribute-span');
    spans.forEach(span => {
        span.style.display = 'none';
    });
}

// Function to save changes
function saveAttributes() {
    const spans = document.querySelectorAll('.attribute-span');
    const selects = document.querySelectorAll('.attribute-select');

    spans.forEach((span, index) => {
        const selectedValue = selects[index].value;
        span.textContent = selectedValue; // Update displayed attribute
        span.style.display = 'inline'; // Show updated value
        selects[index].style.display = 'none'; // Hide dropdown
    });

    document.getElementById('edit-attrib').style.display = 'block';
    document.getElementById('save-attrib').style.display = 'none';

    // Save the updated attributes in attributesArray for persistence
    const updatedAttributes = {
        gender: spans[0].textContent,
        subcategory: spans[1].textContent,
        articleType: spans[2].textContent,
        baseColour: spans[3].textContent,
        season: spans[4].textContent,
        usage: spans[5].textContent
    };

    attributesArray[currentIndex] = updatedAttributes; // Update the edited attributes in the array
}

// Initial function calls
getWeather();
displayDateTime();
setInterval(displayDateTime, 1000); // Update time every second.

// Add event listeners to each radio button for custom checking.
document.querySelectorAll('input[name="occasion"]').forEach(radio => {
    radio.addEventListener('click', checkSelection);
});
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('click', checkSelection);
});