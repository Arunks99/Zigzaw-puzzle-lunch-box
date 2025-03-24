document.addEventListener("DOMContentLoaded", () => {
    const tileGrid = document.getElementById("tile-grid");
    const answerGrid = document.getElementById("grid");

    const imageUrl = "https://i.postimg.cc/bvhnVRfP/S74-lunch-box.png"; // Puzzle image
    let tiles = [];

    // Create 25 tiles with correct image portions
    for (let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.correctPosition = i; // Assign correct position

        // Calculate row and column position
        let row = Math.floor(i / 5);
        let col = i % 5;

        // Apply correct portion of the image
        tile.style.backgroundImage = `url('${imageUrl}')`;
        tile.style.backgroundPosition = `-${col * 50}px -${row * 50}px`;
        tile.style.backgroundSize = "250px 250px"; // Ensure the full image scales correctly

        tiles.push(tile);
    }

    // Shuffle tiles using Fisher-Yates algorithm
    for (let i = tiles.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // Append shuffled tiles to the question grid
    tiles.forEach(tile => {
        tileGrid.appendChild(tile);
        addDragAndDropHandlers(tile);
    });

    // Create empty drop zones in the answer grid
    for (let i = 0; i < 25; i++) {
        let dropZone = document.createElement("div");
        dropZone.classList.add("drop-zone");
        dropZone.dataset.correctPosition = i;
        answerGrid.appendChild(dropZone);
    }
});

// Drag-and-drop & touch support
function addDragAndDropHandlers(tile) {
    let draggedTile = null;
    let originalParent = null;
    const ERROR_MARGIN = 20; // Increased error margin (px)

    tile.addEventListener("touchstart", (e) => {
        let touch = e.touches[0];
        let rect = tile.getBoundingClientRect();

        draggedTile = tile;
        originalParent = tile.parentNode;
        tile.classList.add("dragging");

       // Move tile immediately under the finger
    draggedTile.style.position = "absolute";
    draggedTile.style.left = `${touch.clientX - 25}px`; // Center the tile under the finger
    draggedTile.style.top = `${touch.clientY - 25}px`; 
    draggedTile.style.zIndex = "1000"; // Ensure tile is above others
});
    
    tile.addEventListener("touchmove", (e) => {
        e.preventDefault(); // Prevents page scrolling
        if (!draggedTile) return;

        let touch = e.touches[0];
        let offsetX = parseFloat(draggedTile.dataset.offsetX);
        let offsetY = parseFloat(draggedTile.dataset.offsetY);

        // Move tile with the finger
        draggedTile.style.position = "absolute";
        draggedTile.style.left = `${touch.clientX - offsetX}px`;
        draggedTile.style.top = `${touch.clientY - offsetY}px`;
        draggedTile.style.zIndex = "1000"; // Ensure tile is above others
    });

    tile.addEventListener("touchend", (e) => {
        let touch = e.changedTouches[0];
        let dropZones = document.querySelectorAll(".drop-zone");
        let placedCorrectly = false;

        dropZones.forEach(zone => {
            let rect = zone.getBoundingClientRect();

            if (
                touch.clientX >= rect.left - ERROR_MARGIN &&
                touch.clientX <= rect.right + ERROR_MARGIN &&
                touch.clientY >= rect.top - ERROR_MARGIN &&
                touch.clientY <= rect.bottom + ERROR_MARGIN &&
                !zone.hasChildNodes()
            ) {
                if (draggedTile.dataset.correctPosition === zone.dataset.correctPosition) {
                    zone.appendChild(draggedTile);
                    draggedTile.style.position = "relative";
                    draggedTile.style.left = "0";
                    draggedTile.style.top = "0";
                    placedCorrectly = true;
                }
            }
        });

        // Snap back to question grid if placed incorrectly
        if (!placedCorrectly) {
            originalParent.appendChild(draggedTile);
            draggedTile.style.position = "relative"; 
            draggedTile.style.left = "0";
            draggedTile.style.top = "0";
        }

        draggedTile.classList.remove("dragging");
        draggedTile.style.zIndex = "1"; 
        draggedTile = null;
    });
}
