const questionGrid = document.getElementById('question-grid');
const solutionGrid = document.getElementById('solution-grid');
const shuffleButton = document.getElementById('shuffle-btn');
const timerDisplay = document.getElementById('timer');
const moveCounterDisplay = document.getElementById('move-counter');
const congratsMessage = document.getElementById('congratulations');

const imageSrc = 'https://i.postimg.cc/bvhnVRfP/S74-lunch-box.png';
let tiles = [];
let moves = 0;
let timer = 0;
let timerInterval = null;

// Initialize the puzzle
function initPuzzle() {
  // Reset states
  tiles = [];
  moves = 0;
  timer = 0;
  moveCounterDisplay.textContent = moves;
  timerDisplay.textContent = '0:00';
  congratsMessage.classList.add('hidden');
  
  // Generate tiles
  for (let i = 0; i < 25; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.style.backgroundImage = `url(${imageSrc})`;
    tile.style.backgroundPosition = `${-(i % 5) * 50}px ${-Math.floor(i / 5) * 50}px`;

    tile.setAttribute('draggable', true);
    tile.dataset.index = i;

    // Drag-and-drop event listeners
    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragend', dragEnd);
    solutionGrid.addEventListener('dragover', allowDrop);
    solutionGrid.addEventListener('drop', dropTile);

    tiles.push(tile);
  }

  // Randomize tiles for question grid
  shuffleTiles();
  tiles.forEach(tile => questionGrid.appendChild(tile));

  // Start the timer
  startTimer();
}

// Shuffle tiles
function shuffleTiles() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
}

// Timer functionality
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Drag-and-drop handlers
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function dragEnd() {
  // Optional: Add visual feedback for drag end
}

function allowDrop(e) {
  e.preventDefault();
}

function dropTile(e) {
  e.preventDefault();
  const draggedIndex = e.dataTransfer.getData('text/plain');
  const draggedTile = tiles[draggedIndex];

  const dropTarget = e.target;

  // Check if placed in the correct slot
  if (dropTarget && dropTarget.classList.contains('tile-slot') && dropTarget.dataset.index === draggedTile.dataset.index) {
    dropTarget.appendChild(draggedTile);
    moves++;
    moveCounterDisplay.textContent = moves;
    checkCompletion();
  } else {
    // Snap back to the question grid
    questionGrid.appendChild(draggedTile);
  }
}

// Check if the puzzle is completed
function checkCompletion() {
  const solutionTiles = solutionGrid.querySelectorAll('.tile');
  if (solutionTiles.length === 25 && Array.from(solutionTiles).every((tile, index) => tile.dataset.index == index)) {
    clearInterval(timerInterval);
    congratsMessage.classList.remove('hidden');
  }
}

// Shuffle button functionality
shuffleButton.addEventListener('click', () => {
  shuffleTiles();
  tiles.forEach(tile => questionGrid.appendChild(tile));
  moves = 0;
  moveCounterDisplay.textContent = moves;
});

// Initialize the game
initPuzzle();
