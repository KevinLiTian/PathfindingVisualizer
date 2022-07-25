document.addEventListener('DOMContentLoaded', function () {

    // Create Grid with boxes
    tableCreate();

    // Add click event listener to all boxes
    document.querySelectorAll('.box-container').forEach((box_container) => {
        const box = box_container.children[0];
        if (box) {
            // Play Animation
            box_container.addEventListener('click', () => {
                box.style.animationPlayState = 'running';
            });

            // Set Animation
            box.addEventListener('animationend', () => setBoxAnimationState(box));
        }
    });
});

/* Stop Animation and Set Animation Accordingly */
function setBoxAnimationState(box) {

    box.style.animationPlayState = 'paused';

    // Toggle between Stretch & Shrink
    if (box.dataset.animation === 'stretch') {
        box.classList.remove('stretch');
        box.classList.add('shrink');
        box.dataset.animation = 'shrink';
    } else {
        box.classList.remove('shrink');
        box.classList.add('stretch');
        box.dataset.animation = 'stretch';
    }
}

/* Create Grid */
function tableCreate() {
    const grid = document.querySelector('#grid');
    const tbl = document.createElement('table');
    tbl.style.borderCollapse = 'collapse';
    tbl.style.width = '100%';

    for (let i = 0; i < 21; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < 50; j++) {
            const td = tr.insertCell();
            td.classList.add('box-container');

            // Source
            if (i === 9 && j === 5) {
                td.style.backgroundColor = '#FFE2C8';
            }

            // Destination
            else if (i === 9 && j === 44) {
                td.style.backgroundColor = '#FFC7D7';
            }

            // Box
            else {
                const box = document.createElement('div');
                box.classList.add('box', 'stretch');
                box.dataset.animation = 'stretch';

                td.append(box);
            }
        }
    }
    grid.append(tbl);
}