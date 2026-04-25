let integer_array = [];
let integer_array_copy = [];

const speedSlider = document.getElementById('speed_slider');
let currentSpeed = speedSlider.max - speedSlider.value;

function swap(idxA, idxB) {
    let temp = integer_array[idxA];
    integer_array[idxA] = integer_array[idxB];
    integer_array[idxB] = temp;
}

async function selection_sort() {
    for (let i = 0; i < integer_array.length; i++) {
        let min_index = i;
        await mark_minimum(min_index);

        for (let j = i + 1; j < integer_array.length; j++) {
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
        if (min_index !== i) {
            // We MUST 'await' here, otherwise the loop keeps running 
            // while the boxes are still sliding!
            await swap_and_render(i, min_index); //will clean the board
        } else {
            await unmark_minimum(min_index);
        }
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
        document.getElementById('display_area').innerText = JSON.stringify(integer_array);
    }
});

document.getElementById('delete_array').addEventListener('click', function() {
    integer_array.length = 0;
    integer_array_copy.length = 0;
    render_array();
});

document.getElementById('reset_array').addEventListener('click', function() {
    integer_array = [...integer_array_copy];
    render_array();
});

document.getElementById('start_algorithm').addEventListener('click', async function() {
    await selection_sort();
    render_array();
});

speedSlider.addEventListener('input', (event) => {
    currentSpeed = speedSlider.max - event.target.value;
    console.log("New speed selected:", currentSpeed);
});