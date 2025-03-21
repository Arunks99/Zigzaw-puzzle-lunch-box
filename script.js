const gridSize = 4;
const tileSize = 70;
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
    
    // Make tile draggable (for desktop)
    tile.draggable = true;
    
    // Drag event (Mouse)
    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
        setTimeout(() => tile.classList.add("hidden"), 0); // Hide while dragging
    });

    tile.addEventListener("dragend", () => tile.classList.remove("hidden")); // Show after dragging

    // Touch event (Mobile)
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        tile.classList.add("dragging");
        tile.style.position = "absolute";
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

    tiles.push(tile);
}

// Randomize tiles before adding them to tile grid
for (let tile of tiles.sort(() => Math.random() - 0.5)) {
    tileGrid.appendChild(tile);
}

// Create the answer grid
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        let dropZone = document.createElement("div");
        dropZone.style.width = `${tileSize}px`;
        dropZone.style.height = `${tileSize}px`;
        dropZone.style.border = "2px solid grey";
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

// Function to move tile with finger exactly (Fixed Offset Issue)
function moveTile(tile, x, y) {
    tile.style.left = `${x - tileSize /10}px`; // Center horizontally
    tile.style.top = `${y - tileSize /10}px`;  // Center vertically
}

// Function to snap tile into the answer grid (Fixed Correct Placement)
function snapToGrid(tile, dropZone) {
    dropZone.appendChild(tile);
    tile.style.position = "static";  // Ensure it sits properly
    tile.classList.add("blinking");
    setTimeout(() => tile.classList.remove("blinking"), 1000);
    correctTiles++;

    if (correctTiles === totalTiles) {
        winnerText.style.display = "block";
        winnerText.style.animation = "winner-blink 0.5s 5 alternate";
    }
}

// Function to reset tile position (Snap Back to Original Place)
function resetTilePosition(tile) {
    tileGrid.appendChild(tile);
    tile.style.position = "static";
}
