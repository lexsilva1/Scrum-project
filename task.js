window.onload = function () {
    var username = sessionStorage.getItem("login"); // Get the username from the session storage
    var descricao = sessionStorage.getItem("taskDescription"); // Get the description from the session storage
    var titulo = sessionStorage.getItem("taskTitle"); // Get the title from the session storage
    if (username) {
      document.getElementById("login").textContent = username; // Set the username in the navbar
      document.getElementById('titulo-task').textContent = titulo; // Set the title in the input
      document.getElementById('descricao-task').textContent=descricao; // Set the description in the input
      document.getElementById('tasktitle').innerHTML = titulo; // Set the title in the task title
    }
};


// Get the status buttons
const todoButton = document.getElementById("todo-button"); // Get the todo button
const doingButton = document.getElementById("doing-button"); // Get the doing button
const doneButton = document.getElementById("done-button"); // Get the done button


// Get the priority buttons
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

// Set the todo-button as the default selected button
var taskStatus = sessionStorage.getItem("taskStatus");
if(taskStatus == "todo"){
todoButton.classList.add("selected");
} else if( taskStatus== "doing"){
doingButton.classList.add("selected");
} else if(taskStatus == "done"){
doneButton.classList.add("selected");
}

// Set the low-button as the default selected button
var taskPriority = sessionStorage.getItem("taskPriority");
if(taskPriority == "low"){
    lowButton.classList.add("selected");
} else if( taskPriority== "medium"){
    mediumButton.classList.add("selected");
} else if(taskPriority == "high"){
    highButton.classList.add("selected");
}
// Function to set the selected state for status buttons
function setStatusButtonSelected(button, status) {
    const buttons = [todoButton, doingButton, doneButton];
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    sessionStorage.setItem("taskStatus", status);
}

// Function to set the selected state for priority buttons
function setPriorityButtonSelected(button, priority) {
    const buttons = [lowButton, mediumButton, highButton];
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    sessionStorage.setItem("taskPriority", priority);
}

// Event listeners for status buttons
todoButton.addEventListener("click", () => setStatusButtonSelected(todoButton, "todo"));
doingButton.addEventListener("click", () => setStatusButtonSelected(doingButton, "doing"));
doneButton.addEventListener("click", () => setStatusButtonSelected(doneButton, "done"));

// Event listeners for priority buttons
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton, "low"));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton, "medium"));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton, "high"));

const cancelbutton = document.getElementById("cancel-button");
cancelbutton.addEventListener("click", () => {
    // Open the cancel modal
    const cancelModal = document.getElementById("cancel-modal");
    cancelModal.style.display = "block";


    const cancelButton = document.getElementById("continue-editing-button");
    cancelButton.addEventListener("click", () => {
        window.location.href = 'task.html';
    });

    // Event listener for the confirm button
    const confirmButton = document.getElementById("confirm-cancel-button");
    confirmButton.addEventListener("click", () => {
        sessionStorage.removeItem("taskDescription");
        sessionStorage.removeItem("taskTitle");
        sessionStorage.removeItem("taskid");
        sessionStorage.removeItem("taskStatus");
        sessionStorage.removeItem("taskPriority");
        window.location.href = 'home.html';    
    });
    cancelModal.style.display = "grid";
});

// Function to update the tasks
const updateTasks = (tasks, taskid, taskStatus, taskDescription, taskTitle, taskPriority) => {
    tasks.forEach(category => {
        category.forEach(task => {
            if (task.identificacao === taskid) {
                task.title = taskTitle;
                task.description = taskDescription;
                task.status = taskStatus;
                task.priority = taskPriority;
            }
        });
    });
};

// Event listener for the save button
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", () => {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    var taskid = sessionStorage.getItem("taskid");
    var taskStatus = sessionStorage.getItem("taskStatus");
    var taskDescription = document.getElementById("descricao-task").value.trim();
    var taskTitle = document.getElementById("titulo-task").value.trim();
    var taskPriority = sessionStorage.getItem("taskPriority");
    
    if (taskDescription === "" || taskTitle === "") {
        document.getElementById('warningMessage3').innerText = 'Your task must have a title and a description';
            return;
    } else {
        // limpa mendagem de erro
        document.getElementById('warningMessage3').innerText = '';
    }
   
    updateTasks(tasks, taskid, taskStatus, taskDescription, taskTitle, taskPriority);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    sessionStorage.removeItem("taskDescription");
    sessionStorage.removeItem("taskTitle");
    sessionStorage.removeItem("taskid");
    sessionStorage.removeItem("taskStatus");
    sessionStorage.removeItem("taskPriority");
    window.location.href = 'home.html';
});
