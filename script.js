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
            tile.style.backgroundColor = "transparent";

            tiles.push(tile);
        }
    }

    // Shuffle and add tiles to question grid
    tiles.sort(() => Math.random() - 0.5);
    tiles.forEach(tile => tileGrid.appendChild(tile));

    // Create empty answer grid slots
    for (let i = 0; i < rows * cols; i++) {
        let dropZone = document.createElement("div");
        dropZone.classList.add("drop-zone");
        answerGrid.appendChild(dropZone);
    }

    // Enable drag-and-drop and touch support
    addDragAndTouchSupport(tiles);
});

function addDragAndTouchSupport(tiles) {
    let draggedTile = null;

    tiles.forEach(tile => {
        // Drag Events (For Mouse)
        tile.addEventListener("dragstart", (e) => {
            draggedTile = tile;
            e.dataTransfer.setData("text", tile.dataset.correctPosition);
            tile.classList.add("dragging");
        });

        tile.addEventListener("dragend", () => {
            draggedTile = null;
            tile.classList.remove("dragging");
        });

        // Touch Events (For Mobile)
        tile.addEventListener("touchstart", (e) => {
            draggedTile = tile;
            tile.classList.add("dragging");
        });

        tile.addEventListener("touchmove", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            draggedTile.style.position = "absolute";
            draggedTile.style.left = touch.clientX - 25 + "px";
            draggedTile.style.top = touch.clientY - 25 + "px";
        });

        tile.addEventListener("touchend", () => {
            draggedTile.classList.remove("dragging");
            draggedTile = null;
        });
    });

    const grid = document.getElementById("grid");

    grid.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    grid.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedTile) {
            grid.appendChild(draggedTile);
            draggedTile.style.position = "static"; // Reset position
        }
    });

    // Touch Drop Handling
    document.querySelectorAll(".drop-zone").forEach(zone => {
        zone.addEventListener("touchend", function () {
            if (draggedTile) {
                this.appendChild(draggedTile);
                draggedTile.style.position = "static"; // Reset position
            }
        });
    });
}
