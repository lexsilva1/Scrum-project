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

// Set the todo-button as the default selected button
var taskStatus = sessionStorage.getItem("taskStatus");
if(taskStatus == "panel1"){
todoButton.classList.add("selected");
} else if( taskStatus== "panel2"){
doingButton.classList.add("selected");
} else if(taskStatus == "panel3"){
doneButton.classList.add("selected");
}

// Add event listeners to the status buttons
todoButton.addEventListener("click", () => {
    todoButton.classList.add("selected");
    doingButton.classList.remove("selected");
    doneButton.classList.remove("selected");
    sessionStorage.setItem("taskStatus", "panel1");
});

doingButton.addEventListener("click", () => {
    todoButton.classList.remove("selected");
    doingButton.classList.add("selected");
    doneButton.classList.remove("selected");
    sessionStorage.setItem("taskStatus", "panel2");
});

doneButton.addEventListener("click", () => {
    todoButton.classList.remove("selected");
    doingButton.classList.remove("selected");
    doneButton.classList.add("selected");
    sessionStorage.setItem("taskStatus", "panel3");
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
const cancelbutton = document.getElementById("cancel-button");
cancelbutton.addEventListener("click", () => {
    sessionStorage.removeItem("taskDescription");
    sessionStorage.removeItem("taskTitle");
    sessionStorage.removeItem("taskid");
    sessionStorage.removeItem("taskStatus");
    window.location.href = 'home.html';
});
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", () => {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    var taskid = sessionStorage.getItem("taskid");
    var taskStatus = sessionStorage.getItem("taskStatus");
    var taskDescription = document.getElementById("descricao-task").value.trim();
    var taskTitle = document.getElementById("titulo-task").value.trim();
    if(taskDescription == "" || taskTitle == ""){
        alert("Por favor preencha todos os campos");
        return;
    }
   
    tasks[0].forEach(task => {
        if(task.identificacao == taskid){
            task.title = taskTitle;
            task.description = taskDescription;
            task.status = taskStatus;
        }
    });

    tasks[1].forEach(task => {
        if(task.identificacao == taskid){
            task.title = taskTitle;
            task.description = taskDescription;
            task.status = taskStatus;
        }
    });

    tasks[2].forEach(task => {
        if(task.identificacao == taskid){
            task.title = taskTitle;
            task.description = taskDescription;
            task.status = taskStatus;
        }
    });


    localStorage.setItem("tasks", JSON.stringify(tasks));
    sessionStorage.removeItem("taskDescription");
    sessionStorage.removeItem("taskTitle");
    sessionStorage.removeItem("taskid");
    sessionStorage.removeItem("taskStatus");
    window.location.href = 'home.html';
});





