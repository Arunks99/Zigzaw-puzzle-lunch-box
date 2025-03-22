document.addEventListener("DOMContentLoaded", function () {
    const tileGrid = document.getElementById("tile-grid");
    const answerGrid = document.getElementById("grid");
    const rows = 5, cols = 5;
    const imageSize = 250;
    const tileSize = 50;
    let tiles = [];

    // Clear previous content
    tileGrid.innerHTML = '';
    answerGrid.innerHTML = '';

    // Generate tiles
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("draggable", true);
            tile.dataset.correctPosition = `${row}-${col}`;

            // Set tile background image
            tile.style.backgroundImage = "url('https://i.postimg.cc/bvhnVRfP/S74-lunch-box.png')";
            tile.style.backgroundSize = `${imageSize}px ${imageSize}px`;
            tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
            tile.style.backgroundRepeat = "no-repeat";

            tiles.push(tile);
        }
    }

    // Shuffle and add tiles to the question grid
    tiles.sort(() => Math.random() - 0.5);
    tiles.forEach(tile => tileGrid.appendChild(tile));

    // Create empty answer grid slots
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let dropZone = document.createElement("div");
            dropZone.classList.add("drop-zone");
            dropZone.dataset.correctPosition = `${row}-${col}`;
            answerGrid.appendChild(dropZone);
        }
    }

    // Enable drag-and-drop and touch support
    addDragAndTouchSupport(tiles);
});

function addDragAndTouchSupport(tiles) {
    let draggedTile = null;
    let originalParent = null; // Store original position

    // Drag and Drop Support (Mouse)
    tiles.forEach(tile => {
        tile.addEventListener("dragstart", (e) => {
            draggedTile = tile;
            originalParent = tile.parentNode; // Save original parent
            e.dataTransfer.setData("text/plain", tile.dataset.correctPosition);
            tile.classList.add("dragging");
        });

        tile.addEventListener("dragend", () => {
            draggedTile.classList.remove("dragging");
            if (draggedTile && !draggedTile.parentElement.classList.contains("drop-zone")) {
                originalParent.appendChild(draggedTile); // Snap back if incorrect
            }
            draggedTile = null;
        });

        // Touch Events (For Mobile)
        tile.addEventListener("touchstart", (e) => {
            draggedTile = tile;
            originalParent = tile.parentNode; // Save original parent
            tile.classList.add("dragging");

            let touch = e.touches[0];
            tile.dataset.offsetX = touch.clientX - tile.getBoundingClientRect().left;
            tile.dataset.offsetY = touch.clientY - tile.getBoundingClientRect().top;
        });

        tile.addEventListener("touchmove", (e) => {
            e.preventDefault();
            if (!draggedTile) return;

            let touch = e.touches[0];
            draggedTile.style.position = "absolute";
            draggedTile.style.left = touch.clientX - draggedTile.dataset.offsetX + "px";
            draggedTile.style.top = touch.clientY - draggedTile.dataset.offsetY + "px";
        });

        tile.addEventListener("touchend", (e) => {
            draggedTile.classList.remove("dragging");
            checkTilePlacement(draggedTile, e.changedTouches[0]);
            draggedTile = null;
        });
    });

    // Handle dropping on answer grid
    document.querySelectorAll(".drop-zone").forEach(zone => {
        zone.addEventListener("dragover", (e) => e.preventDefault());

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedTile && !zone.hasChildNodes()) {
                // Check if placed correctly
                if (draggedTile.dataset.correctPosition === zone.dataset.correctPosition) {
                    zone.appendChild(draggedTile);
                    draggedTile.style.position = "static"; // Reset position
                } else {
                    originalParent.appendChild(draggedTile); // Snap back if incorrect
                }
            }
        });

        // Touch-based drop
        zone.addEventListener("touchend", function (e) {
            if (draggedTile && !this.hasChildNodes()) {
                if (draggedTile.dataset.correctPosition === this.dataset.correctPosition) {
                    this.appendChild(draggedTile);
                    draggedTile.style.position = "static";
                } else {
                    originalParent.appendChild(draggedTile); // Snap back if incorrect
                }
            }
        });
    });
}

// Function to check tile placement on touch release
function checkTilePlacement(tile, touch) {
    let dropZones = document.querySelectorAll(".drop-zone");
    let found = false;

    dropZones.forEach(zone => {
        let rect = zone.getBoundingClientRect();
        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom &&
            !zone.hasChildNodes()
        ) {
            if (tile.dataset.correctPosition === zone.dataset.correctPosition) {
                zone.appendChild(tile);
                tile.style.position = "static";
                found = true;
            }
        }
    });

    if (!found && tile.parentNode !== document.getElementById("tile-grid")) {
        document.getElementById("tile-grid").appendChild(tile);
    }
}
