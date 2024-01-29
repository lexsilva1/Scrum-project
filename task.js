// Get the status buttons
const todoButton = document.getElementById("todo-button");
const doingButton = document.getElementById("doing-button");
const doneButton = document.getElementById("done-button");

// Set the todo-button as the default selected button
todoButton.classList.add("selected");

// Add event listeners to the status buttons
todoButton.addEventListener("click", () => {
    todoButton.classList.add("selected");
    doingButton.classList.remove("selected");
    doneButton.classList.remove("selected");
});

doingButton.addEventListener("click", () => {
    todoButton.classList.remove("selected");
    doingButton.classList.add("selected");
    doneButton.classList.remove("selected");
});

doneButton.addEventListener("click", () => {
    todoButton.classList.remove("selected");
    doingButton.classList.remove("selected");
    doneButton.classList.add("selected");
});
// Get the priority buttons
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

// Set the low-button as the default selected button
lowButton.classList.add("selected");

// Add event listeners to the priority buttons
lowButton.addEventListener("click", () => {
    lowButton.classList.add("selected");
    mediumButton.classList.remove("selected");
    highButton.classList.remove("selected");
});

mediumButton.addEventListener("click", () => {
    lowButton.classList.remove("selected");
    mediumButton.classList.add("selected");
    highButton.classList.remove("selected");
});

highButton.addEventListener("click", () => {
    lowButton.classList.remove("selected");
    mediumButton.classList.remove("selected");
    highButton.classList.add("selected");
});
