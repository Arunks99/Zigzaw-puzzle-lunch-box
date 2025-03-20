const gridSize = 4;
const tileSize = 70;
const dropTolerance = 15; // Allowed margin of error for placement
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
    tile.dataset.originalPosition = i;
    tile.draggable = true;

    // Mouse Drag Events
    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
    });

    // Touch Events for Mobile
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        tile.classList.add("dragging");
        let touch = e.touches[0];

        // Set offset to keep touch centered on tile
        let rect = tile.getBoundingClientRect();
        tile.dataset.offsetX = touch.clientX - rect.left;
        tile.dataset.offsetY = touch.clientY - rect.top;
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];

        // Move tile according to touch position
        tile.style.position = "absolute";
        tile.style.left = `${touch.clientX - tile.dataset.offsetX}px`;
        tile.style.top = `${touch.clientY - tile.dataset.offsetY}px`;
    });

    tile.addEventListener("touchend", (e) => {
  
