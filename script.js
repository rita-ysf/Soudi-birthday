// --- JAVASCRIPT LOGIC ---

// IMPORTANT: Replace these example relative paths with the ACTUAL paths/filenames of your local images!
const imageMap = {
    // Make sure these paths match the files you save in your 'images' folder
    'guitar': './aj1.png', 
    'piano': './aj2.jpg',
    'drum': './aj3.jpg',
    'sax': './aj4.png',
    'note': './aj5.jpg',
    'mic': './aj6.png',
    'headphone': './aj7.png',
    'vinyl': './images/vinyl_record.png'
};

const cardIdentifiers = Object.keys(imageMap);
const cards = [...cardIdentifiers, ...cardIdentifiers]; // Create the 16 card array (8 pairs)

// Get DOM elements
const gameBoard = document.querySelector('.game-board');
const movesSpan = document.querySelector('.moves');
const resetButton = document.querySelector('.reset-btn');

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Creates the card HTML element.
 * @param {string} iconIdentifier - The unique ID for the card pair (e.g., 'guitar').
 * @returns {HTMLElement} The complete card element.
 */
function createCard(iconIdentifier) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.icon = iconIdentifier;

    const frontFace = document.createElement('div');
    frontFace.classList.add('card-face', 'card-front');
    
    const img = document.createElement('img');
    img.src = imageMap[iconIdentifier];
    img.alt = iconIdentifier;
    img.className = 'w-3/4 h-3/4 object-contain p-2';
    
    // Fallback in case image fails to load (shows a generic icon instead of the instrument name)
    img.onerror = function() {
        console.error(`Failed to load image: ${imageMap[iconIdentifier]}`);
        this.style.display = 'none';
        frontFace.textContent = '🎶'; // <-- Changed from instrument name to a question mark
        frontFace.style.fontSize = '2rem'; 
        frontFace.style.color = '#e53e3e'; // Make error icon red
    };

    frontFace.appendChild(img);

    const backFace = document.createElement('div');
    backFace.classList.add('card-face', 'card-back');
    backFace.textContent = '★'; // Star icon for the back

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);
    cardElement.addEventListener('click', handleCardClick);
    return cardElement;
}

/**
 * Clears the board and sets up a new game.
 */
function initializeGame() {
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    movesSpan.textContent = `Moves: ${moves}`;

    shuffle(cards);
    cards.forEach(iconIdentifier => {
        gameBoard.appendChild(createCard(iconIdentifier));
    });
}

/**
 * Handles the click event on a card, flipping it if conditions are met.
 * @param {Event} event - The click event.
 */
function handleCardClick(event) {
    const clickedCard = event.currentTarget;

    // Prevent flipping if 2 cards are already flipped, or if the card is already flipped/matched
    if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped') && !clickedCard.classList.contains('match')) {
        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            moves++;
            movesSpan.textContent = `Moves: ${moves}`;
            checkMatch();
        }
    }
}

/**
 * Checks if the two currently flipped cards form a match.
 */
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        // Match found
        card1.classList.add('match');
        card2.classList.add('match');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cards.length / 2) {
            // Game Over: All pairs matched
            setTimeout(() => {
                showWinModal(`You completed the game in ${moves} moves!`);
            }, 500);
        }
    } else {
        // No match: Flip cards back after a delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

/**
 * Displays a custom modal for the winning message.
 * @param {string} message - The win message to display.
 */
function showWinModal(message) {
    const existingModal = document.getElementById('win-modal');
    if (existingModal) existingModal.remove();

    // The modal uses Tailwind CSS classes for its look and responsiveness
    const winMessage = document.createElement('div');
    winMessage.id = 'win-modal';
    winMessage.className = 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50';
    winMessage.innerHTML = `
        <div class="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-4">
            <h2 class="text-4xl font-extrabold mb-4 text-yellow-600">🎉 Happy Birthday! 🎉</h2>
            <p class="text-xl text-gray-700 mb-6">${message}</p>
            <button onclick="window.location.reload();" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]">
                Play Again
            </button>
        </div>
    `;
    document.body.appendChild(winMessage);
}

// --- Event Listeners and Initialization ---

resetButton.addEventListener('click', initializeGame);
window.onload = initializeGame;
