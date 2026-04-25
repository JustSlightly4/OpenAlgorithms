// Helper function to draw the boxes on screen
export function render_array(arr) {
    const canvas = document.querySelector('.canvas');
    canvas.innerHTML = ''; // Clears the old boxes

    arr.forEach((num) => {
        const div = document.createElement('div');
        div.className = 'number-box';
        div.innerText = num;
        canvas.appendChild(div);
    });
}

export function render_array_last(arr) {
    if (arr.length === 0) return;
    const canvas = document.querySelector('.canvas');
    const div = document.createElement('div');
    div.className = 'number-box';
    div.innerText = arr[arr.length - 1];
    canvas.appendChild(div);
}

export async function swap_and_render(arr, idxA, idxB, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const boxA = boxes[idxA];
    const boxB = boxes[idxB];

    // 3. Calculate the distance to slide
    const distance = boxB.offsetLeft - boxA.offsetLeft;

    // 4. Slide them
    boxA.style.transform = `translateX(${distance}px)`;
    boxB.style.transform = `translateX(${-distance}px)`;

    // 5. Wait for the slide animation to finish (0.5s)
    await new Promise(resolve => setTimeout(resolve, current_speed));
    
    render_array(arr); //Redraw the entire array
}

export async function flash_yellow(idx, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.add('highlight_yellow');
    await new Promise(resolve => setTimeout(resolve, current_speed));
    box.classList.remove('highlight_yellow');
}

export async function flash_red(idx, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.add('highlight_red');
    await new Promise(resolve => setTimeout(resolve, current_speed));
    box.classList.remove('highlight_red');
}

export async function highlight_red(idx, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.add('highlight_red');
    await new Promise(resolve => setTimeout(resolve, current_speed));
}

export async function unhighlight_red(idx, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.remove('highlight_red');
    await new Promise(resolve => setTimeout(resolve, current_speed));
}

export async function highlight_yellow(idx, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.add('highlight_red');
    await new Promise(resolve => setTimeout(resolve, current_speed));
}

export async function unhighlight_yellow(idx, current_speed) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.remove('highlight_red');
    await new Promise(resolve => setTimeout(resolve, current_speed));
}