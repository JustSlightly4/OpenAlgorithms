import * as animations from "../../lib/animations.js"
import * as functions from "../../lib/functions.js"

let integer_array = [];
let integer_array_copy = [];
let current_iteration = 0;
let running_flag = false;

const speedSlider = document.getElementById('speed_slider');
let current_speed = speedSlider.max - speedSlider.value;

async function selection_sort_single() {
    let min_index = current_iteration;
    await animations.highlight_red(min_index);

    for (let j = current_iteration + 1; j < integer_array.length; j++) {
        await animations.flash_yellow(j, current_speed);
        // Compare the scanning element (j) with the best candidate (min_index)
        if (integer_array[j] < integer_array[min_index]) {
            let prev_minimum = min_index;
            min_index = j;
            await animations.highlight_red(min_index, current_speed);
            await animations.unhighlight_red(prev_minimum, current_speed);
        }
    }

    // Only swap if a new minimum was actually found
    if (min_index !== current_iteration) {
        // We MUST 'await' here, otherwise the loop keeps running 
        // while the boxes are still sliding!
        functions.swap(integer_array, current_iteration, min_index);
        await animations.swap_and_render(integer_array, current_iteration, min_index, current_speed); //will clean the board
    } else {
        await animations.unhighlight_red(min_index, current_speed);
    }
    console.log("Sorting complete!", integer_array);
}

// Button Functions
document.getElementById('insert_number').addEventListener('click', function() {
    const text_field = document.getElementById('text_field');
    const new_value = Number(text_field.value);

    //If the text is not empty and new_value is a number
    if (text_field.value !== "" && !isNaN(new_value)) {
        integer_array.push(new_value);
        integer_array_copy.push(new_value);
        animations.render_array_last(integer_array);
    }
});

document.getElementById('delete_array').addEventListener('click', function() {
    integer_array.length = 0;
    integer_array_copy.length = 0;
    current_iteration = 0;
    functions.toggle_controls(false, ['insert_number']);
    animations.render_array(integer_array);
});

document.getElementById('reset_array').addEventListener('click', function() {
    integer_array = [...integer_array_copy];
    current_iteration = 0;
    functions.toggle_controls(false, ['insert_number']);
    animations.render_array(integer_array);
});

document.getElementById('continue_algorithm').addEventListener('click', async function() {
    if (running_flag === false && current_iteration < integer_array.length) {
        const buttons = ['continue_algorithm', 'delete_array', 'reset_array'];
        running_flag = true;
        functions.toggle_controls(true, buttons);
        functions.toggle_controls(true, ['insert_number']);
        await selection_sort_single();
        ++current_iteration;
        animations.render_array(integer_array);
        running_flag = false;
        this.disabled = false;
        functions.toggle_controls(false, buttons);
    }
});

speedSlider.addEventListener('input', (event) => {
    current_speed = speedSlider.max - event.target.value;
    console.log("New speed selected:", current_speed);
});