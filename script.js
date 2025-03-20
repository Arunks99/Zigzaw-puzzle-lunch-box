const gridSize = 4;  // 4x4 grid
const tileSize = 70; // Size of each tile (px)
const dropTolerance = 20; // Allowed error margin when placing tiles

let correctTiles = 0;
const totalTiles = gridSize * gridSize;

const grid = document.getElementById("grid");
const tileGrid = document.getElementById("tile-grid");
const winnerText = document.getElementById("winner");
let tiles = [];

let positions = [];

// Generate tile positions
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        positions.push({ row, col });
    }
}
positions.sort(() => Math.random() - 0.5); // Shuffle positions randomly

// Create draggable tiles
for (let i = 0; i < positions.length; i++) {
    let { row, col } = positions[i];
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
    tile.dataset.correctPosition = `${row}-${col}`;
    tile.dataset.originalIndex = i; // Store original index

    tile.draggable = true;
    tile.addEventListener("dragstart", handleDragStart);
    tile.addEventListener("dragend", handleDragEnd);
    
    // Touch Events for Mobile
    tile.addEventListener("touchstart", handleTouchStart);
    tile.addEventListener("touchmove", handleTouchMove);
    tile.addEventListener("touchend", handleTouchEnd);

    tiles.push(tile);
}

// Shuffle and append tiles to question grid
tiles.sort(() => Math.random() - 0.5);
tiles.forEach(tile => tileGrid.appendChild(tile));

// Create answer grid (drop zones)
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        let dropZone = document.createElement("div");
        dropZone.classList.add("drop-zone");
        dropZone.dataset.targetPosition = `${row}-${col}`;
        
        dropZone.addEventListener("dragover", (e) => e.preventDefault());
        dropZone.addEventListener("drop", handleDrop);

        grid.appendChild(dropZone);
    }
}

// ======================
// 🔹 Drag & Drop Handlers (Mouse)
// ======================
function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.correctPosition);
    e.target.classList.add("dragging");
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging");
}

// ======================
// 🔹 Touch Handlers (Mobile)
// ======================
let activeTile = null;

function handleTouchStart(e) {
    let tile = e.target;
    let touch = e.touches[0];

    activeTile = tile;

    // Calculate offset between touch point and tile position
    let rect = tile.getBoundingClientRect();
    tile.dataset.offsetX = 2;
    tile.dataset.offsetY = 2;

    tile.style.zIndex = "1000"; // Bring above other elements
}

function handleTouchMove(e) {
    if (!activeTile) return;
    e.preventDefault();

    let touch = e.touches[0];

    // Move the tile along with finger
    activeTile.style.position = "absolute";
    activeTile.style.left = `${touch.clientX - activeTile.dataset.offsetX}px`;
    activeTile.style.top = `${touch.clientY - activeTile.dataset.offsetY}px`;
}

function handleTouchEnd(e) {
    if (!activeTile) return;

    let touch = e.changedTouches[0];
    let dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropZone && dropZone.dataset.targetPosition) {
        let draggedPos = activeTile.dataset.correctPosition;
        let dropPos = dropZone.dataset.targetPosition;

        if (draggedPos === dropPos) {
            placeTileCorrectly(activeTile, dropZone);
        } else {
            snapBack(activeTile);
        }
    } else {
        snapBack(activeTile);
    }

    activeTile.style.zIndex = "1";
    activeTile = null;
}

// ======================
// 🔹 Drop Handler (Mouse & Touch)
// ======================
function handleDrop(e) {
    let draggedPos = e.dataTransfer.getData("text/plain");
    let draggedTile = tiles.find(t => t.dataset.correctPosition === draggedPos);

    if (draggedTile && draggedPos === e.target.dataset.targetPosition) {
        placeTileCorrectly(draggedTile, e.target);
    } else {
        snapBack(draggedTile);
    }
}

// ======================
// 🔹 Place tile correctly in answer grid
// ======================
function placeTileCorrectly(tile, dropZone) {
    dropZone.appendChild(tile);
    tile.style.position = "static";
    tile.classList.add("blinking");
    
    setTimeout(() => tile.classList.remove("blinking"), 1000);
    
    correctTiles++;
    if (correctTiles === totalTiles) {
        winnerText.style.display = "block";
        winnerText.style.animation = "winner-blink 0.5s 5 alternate";
    }
}

// ======================
// 🔹 Snap Back to Question Grid if Incorrect
// ======================
function snapBack(tile) {
    let originalIndex = parseInt(tile.dataset.originalIndex);
    let originalContainer = tileGrid.children[originalIndex];

    if (originalContainer) {
        originalContainer.appendChild(tile);
        tile.style.position = "static";
    }
}
