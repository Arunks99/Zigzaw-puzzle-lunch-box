tile.addEventListener("touchend", (e) => {
    draggedTile.classList.remove("dragging");
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
                zone.appendChild(draggedTile);
                draggedTile.style.position = "static";
                placedCorrectly = true;
            }
        }
    });

    // If not placed correctly, snap back to the original question grid
    if (!placedCorrectly) {
        originalParent.appendChild(draggedTile);
        draggedTile.style.position = "static"; // Reset position
    }

    draggedTile = null;
});
