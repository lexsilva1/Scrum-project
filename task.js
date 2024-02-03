window.onload = function () {
    var username = sessionStorage.getItem("login"); // Obter o user da session storage
    var descricao = sessionStorage.getItem("taskDescription"); // Obter a descrição da session storage
    var titulo = sessionStorage.getItem("taskTitle"); // Obter o título da session storage
    if (username) {
        document.getElementById("login").textContent = username; // Colocar o user no header
        document.getElementById('titulo-task').textContent = titulo; // Colocar o título no input title
        document.getElementById('descricao-task').textContent = descricao; // Colocar a descrição na text area
        document.getElementById('tasktitle').innerHTML = titulo; // Colocar o título no título da página
        document.getElementById("task-bc").textContent = titulo; // Colocar o título no breadcrumb
    }
};


// Definir os botões de status
const todoButton = document.getElementById("todo-button"); // Atribuir o elemento respetivo à variável todoButton
const doingButton = document.getElementById("doing-button"); // Atribuir o elemento respetivo à variável doingButton
const doneButton = document.getElementById("done-button"); // Atribuir o elemento respetivo à variável doneButton


// Definir os botões de priority
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

// Definir o botão To Do como default
var taskStatus = sessionStorage.getItem("taskStatus");
if(taskStatus == "todo"){
todoButton.classList.add("selected");
} else if( taskStatus== "doing"){
doingButton.classList.add("selected");
} else if(taskStatus == "done"){
doneButton.classList.add("selected");
}

// Definir o botão Low como default
var taskPriority = sessionStorage.getItem("taskPriority");
if(taskPriority == "low"){
    lowButton.classList.add("selected");
} else if( taskPriority== "medium"){
    mediumButton.classList.add("selected");
} else if(taskPriority == "high"){
    highButton.classList.add("selected");
}
// Função para definir o estado no grupo de botões status
function setStatusButtonSelected(button, status) {
    const buttons = [todoButton, doingButton, doneButton];
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    sessionStorage.setItem("taskStatus", status);
}

// Função para definir o estado no grupo de botões priority
function setPriorityButtonSelected(button, priority) {
    const buttons = [lowButton, mediumButton, highButton];
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    sessionStorage.setItem("taskPriority", priority);
}

// Event listeners para os botões status
todoButton.addEventListener("click", () => setStatusButtonSelected(todoButton, "todo"));
doingButton.addEventListener("click", () => setStatusButtonSelected(doingButton, "doing"));
doneButton.addEventListener("click", () => setStatusButtonSelected(doneButton, "done"));

// Event listeners para os botões priority
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton, "low"));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton, "medium"));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton, "high"));

const cancelbutton = document.getElementById("cancel-button");
cancelbutton.addEventListener("click", () => {
    // Abrir o modal de cancel
    const cancelModal = document.getElementById("cancel-modal");
    cancelModal.style.display = "block";


    const cancelButton = document.getElementById("continue-editing-button");
    cancelButton.addEventListener("click", () => {
        window.location.href = 'task.html';
    });

    // Event listener para o botão de confirmação
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

// Função para update das tasks
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

// Event listener para o botão save
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
        // Limpa mensagem de erro
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
