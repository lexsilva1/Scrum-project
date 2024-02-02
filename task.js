window.onload = function () {
    var username = sessionStorage.getItem("login");
    var descricao = sessionStorage.getItem("taskDescription");
    var titulo = sessionStorage.getItem("taskTitle");
    if (username) {
      document.getElementById("login").textContent = username;
      document.getElementById('titulo-task').textContent = titulo;
      document.getElementById('descricao-task').textContent=descricao;
    }
};


// Get the status buttons
const todoButton = document.getElementById("todo-button");
const doingButton = document.getElementById("doing-button");
const doneButton = document.getElementById("done-button");
// Remove the existing declaration of lowButton
// const lowButton = document.getElementById("low-button");


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

const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", () => {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    var taskid = sessionStorage.getItem("taskid");
    var taskStatus = sessionStorage.getItem("taskStatus");
    var taskDescription = document.getElementById("descricao-task").value.trim();
    var taskTitle = document.getElementById("titulo-task").value.trim();
    var taskPriority = sessionStorage.getItem("taskPriority");
    if(taskDescription == "" || taskTitle == ""){
        alert("Por favor preencha todos os campos");
        return;
    }
   
    tasks[0].forEach(task => {
        if(task.identificacao == taskid){
            task.title = taskTitle;
            task.description = taskDescription;
            task.status = taskStatus;
            task.priority = taskPriority;
        }
    });

    tasks[1].forEach(task => {
        if(task.identificacao == taskid){
            task.title = taskTitle;
            task.description = taskDescription;
            task.status = taskStatus;
            task.priority = taskPriority;
        }
    });

    tasks[2].forEach(task => {
        if(task.identificacao == taskid){
            task.title = taskTitle;
            task.description = taskDescription;
            task.status = taskStatus;
            task.priority = taskPriority;
        }
    });


    localStorage.setItem("tasks", JSON.stringify(tasks));
    sessionStorage.removeItem("taskDescription");
    sessionStorage.removeItem("taskTitle");
    sessionStorage.removeItem("taskid");
    sessionStorage.removeItem("taskStatus");
    sessionStorage.removeItem("taskPriority");
    window.location.href = 'home.html';
});





