const gridSize = 4;
const tileSize = 70;
const dropTolerance = 15; // Allowed margin of error for placement
let correctTiles = 0;
const totalTiles = gridSize * gridSize;

const grid = document.getElementById("grid");
const tileGrid = document.getElementById("tile-grid");
const winnerText = document.getElementById("winner");
let tiles = [];

// Generate tile positions
let positions = [];
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        positions.push({ row, col });
    }
}
positions.sort(() => Math.random() - 0.5);

// Create tiles
for (let i = 0; i < positions.length; i++) {
    let { row, col } = positions[i];
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
    tile.dataset.correctPosition = `${row}-${col}`;
    tile.draggable = true;

    // Store original position for snapping back
    tile.dataset.originalIndex = i;

    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
        tile.classList.add("dragging");
    });

    tile.addEventListener("dragend", () => {
        tile.classList.remove("dragging");
    });

    // Mobile Touch Events
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        let touch = e.touches[0];

        let rect = tile.getBoundingClientRect();
        tile.dataset.offsetX = touch.clientX - rect.left;
        tile.dataset.offsetY = touch.clientY - rect.top;

        tile.style.zIndex = "1000"; // Bring above other elements
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];

        tile.style.position = "absolute";
        tile.style.left = `${touch.clientX - tile.dataset.offsetX}px`;
        tile.style.top = `${touch.clientY - tile.dataset.offsetY}px`;
    });

    tile.addEventListener("touchend", (e) => {
        tile.style.zIndex = "1";
        let touch = e.changedTouches[0];
        let dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

        if (dropZone && dropZone.dataset.targetPosition) {
            let draggedPos = tile.dataset.correctPosition;
            let dropPos = dropZone.dataset.targetPosition;

            if (draggedPos === dropPos) {
                dropZone.appendChild(tile);
                tile.style.position = "static";
                tile.style.left = "0px";
                tile.style.top = "0px";
                tile.classList.add("blinking");
                setTimeout(() => tile.classList.remove("blinking"), 1000);
                correctTiles++;
                if (correctTiles === totalTiles) {
                    winnerText.style.display = "block";
                    winnerText.style.animation = "winner-blink 0.5s 5 alternate";
                }
            } else {
                snapBack(tile);
            }
        } else {
            snapBack(tile);
        }
    });

    tiles.push(tile);
}

// Shuffle tiles before adding them to tile grid
for (let tile of tiles.sort(() => Math.random() - 0.5)) {
    tileGrid.appendChild(tile);
}

// Create the answer grid
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        let dropZone = document.createElement("div");
        dropZone.style.width = `${tileSize}px`;
        dropZone.style.height = `${tileSize}px`;
        dropZone.style.border = "1px solid grey";
        dropZone.dataset.targetPosition = `${row}-${col}`;
        dropZone.addEventListener("dragover", (e) => e.preventDefault());

        dropZone.addEventListener("drop", (e) => {
            let draggedPos = e.dataTransfer.getData("text/plain");
            let draggedTile = tiles.find(t => t.dataset.correctPosition === draggedPos);

            if (draggedTile && draggedPos === dropZone.dataset.targetPosition) {
                dropZone.appendChild(draggedTile);
                draggedTile.style.position = "static";
                draggedTile.classList.add("blinking");
                setTimeout(() => draggedTile.classList.remove("blinking"), 1000);
                correctTiles++;
                if (correctTiles === totalTiles) {
                    winnerText.style.display = "block";
                    winnerText.style.animation = "winner-blink 0.5s 5 alternate";
                }
            } else {
                snapBack(draggedTile);
            }
        });

        grid.appendChild(dropZone);
    }
}

document.body.insertAdjacentHTML("beforeend", "<p id='warning' style='color: red; display: none; text-align: center;'>Warning: The images will not sit in the grid if the tiles do not match!</p>");

// Function to snap tile back to original position in the question grid
function snapBack(tile) {
    let originalIndex = parseInt(tile.dataset.originalIndex);
    let originalContainer = tileGrid.children[originalIndex];

    if (originalContainer) {
        originalContainer.appendChild(tile);
        tile.style.position = "static";
    }
}
