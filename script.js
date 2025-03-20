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
    tile.draggable = true;

    // Mouse Events
    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
    });

    // Touch Events for Mobile
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        tile.classList.add("dragging");
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        tile.style.position = "absolute";
        tile.style.left = `${touch.clientX - tileSize / 2}px`;
        tile.style.top = `${touch.clientY - tileSize / 2}px`;
    });

    tile.addEventListener("touchend", (e) => {
        tile.classList.remove("dragging");
        let dropZone = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if (dropZone && dropZone.dataset.targetPosition) {
            let draggedPos = tile.dataset.correctPosition;
            if (draggedPos === dropZone.dataset.targetPosition) {
                dropZone.appendChild(tile);
                tile.style.position = "static";
                tile.classList.add("blinking");
                setTimeout(() => tile.classList.remove("blinking"), 1000);
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
