const gridSize = 4;
const tileSize = 70;
const dropTolerance = 15; // Allowed error margin for easier snapping
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

    // Mouse Drag Events
    tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
    });

    // Touch Events for Mobile
    tile.addEventListener("touchstart", (e) => {
        e.preventDefault();
        tile.clas
