let integer_array = [];
let integer_array_copy = [];
let current_iteration = 0;
let running_flag = false;

document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speed_slider');
});
let currentSpeed = speedSlider.max - speedSlider.value;

function toggle_insert(isDisabled) {
    const btn = document.getElementById('insert_number');
    btn.disabled = isDisabled;
}

function toggle_controls(isDisabled, buttonIds = []) {
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = isDisabled;
        }
    });
}

function swap(idxA, idxB) {
    let temp = integer_array[idxA];
    integer_array[idxA] = integer_array[idxB];
    integer_array[idxB] = temp;
}

async function selection_sort_single() {
    let min_index = current_iteration;
    await mark_minimum(min_index);

    for (let j = current_iteration + 1; j < integer_array.length; j++) {
        await highlightandUnhighlight(j);
        // Compare the scanning element (j) with the best candidate (min_index)
        if (integer_array[j] < integer_array[min_index]) {
            let prev_minimum = min_index;
            min_index = j;
            await mark_minimum(min_index);
            await unmark_minimum(prev_minimum);
        }
    }

    // Only swap if a new minimum was actually found
    if (min_index !== current_iteration) {
        // We MUST 'await' here, otherwise the loop keeps running 
        // while the boxes are still sliding!
        await swap_and_render(current_iteration, min_index); //will clean the board
    } else {
        await unmark_minimum(min_index);
    }
    console.log("Sorting complete!", integer_array);
}

// Helper function to draw the boxes on screen
function render_array() {
    const canvas = document.querySelector('.canvas');
    canvas.innerHTML = ''; // Clear the old boxes

    integer_array.forEach((num) => {
        const div = document.createElement('div');
        div.className = 'number-box'; // This uses the CSS we wrote earlier
        div.innerText = num;
        canvas.appendChild(div);
    });
}

function render_array_last() {
    if (integer_array.length === 0) return;
    const canvas = document.querySelector('.canvas');
    const div = document.createElement('div');
    div.className = 'number-box';
    div.innerText = integer_array[integer_array.length - 1];
    canvas.appendChild(div);
}

async function swap_and_render(idxA, idxB) {
    const boxes = document.querySelectorAll('.number-box');
    const boxA = boxes[idxA];
    const boxB = boxes[idxB];

    // 1. Highlight them yellow
    //boxA.classList.add('highlight_yellow');
    //boxB.classList.add('highlight_yellow');

    // 2. Wait 800ms so the user can see the highlight
    //await new Promise(resolve => setTimeout(resolve, currentSpeed));

    // 3. Calculate the distance to slide
    const distance = boxB.offsetLeft - boxA.offsetLeft;

    // 4. Slide them
    boxA.style.transform = `translateX(${distance}px)`;
    boxB.style.transform = `translateX(${-distance}px)`;

    // 5. Wait for the slide animation to finish (0.5s)
    await new Promise(resolve => setTimeout(resolve, currentSpeed));

    // 6. Swap the actual data in the background
    swap(idxA, idxB);

    // 7. Remove highlights and redraw the whole array in the new order
    //boxA.classList.remove('highlight_yellow');
    //boxB.classList.remove('highlight_yellow');
    
    render_array(); //Redraw the entire array
}

async function highlightandUnhighlight(idx) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.add('highlight_yellow');
    await new Promise(resolve => setTimeout(resolve, currentSpeed));
    box.classList.remove('highlight_yellow');
}

async function mark_minimum(idx) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.add('highlight_red');
    await new Promise(resolve => setTimeout(resolve, currentSpeed));
}

async function unmark_minimum(idx) {
    const boxes = document.querySelectorAll('.number-box');
    const box = boxes[idx];
    box.classList.remove('highlight_red');
    await new Promise(resolve => setTimeout(resolve, currentSpeed));
}

// Button Functions
document.getElementById('insert_number').addEventListener('click', function() {
    const text_field = document.getElementById('text_field');
    const new_value = Number(text_field.value);

    //If the text is not empty and new_value is a number
    if (text_field.value !== "" && !isNaN(new_value)) {
        integer_array.push(new_value);
        integer_array_copy.push(new_value);
        render_array_last();
    }
});

document.getElementById('delete_array').addEventListener('click', function() {
    integer_array.length = 0;
    integer_array_copy.length = 0;
    current_iteration = 0;
    toggle_insert(false);
    render_array();
});

document.getElementById('reset_array').addEventListener('click', function() {
    integer_array = [...integer_array_copy];
    current_iteration = 0;
    toggle_insert(false);
    render_array();
});

document.getElementById('continue_algorithm').addEventListener('click', async function() {
    if (running_flag === false && current_iteration < integer_array.length) {
        const buttons = ['continue_algorithm', 'delete_array', 'reset_array'];

        running_flag = true;
        toggle_controls(true, buttons);
        toggle_insert(true);
        await selection_sort_single();
        ++current_iteration;
        render_array();
        running_flag = false;
        this.disabled = false;
        toggle_controls(false, buttons);
    }
});

speedSlider.addEventListener('input', (event) => {
    currentSpeed = speedSlider.max - event.target.value;
    console.log("New speed selected:", currentSpeed);
});