// // DOM Elements
// const weatherDiv = document.getElementById('weather');
// const datetimeDiv = document.getElementById('datetime');
// const carousel = document.getElementById('carousel');
// const carouselImage = document.getElementById('carouselImage');
// const buttonsDiv = document.getElementById('buttons');
// const createOutfitButton = document.getElementById('create-outfit-button');
// const leftArrow = document.getElementById('left-arrow');
// const rightArrow = document.getElementById('right-arrow');

// // Weather API Key
// const API_KEY = '8a8e5365dcb47dad3771724e957823b5'; // api from https://home.openweathermap.org/api_keys antonio account

// // Images array for outfits
// const images = [
//     'imageRepo/tempImage1.jpg',
//     'imageRepo/tempImage2.jpg',
//     'imageRepo/tempImage3.jpg',
//     'imageRepo/tempImage4.jpg',
//     'imageRepo/tempImage5.jpg'
// ];
// let currentIndex = 0;
// let currentlySelected = null; // Variable to track the currently selected radio button

// // Function to fetch and display the current weather
// async function getWeather() {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Vancouver,CA&units=metric&appid=${API_KEY}`);
//         const data = await response.json();
//         const temperature = data.main.temp;
//         const weatherDescription = data.weather[0].description;
//         weatherDiv.innerText = `Current Weather in Vancouver: ${temperature}°C, ${weatherDescription}`;
//     } catch (error) {
//         console.error('Error fetching weather:', error);
//     }
// }

// // Function to display the current date and time in Vancouver timezone
// function displayDateTime() {
//     const options = { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false };
//     const now = new Date();
//     datetimeDiv.innerText = `Current Date and Time: ${now.toLocaleString('en-CA', options)}`;
// }

// // Function to create outfits based on selected occasion
// function createOutfits() {
//     carousel.style.display = 'block';
//     currentIndex = 0;
//     updateCarousel();

//     displayRandomAttributes(); // Display random attributes when creating outfits

//     // Create save button dynamically
//     buttonsDiv.innerHTML = ''; // Clear existing buttons
//     const button = document.createElement('button');
//     button.innerText = 'Save';
//     button.onclick = () => alert('Successfully saved outfit'); // Pop-up alert
//     buttonsDiv.appendChild(button);

//     // Update arrow states
//     updateArrowState();
// }

// function displayRandomAttributes() {
//     const attributes = generateRandomAttributes();

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
// }

// // Function to update the carousel image
// function updateCarousel() {
//     carouselImage.src = images[currentIndex];
//     updateArrowState(); // Update button states whenever the image changes
//     displayRandomAttributes(); // Update attributes whenever the image updates
// }

// // Functions for carousel navigation
// function nextImage() {
//     if (currentIndex < images.length - 1) {
//         currentIndex++;
//         updateCarousel();
//     }
// }

// function prevImage() {
//     if (currentIndex > 0) {
//         currentIndex--;
//         updateCarousel();
//     }
// }

// // Function to update arrow state based on currentIndex
// function updateArrowState() {
//     leftArrow.disabled = currentIndex === 0; // Disable left arrow at first image
//     rightArrow.disabled = currentIndex === images.length - 1; // Disable right arrow at last image

//     // Update the opacity of the arrows for visual feedback
//     leftArrow.style.opacity = leftArrow.disabled ? 0.5 : 1;
//     rightArrow.style.opacity = rightArrow.disabled ? 0.5 : 1;
// }

// // Function to check if an occasion is selected
// function checkSelection(event) {
//     const selectedOccasion = event.target; // Get the currently clicked radio

//     // Handle selection logic
//     if (currentlySelected === selectedOccasion) {
//         selectedOccasion.checked = false;
//         currentlySelected = null; // Reset the currently selected
//     } else {
//         currentlySelected = selectedOccasion; 
//     }

//     // Verify if an option is selected to enable/disable the button
//     createOutfitButton.disabled = currentlySelected === null;
// }

// // Initial function calls
// getWeather();
// displayDateTime();
// setInterval(displayDateTime, 60000); // Update time every minute

// // Add event listeners to each radio button for custom checking
// document.querySelectorAll('input[name="occasion"]').forEach(radio => {
//     radio.addEventListener('click', checkSelection);
// });



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
let currentlySelected = null;
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
    const options = { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false };
    const now = new Date();
    datetimeDiv.innerText = `Current Date and Time: ${now.toLocaleString('en-CA', options)}`;
}

// Function to create outfits based on selected occasion
function createOutfits() {
    carousel.style.display = 'block';
    currentIndex = 0;

    // Generate random attributes for each image
    attributesArray = images.map(() => generateRandomAttributes());

    // debug for outfit attributes
    console.log("Final attributes array:",attributesArray);

    updateCarousel();

    // Create save button dynamically
    buttonsDiv.innerHTML = ''; // Clear existing buttons
    const button = document.createElement('button');
    button.innerText = 'Save';
    button.onclick = () => {
        alert('Successfully saved outfit');
    };
    buttonsDiv.appendChild(button);

    // Update arrow states
    updateArrowState();
    displayAttributes(); // Show attributes of the current image
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
    const selectedOccasion = event.target;

    // Handle selection logic.
    if (currentlySelected === selectedOccasion) {
        selectedOccasion.checked = false;
        currentlySelected = null; // Reset the currently selected.
    } else {
        currentlySelected = selectedOccasion; 
    }

    // Verify if an option is selected to enable/disable the button.
    createOutfitButton.disabled = currentlySelected === null;
}

function displayAttributes() {
    const attributes = attributesArray[currentIndex];
    const attributesBox = document.getElementById('attributes-box');
    attributesBox.innerHTML = `
        <div style="border: 1px solid #ccc; padding: 10px; position: relative;">
            <strong>Attributes:</strong><br>
            <div>gender: <span>${attributes.gender}</span></div>
            <div>subcategory: <span>${attributes.subcategory}</span></div>
            <div>articleType: <span>${attributes.articleType}</span></div>
            <div>baseColour: <span>${attributes.baseColour}</span></div>
            <div>season: <span>${attributes.season}</span></div>
            <div>usage: <span>${attributes.usage}</span></div>
        </div>
    `;
}

// Initial function calls
getWeather();
displayDateTime();
setInterval(displayDateTime, 60000); // Update time every minute.

// Add event listeners to each radio button for custom checking.
document.querySelectorAll('input[name="occasion"]').forEach(radio => {
    radio.addEventListener('click', checkSelection);
});