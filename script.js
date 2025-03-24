let draggedTile = null;
let originalParent = null;

document.addEventListener("DOMContentLoaded", () => {
    const tileGrid = document.getElementById("tile-grid");
    const answerGrid = document.getElementById("grid");
    
    const imageUrl = "https://i.postimg.cc/bvhnVRfP/S74-lunch-box.png"; // Puzzle image
    let tiles = [];
    
// Create 25 tiles and store them in an array
    for (let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.correctPosition = i; // Assign correct position
    
   // Calculate row and column position
        let row = Math.floor(i / 5);
        let col = i % 5;  
   
   // Set background image position for each tile
        let row = Math.floor(i / 5);
        let col = i % 5;
        tile.style.backgroundPosition = `-${col * 50}px -${row * 50}px`;

// Apply correct portion of the image
        tile.style.backgroundImage = `url('${imageUrl}')`;
        tile.style.backgroundPosition = `-${col * 50}px -${row * 50}px`;
        tile.style.backgroundSize = "250px 250px";

        tiles.push(tile);
    }
        
        tileGrid.appendChild(tile);
        addDragAndDropHandlers(tile);
    }

// Shuffle tiles array using Fisher-Yates shuffle
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

// Function to add drag & drop support for both touch and mouse
function addDragAndDropHandlers(tile) {
    tile.addEventListener("touchstart", (e) => {
        let touch = e.touches[0];
        let rect = tile.getBoundingClientRect();

        draggedTile = tile;
        originalParent = tile.parentNode;
        tile.classList.add("dragging");

        // Store offset between touch point and tile position
        draggedTile.dataset.offsetX = touch.clientX - rect.left;
        draggedTile.dataset.offsetY = touch.clientY - rect.top;
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault(); // Prevents page scrolling
        if (!draggedTile) return;

        let touch = e.touches[0];
        let offsetX = parseFloat(draggedTile.dataset.offsetX);
        let offsetY = parseFloat(draggedTile.dataset.offsetY);

        // Ensure tile moves exactly with the finger
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
                touch.clientX >= rect.left &&
                touch.clientX <= rect.right &&
                touch.clientY >= rect.top &&
                touch.clientY <= rect.bottom &&
                !zone.hasChildNodes()
            ) {
                if (draggedTile.dataset.correctPosition === zone.dataset.correctPosition) {
                    zone.appendChild(draggedTile); // Place in correct position
                    draggedTile.style.position = "static";
                    placedCorrectly = true;
                }
            }
        });

        // 🔥 If tile was NOT placed correctly, SNAP BACK to question grid
        if (!placedCorrectly) {
            originalParent.appendChild(draggedTile);
            draggedTile.style.position = "static"; // Reset position
        }

        draggedTile.classList.remove("dragging");
        draggedTile.style.zIndex = "1"; // Reset stacking order
        draggedTile = null;
    });
}
