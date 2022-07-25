document.addEventListener('DOMContentLoaded', function () {
    const box_container = document.querySelector('.box-container');
    const box = box_container.children[0];

    // Play Animation
    box_container.addEventListener('click', () => {
        box.style.animationPlayState = 'running';
    });

    // Set Animation
    box.addEventListener('animationend', () => setBoxAnimationState(box));
})

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