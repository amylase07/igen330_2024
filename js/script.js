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
let currentlySelected2 = null;
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
function createOutfits() {
    carousel.style.display = 'block';
    currentIndex = 0;

    // Generate random attributes for each image
    attributesArray = images.map(() => generateRandomAttributes());

    // Debugging log for outfit attributes
    console.log("Final attributes array:", attributesArray);

    updateCarousel();

    // Create a save button dynamically
    buttonsDiv.innerHTML = ''; // Clear existing buttons
    const button = document.createElement('button');
    button.innerText = 'Save';
    button.onclick = async () => {
        const currentImage = images[currentIndex]; // Path to the currently displayed image
        const currentAttributes = attributesArray[currentIndex]; // Corresponding attributes

        try {
            const response = await fetch('/save_outfit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: currentImage,
                    attributes: currentAttributes
                })
            });

            if (response.ok) {
                alert('Successfully saved outfit');
            } else {
                alert('Failed to save outfit');
            }
        } catch (error) {
            console.error('Error saving outfit:', error);
            alert('An error occurred while saving the outfit.');
        }
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
    //const selectedOccasion = event.target;
    //const selectedGender = event.target;

    console.log("occasion sleected", selectedOccasion.value); // Log the selected occasion

    // Handle selection logic.
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
            <button id="edit-attrib" onclick="editAttributes()">Edit</button>
            <button id="save-attrib" style="display:none;" onclick="saveAttributes()">Save</button>
            <strong>Attributes:</strong><br>
            <div>Gender: <span class="attribute-span">${attributes.gender}</span>
                <select class="attribute-select" style="display:none;">${attributesData.genders.map(g => `<option value="${g}" ${attributes.gender === g ? 'selected' : ''}>${g}</option>`).join('')}</select>
            </div>
            <div>Subcategory: <span class="attribute-span">${attributes.subcategory}</span>
                <select class="attribute-select" style="display:none;">${attributesData.subcategories.map(s => `<option value="${s}" ${attributes.subcategory === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
            </div>
            <div>Article Type: <span class="attribute-span">${attributes.articleType}</span>
                <select class="attribute-select" style="display:none;">${attributesData.articleTypes.map(a => `<option value="${a}" ${attributes.articleType === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
            </div>
            <div>Base Colour: <span class="attribute-span">${attributes.baseColour}</span>
                <select class="attribute-select" style="display:none;">${attributesData.baseColours.map(b => `<option value="${b}" ${attributes.baseColour === b ? 'selected' : ''}>${b}</option>`).join('')}</select>
            </div>
            <div>Season: <span class="attribute-span">${attributes.season}</span>
                <select class="attribute-select" style="display:none;">${attributesData.seasons.map(se => `<option value="${se}" ${attributes.season === se ? 'selected' : ''}>${se}</option>`).join('')}</select>
            </div>
            <div>Usage: <span class="attribute-span">${attributes.usage}</span>
                <select class="attribute-select" style="display:none;">${attributesData.usages.map(u => `<option value="${u}" ${attributes.usage === u ? 'selected' : ''}>${u}</option>`).join('')}</select>
            </div>
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