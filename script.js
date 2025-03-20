const gridSize = 4;
const tileSize = 70;
let correctTiles = 0;
const totalTiles = gridSize * gridSize;

const grid = document.getElementById("grid");
const tileGrid = document.getElementById("tile-grid");
const winnerText = document.getElementById("winner");
let tiles = [];

let positions = [];
for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        positions.push({ row, col });
    }
}
positions.sort(() => Math.random() - 0.5);

for (let i = 0; i < positions.length; i++) {
    let { row, col } = positions[i];
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
    tile.dataset.correctPosition = `${row}-${col}`;
    tile.dataset.originalPosition = `${i}`;
    tile.draggable = true;

    // Mouse Events
    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
    });

    // Touch Events for Mobile
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        tile.classList.add("dragging");
        let touch = e.touches[0];
        tile.dataset.startX = touch.clientX;
        tile.dataset.startY = touch.clientY;
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        let offsetX = touch.clientX - tile.dataset.startX;
        let offsetY = touch.clientY - tile.dataset.startY;
        tile.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    tile.addEventListener("touchend", (e) => {
        tile.classList.remove("dragging");
        let touch = e.changedTouches[0];
        let dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
        let originalPos = tile.dataset.originalPosition;

        if (dropZone && dropZone.dataset.targetPosition) {
            let draggedPos = tile.dataset.correctPosition;
            if (draggedPos === dropZone.dataset.targetPosition) {
                dropZone.appendChild(tile);
                tile.style.position = "static";
                tile.style.transform = "none";
                tile.classList.add("blinking");
                setTimeout(() => tile.classList.remove("blinking"), 1000);
                correctTiles++;
                if (correctTiles === totalTiles) {
                    winnerText.style.display = "block";
                    winnerText.style.animation = "winner-blink 0.5s 5 alternate";
                }
            } else {
                snapBack(tile, originalPos);
            }
        } else {
            snapBack(tile, originalPos);
        }
    });

    tiles.push(tile);
}

// Shuffle tiles before appending them to the tile grid
for (let tile of tiles.sort(() => Math.random() - 0.5)) {
    tileGrid.appendChild(tile);
}

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
                draggedTile.style.transform = "none";
                draggedTile.classList.add("blinking");
                setTimeout(() => draggedTile.classList.remove("blinking"), 1000);
                correctTiles++;
                if (correctTiles === totalTiles) {
                    winnerText.style.display = "block";
                    winnerText.style.animation = "winner-blink 0.5s 5 alternate";
                }
            } else {
                let warning = document.getElementById("warning");
                warning.style.display = "block";
                setTimeout(() => warning.style.display = "none", 2000);
            }
        });

        grid.appendChild(dropZone);
    }
}

document.body.insertAdjacentHTML("beforeend", "<p id='warning' style='color: red; display: none; text-align: center;'>Warning: The images will not sit in the grid if the tiles do not match!</p>");

// Function to snap tile back to original position
function snapBack(tile, originalPos) {
    tile.style.transition = "transform 0.3s ease";
    tile.style.transform = "translate(0, 0)";
    setTimeout(() => {
        tile.style.transition = "none";
    }, 300);
}
