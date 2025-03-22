const gridSize = 5;
const tileSize = 50;
let correctTiles = 0;
const totalTiles = gridSize * gridSize;
const grid = document.getElementById("grid");
const tileGrid = document.getElementById("tile-grid");
const winnerText = document.getElementById("winner");

let tiles = [];
let positions = [];

// Generate grid positions
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        positions.push({ row, col });
    }
}
positions.sort(() => Math.random() - 0.5); // Shuffle positions

for (let i = 0; i < positions.length; i++) {
    let { row, col } = positions[i];

    // Create tile
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
    tile.dataset.correctPosition = `${row}-${col}`;

    // Store original position for snapping back
    tile.dataset.originalRow = row;
    tile.dataset.originalCol = col;

    // Position tile in question grid
    tile.style.position = "absolute";
    tile.style.left = `${Math.random() * 200}px`;
    tile.style.top = `${Math.random() * 200}px`;

    // Make tile draggable
    tile.draggable = true;

    // Drag event (Mouse)
    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
        setTimeout(() => tile.classList.add("hidden"), 0);
    });

    tile.addEventListener("dragend", () => tile.classList.remove("hidden"));

    // Touch event (Mobile) - FIXED OFFSET
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        let touch = e.touches[0];

        // Get tile's current position and calculate offset
        let rect = tile.getBoundingClientRect();
        let offsetX = touch.clientX - rect.left;
        let offsetY = touch.clientY - rect.top;

        tile.dataset.offsetX = offsetX;
        tile.dataset.offsetY = offsetY;

        tile.classList.add("dragging");
        tile.style.zIndex = "1000";

        moveTile(tile, touch.clientX, touch.clientY);
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        moveTile(tile, touch.clientX, touch.clientY);
    });

    tile.addEventListener("touchend", (e) => {
        e.preventDefault();
        tile.classList.remove("dragging");
        tile.style.zIndex = "1";

        let dropped = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        let dropZone = dropped.closest(".drop-zone");

        if (dropZone) {
            let targetPos = dropZone.dataset.targetPosition;
            if (tile.dataset.correctPosition === targetPos) {
                snapToGrid(tile, dropZone);
                return;
            }
        }
        resetTilePosition(tile);
    });

    tileGrid.appendChild(tile);
    tiles.push(tile);
}

// Create the answer grid
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        let dropZone = document.createElement("div");
        dropZone.style.width = `${tileSize}px`;
        dropZone.style.height = `${tileSize}px`;
        dropZone.classList.add("drop-zone");
        dropZone.dataset.targetPosition = `${row}-${col}`;

        dropZone.addEventListener("dragover", (e) => e.preventDefault());

        dropZone.addEventListener("drop", (e) => {
            let draggedPos = e.dataTransfer.getData("text/plain");
            let draggedTile = tiles.find(t => t.dataset.correctPosition === draggedPos);

            if (draggedTile) {
                if (draggedPos === dropZone.dataset.targetPosition) {
                    snapToGrid(draggedTile, dropZone);
                } else {
                    resetTilePosition(draggedTile);
                }
            }
        });

        grid.appendChild(dropZone);
    }
}

// Function to move tile with finger correctly
function moveTile(tile, x, y) {
    let offsetX = parseFloat(tile.dataset.offsetX) || 0;
    let offsetY = parseFloat(tile.dataset.offsetY) || 0;

    tile.style.left = `${x - offsetX}px`;
    tile.style.top = `${y - offsetY}px`;
}

// Function to snap tile into the answer grid
function snapToGrid(tile, dropZone) {
    dropZone.appendChild(tile);
    tile.style.position = "static";
    correctTiles++;

    if (correctTiles === totalTiles) {
        winnerText.style.display = "block";
    }
}

// Function to reset tile position (snap back)
function resetTilePosition(tile) {
    tileGrid.appendChild(tile);
    tile.style.position = "absolute";
  }

document.addEventListener("DOMContentLoaded", function () {
    const tileGrid = document.getElementById("tile-grid");
    const rows = 5, cols = 5;
    const imageSize = 250;
    const tileSize = 50;
    
    let tiles = [];

    // Generate ordered tiles
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("draggable", true); // Enable drag
            tile.dataset.correctPosition = `${row}-${col}`; // Store correct position

            // Set background image correctly
            tile.style.backgroundImage = "url('https://i.postimg.cc/bvhnVRfP/S74-lunch-box.png')";
            tile.style.backgroundSize = `${imageSize}px ${imageSize}px`;
            tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
            tile.style.backgroundRepeat = "no-repeat"; // Prevent repeat
            tile.style.backgroundColor = "transparent"; // Ensure no white background

            tiles.push(tile);
        }
    }
    // Shuffle tiles randomly
    tiles.sort(() => Math.random() - 0.5);

    // Add shuffled tiles to the grid
  tileGrid.innerHTML = ""; // Clear previous tiles
    tiles.forEach(tile => tileGrid.appendChild(tile));
});

    // Enable drag-and-drop functionality
    addDragAndDrop(tiles);
});

function addDragAndDrop(tiles) {
    tiles.forEach(tile => {
        tile.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", tile.dataset.correctPosition);
            tile.classList.add("dragging");
        });

        tile.addEventListener("dragend", () => {
            tile.classList.remove("dragging");
        });

        // Enable touch support
        tile.addEventListener("touchstart", (e) => {
            e.preventDefault();
            tile.classList.add("dragging");
        });

        tile.addEventListener("touchend", () => {
            tile.classList.remove("dragging");
        });
    });

    const grid = document.getElementById("grid");
    
    grid.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    grid.addEventListener("drop", (e) => {
        e.preventDefault();
        let position = e.dataTransfer.getData("text");
        let droppedTile = document.querySelector(`.tile[data-correct-position='${position}']`);
        if (droppedTile) {
            grid.appendChild(droppedTile);
        }
    });
}
