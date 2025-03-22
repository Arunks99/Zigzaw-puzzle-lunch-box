document.addEventListener("DOMContentLoaded", function () {
    const tileGrid = document.getElementById("tile-grid");
    const answerGrid = document.getElementById("grid");
    const rows = 5, cols = 5;
    const imageSize = 250;
    const tileSize = 50;

    let tiles = [];

    // Clear existing tiles
    tileGrid.innerHTML = '';
    answerGrid.innerHTML = '';

    // Generate tiles
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("draggable", true); // Enable dragging
            tile.dataset.correctPosition = `${row}-${col}`; // Store correct position

            // Set background image for correct cropping
            tile.style.backgroundImage = "url('https://i.postimg.cc/bvhnVRfP/S74-lunch-box.png')";
            tile.style.backgroundSize = `${imageSize}px ${imageSize}px`;
            tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
            tile.style.backgroundRepeat = "no-repeat";
            tile.style.backgroundColor = "transparent";

            tiles.push(tile);
        }
    }

    // Shuffle tiles before adding to tile grid
    tiles.sort(() => Math.random() - 0.5);

    // Append shuffled tiles to question grid
    tiles.forEach(tile => tileGrid.appendChild(tile));
});
