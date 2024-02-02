window.onload = function () {
    var username = sessionStorage.getItem("login");
    if (username) {
      document.getElementById("login").textContent = username;
    }
    loadTasks();
  };
const tasks = document.querySelectorAll('.task')
const panels = document.querySelectorAll('.panel')

function attachDragAndDropListeners(task) { // Adiciona os listeners de drag and drop a uma tarefa criada dinamicamente
  task.addEventListener('dragstart', () => {
      task.classList.add('dragging')
  });

  task.addEventListener('dragend', () => {
      task.classList.remove('dragging')
  });
}

panels.forEach(panel => { // Adiciona os listeners de drag and drop a um painel
  panel.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(panel, e.clientY)
    const task = document.querySelector('.dragging')
    const panelID = document.getElementById(panel.id) // guarda o id do painel onde a tarefa vai ser colocada
    if (afterElement == null) {
      panel.appendChild(task)
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) { // percorre o array de tarefas e altera o status da tarefa para o painel onde foi colocada
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID; // actualiza o status da tarefa
        }
      }
      saveTasks();
    } else {
      panel.insertBefore(task, afterElement)
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID;
        }
      }
      saveTasks(); // guarda as alteracoes no local storage
    }
  })
})

// Get the priority buttons
const lowButton = document.getElementById("low-button-home");
const mediumButton = document.getElementById("medium-button-home");
const highButton = document.getElementById("high-button-home");
let taskPriority;


function setPriorityButtonSelected(button, priority) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  taskPriority = priority;
}
function removeSelectedPriorityButton() {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach(btn => btn.classList.remove("selected"));
}



// Event listeners for priority buttons
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton, "low"));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton, "medium"));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton, "high"));

function getDragAfterElement(panel, y) {
    const draggableElements = [...panel.querySelectorAll('.task:not(.dragging)')] // dentro da lista de paineis, seleciona todos os elementos com a classe task que nao tenham a classe dragging  
    return draggableElements.reduce((closest, child) => {// retorna o elemento mais proximo do elemento que esta a ser arrastado e que esta a ser comparado
        const box = child.getBoundingClientRect() // retorna o tamanho do elemento e a sua posicao relativa ao viewport
        const offset = y - box.top - box.height / 2// calcula a distancia entre o elemento que esta a ser arrastado e o elemento que esta a ser comparado
        if (offset < 0 && offset > closest.offset) {// se a distancia for menor que 0 e maior que a distancia do elemento mais proximo ate agora
            return { offset: offset, element: child }
        } else { //
            return closest // retorna o elemento mais proximo ate agora
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element} 

document.getElementById('addTask').addEventListener('click', function() {
  var Description = taskDescription.value.trim();
  var Name = taskName.value.trim();
  var priority = taskPriority;
  if (Name === '' || Description === '' || priority === null) {
    document.getElementById('warningMessage2').innerText = 'Fill in all fields and define a priority';
  } else {
    document.getElementById('warningMessage2').innerText = '';
  }
  if (Name.trim() !== '' && Description.trim() !== '' && priority !== null){
      const task = createTask(Name, Description, priority);
      const taskElement =createTaskElement(task);
     document.getElementById('todo').appendChild(taskElement);

      // Attach drag and drop listeners to the dynamically created task
      attachDragAndDropListeners(taskElement);

      // Clear input fields after adding task
      document.getElementById('taskName').value = '';
      document.getElementById('taskDescription').value = '';
      removeSelectedPriorityButton();
      taskPriority = null;

  }
  saveTasks();
});

function createTask(name, description, priority) {  // Cria uma tarefa com o nome e descrição passados como argumento 
  const task = {
  title :name,
  description: description,
  identificacao: 'task-' + Date.now(),
  status: 'todo',
  priority: priority
  }
  return task;
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.id = task.identificacao;
    taskElement.priority = task.priority;
    taskElement.classList.add('task'); 
    if (task.priority === 'low') {
        taskElement.classList.add('low');
    } else if (task.priority === 'medium') {
        taskElement.classList.add('medium');
    } else if (task.priority === 'high') {
        taskElement.classList.add('high');
    }
    taskElement.draggable = true;
    taskElement.description = task.description;
    taskElement.title = task.title;
    taskElement.status = task.status;

    const postIt = document.createElement('div');
    postIt.className = 'post-it';

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.title;
    const descriprioncontainer = document.createElement('div');
    descriprioncontainer.className = 'post-it-text';
    const displayDescription = document.createElement('p');
    displayDescription.textContent = task.description;

    const deleteButton = document.createElement('img');
    deleteButton.src = 'multimedia/dark-cross-01.png';
    deleteButton.className = 'apagarButton';
    deleteButton.addEventListener('click', function () {
        const  deletemodal = document.getElementById('delete-modal');
         deletemodal.style.display = "grid"; 
        const deletebtn = document.getElementById('delete-button');
        deletebtn.addEventListener('click', () => {
            deleteTask(taskElement.id);
            taskElement.remove();
            deletemodal.style.display = "none";
        });
        const cancelbtn = document.getElementById('cancel-delete-button');
        cancelbtn.addEventListener('click', () => {
            deletemodal.style.display = "none";
        });
    });
    descriprioncontainer.appendChild(displayDescription);
    postIt.appendChild(taskTitle);
    postIt.appendChild(deleteButton);
    taskElement.appendChild(postIt);
    postIt.appendChild(descriprioncontainer);
    taskElement.addEventListener('dblclick', function () {
        sessionStorage.setItem("taskDescription", taskElement.description);
        sessionStorage.setItem("taskTitle", taskElement.title);
        sessionStorage.setItem("taskid", taskElement.id);
        sessionStorage.setItem("taskStatus", taskElement.status);
        sessionStorage.setItem("taskPriority", taskElement.priority);
        window.location.href = 'task.html';
    });

    return taskElement;
}

// salva as tarefas no local storage
function saveTasks() {
  const tasks = document.querySelectorAll('.task');
  const taskArrays = {
    todo: [],
    doing: [],
    done: []
  };
  
  tasks.forEach(task => {
    const taskData = {
      identificacao: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    };

    // Determine the status of the task and push it to the corresponding array
    taskArrays[task.status].push(taskData);
  });

  // Combine all task arrays into a single array
  const tasksArray = [taskArrays.todo, taskArrays.doing, taskArrays.done];

  // Save the combined task array to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}
// carrrega as tarefas guardadas no local storage
function loadTasks() {
  const tasksArray = JSON.parse(localStorage.getItem('tasks'));

  if (tasksArray) { // Check if tasksArray is not null
    // Define an array to store all task arrays
    const allTasks = tasksArray.reduce((acc, curr) => acc.concat(curr), []);// concatena todos os arrays de tarefas num unico array
      // a função reduce() executa uma função reducer (fornecida por você) para cada elemento do array, resultando num único valor de retorno. a função reducer é alimentada por quatro parâmetros:
      // Acumulador (acc) (valor inicial igual ao primeiro valor do array, ou valor do parâmetro initialValue);
      // Valor Atual (cur) (o valor do elemento atual);
      // Index Atual (idx) (o índice atual do elemento sendo processado no array);
      // Array (src) (o array original ao qual a função reduce() foi chamada).
      // O valor retornado da sua função reducer é atribuída ao acumulador. O acumulador, com seu valor atualizado, é repassado para cada iteração subsequente pelo array, que por fim, se tornará o valor resultante, único, final.
    allTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const panel = document.getElementById(task.status);
      panel.appendChild(taskElement);
      attachDragAndDropListeners(taskElement);
    });
  }
}

function deleteTask(id) {
  const tasksArray = JSON.parse(localStorage.getItem('tasks'));

  // Iterate over all task arrays to find and remove the task
  tasksArray.forEach(taskArray => {
    const index = taskArray.findIndex(task => task.identificacao === id);// retorna o index da tarefa com o id passado como argumento
    if (index !== -1) { // se o index for diferente de -1
      taskArray.splice(index, 1); // remove a tarefa do array
      const taskElement = document.getElementById(id); // guarda o elemento da tarefa
      taskElement.remove(); // remove o elemento da tarefa
    }
    saveTasks();
  });
}

window.onclose = function () { // guarda as tarefas no local storage quando a pagina e fechada
  saveTasks();
}
const displayTime = document.querySelector(".display-time");
// Time

function showTime() {
  let time = new Date();
  let timeString = time.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' });
  displayTime.innerText = timeString;
  setTimeout(showTime, 1000);
}

showTime();

// Date
function updateDate() { // mostra a data atual
  let today = new Date();

  // return number
  let dayName = today.getDay(), // 0 - 6
    dayNum = today.getDate(), // 1 - 31
    month = today.getMonth(), // 0 - 11
    year = today.getFullYear(); // 2020

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // value -> ID of the html element
  const IDCollection = ["day", "daynum", "month", "year"]; // array com os ids dos elementos html que vao mostrar a data
  // return value array with number as a index
  const val = [dayWeek[dayName], dayNum, months[month], year]; // array com os valores que vao ser mostrados nos elementos html
  for (let i = 0; i < IDCollection.length; i++) { // percorre o array de ids
    document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i]; // altera o valor do elemento html com o id correspondente
  }
}

updateDate();