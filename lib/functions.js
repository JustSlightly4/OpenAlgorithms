export function swap(arr, idxA, idxB) {
    let temp = arr[idxA];
    arr[idxA] = arr[idxB];
    arr[idxB] = temp;
}

export function toggle_controls(isDisabled, buttonIds = []) {
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = isDisabled;
        }
    });
}